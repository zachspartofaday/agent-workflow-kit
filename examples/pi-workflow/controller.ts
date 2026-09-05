import { runRole, profiles, type Role, type Assignment } from "./roles.js";
import { randomUUID } from "node:crypto";
import { assertCurrent, initial, parseEvent, replay, requireCondition, sameBinding, summary, type Binding, type Event, type State } from "./core.js";
import { checkFixture, inspect } from "./fixture.js";
export interface Ports {
  inspect(cwd: string): { binding: Binding; bytes: Buffer };
  append(event: Event): void;
  id(): string;
}
/** Session-scoped controller. No shell supplied by the model, no background tasks. */
export class Controller {
  private events: Event[] = [];
  private state: State = initial();
  private generation = 0;
  private restoringError?: string;
  private pending = false;
  private persistenceFailed = false;
  constructor(private ports: Ports) {}
  restore(values: unknown[]): void {
    this.generation++;
    this.pending = false;
    if (this.persistenceFailed) return;
    try {
      const state = replay(values);
      this.events = values.map(parseEvent);
      this.state = state;
      this.restoringError = undefined;
    } catch {
      this.events = []; this.state = initial();
      this.restoringError = "Invalid demo history; start a new isolated session. No history was changed.";
    }
  }
  stop(): void { this.generation++; this.pending = false; }
  getState(): State { return structuredClone(this.state); }
  status(cwd: string): string {
    if (this.restoringError) return this.restoringError;
    if (this.state.plan) {
      try { assertCurrent(this.state, this.ports.inspect(cwd).binding); }
      catch { return "Fixture demo: stale or unavailable inputs; propose and confirm a new plan."; }
    }
    return summary(this.state);
  }
  private available(): void { requireCondition(!this.restoringError, this.restoringError ?? "Unavailable"); }
  private commit(event: Event): void {
    this.available();
    const next = replay([...this.events, event]);
    // Pi may update its in-memory branch before disk I/O fails. Poison this controller on failure.
    try { this.ports.append(event); }
    catch {
      this.persistenceFailed = true;
      this.restoringError = "Demo persistence failed; stop this session and inspect storage before restarting.";
      this.generation++; this.pending = false;
      throw new Error(this.restoringError);
    }
    this.events.push(event); this.state = next;
  }
  propose(objective: string, cwd: string): void {
    this.available();
    requireCondition(!this.pending, "An operator decision is pending");
    const event: Event = { version: 2, id: this.ports.id(), kind: "proposed", plan: { id: this.ports.id(), objective, checkId: "fixture-roles-v2", binding: this.ports.inspect(cwd).binding } };
    this.commit(event);
  }
  async confirm(cwd: string, decide: (description: string) => Promise<boolean>): Promise<void> {
    this.available();
    requireCondition(!this.pending, "An operator decision is pending");
    requireCondition(this.state.phase === "proposed", "Propose a plan first");
    const plan = assertCurrent(this.state, this.ports.inspect(cwd).binding);
    const generation = this.generation;
    this.pending = true;
    try {
      const approved = await decide(`Plan ${plan.id}\n${plan.objective}\nOne fixture-roles-v2 route: collector reads the fixture, judge freezes ready=true, mechanical writer creates a session candidate, then validation. No repository edits, model workers, review or merge.`);
      requireCondition(generation === this.generation, "Session changed; confirmation discarded");
      requireCondition(approved, "Confirmation cancelled; plan remains unconfirmed");
      const current = this.ports.inspect(cwd).binding;
      assertCurrent(this.state, current);
      requireCondition(this.state.plan?.id === plan.id, "Plan changed during confirmation");
      this.commit({ version: 2, id: this.ports.id(), kind: "confirmed", planId: plan.id, binding: current, source: "operator-command" });
    } finally { if (generation === this.generation) this.pending = false; }
  }
  report(cwd: string): string {
    this.available();
    assertCurrent(this.state, this.ports.inspect(cwd).binding);
    return JSON.stringify({ phase: this.state.phase, planId: this.state.plan?.id, handoff: this.state.handoff, evidence: this.state.evidence }, null, 2);
  }
  run(role: Role, cwd: string): void {
    this.available();
    const expected = this.state.phase === "confirmed" ? "collect" : this.state.phase === "collected" ? "judge" : this.state.phase === "judged" ? "mechanical" : undefined;
    requireCondition(expected && role === expected, "Role handoff is out of order or lacks confirmation");
    const before = this.ports.inspect(cwd);
    const plan = assertCurrent(this.state, before.binding);
    requireCondition(Object.hasOwn(profiles, role), "Unknown worker role");
    const assignment: Assignment = { id: this.ports.id(), role, planId: plan.id, binding: before.binding,
      inputId: this.state.handoff?.id ?? plan.id, target: profiles[role].target };
    const output = runRole(role, assignment, before.bytes.toString("utf8"), this.state.handoff?.output);
    const after = this.ports.inspect(cwd);
    requireCondition(sameBinding(before.binding, after.binding), "Inputs changed during role execution; propose a new plan");
    this.commit({ version: 2, id: this.ports.id(), kind: "role-completed", planId: plan.id, binding: after.binding, assignment, output });
  }
  check(cwd: string): void {
    this.available();
    requireCondition(this.state.phase === "applied", "An applied candidate and unconsumed operator confirmation are required");
    const before = this.ports.inspect(cwd);
    const plan = assertCurrent(this.state, before.binding);
    const output = this.state.handoff?.output;
    requireCondition(output?.role === "mechanical", "Missing mechanical candidate");
    const result = checkFixture(Buffer.from(JSON.stringify(output.candidate)));
    const after = this.ports.inspect(cwd);
    requireCondition(sameBinding(before.binding, after.binding), "Inputs changed during check; propose a new plan");
    this.commit({ version: 2, id: this.ports.id(), kind: "checked", planId: plan.id, binding: after.binding, evidence: { attemptId: this.ports.id(), ...result } });
  }
  close(cwd: string): void {
    this.available();
    const current = this.ports.inspect(cwd).binding;
    const plan = assertCurrent(this.state, current);
    this.commit({ version: 2, id: this.ports.id(), kind: "completed", planId: plan.id, binding: current });
  }
  reset(): void {
    this.commit({ version: 2, id: this.ports.id(), kind: "reset" });
    this.generation++; this.pending = false;
  }
}
export const defaultPorts = { inspect, id: randomUUID };
