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
    const event: Event = { version: 1, id: this.ports.id(), kind: "proposed", plan: { id: this.ports.id(), objective, checkId: "fixture-v1", binding: this.ports.inspect(cwd).binding } };
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
      const approved = await decide(`Plan ${plan.id}\n${plan.objective}\nOne fixture-v1 read/check only. No edits, workers, review or merge.`);
      requireCondition(generation === this.generation, "Session changed; confirmation discarded");
      requireCondition(approved, "Confirmation cancelled; plan remains unconfirmed");
      const current = this.ports.inspect(cwd).binding;
      assertCurrent(this.state, current);
      requireCondition(this.state.plan?.id === plan.id, "Plan changed during confirmation");
      this.commit({ version: 1, id: this.ports.id(), kind: "confirmed", planId: plan.id, binding: current, source: "operator-command" });
    } finally { if (generation === this.generation) this.pending = false; }
  }
  check(cwd: string): void {
    this.available();
    requireCondition(this.state.phase === "confirmed", "An unconsumed operator confirmation is required");
    const before = this.ports.inspect(cwd);
    const plan = assertCurrent(this.state, before.binding);
    const result = checkFixture(before.bytes);
    const after = this.ports.inspect(cwd);
    requireCondition(sameBinding(before.binding, after.binding), "Inputs changed during check; propose a new plan");
    this.commit({ version: 1, id: this.ports.id(), kind: "checked", planId: plan.id, binding: after.binding, evidence: { attemptId: this.ports.id(), ...result } });
  }
  close(cwd: string): void {
    this.available();
    const current = this.ports.inspect(cwd).binding;
    const plan = assertCurrent(this.state, current);
    this.commit({ version: 1, id: this.ports.id(), kind: "completed", planId: plan.id, binding: current });
  }
  reset(): void {
    this.commit({ version: 1, id: this.ports.id(), kind: "reset" });
    this.generation++; this.pending = false;
  }
}
export const defaultPorts = { inspect, id: randomUUID };
