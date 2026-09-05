import { runRole, profiles, type Assignment, type RoleOutput } from "./roles.js";
/** Original teaching core: validates a tiny local workflow, not arbitrary execution authority. */
export interface Binding { root: string; commit: string; inputDigest: string }
export interface Plan { id: string; objective: string; checkId: "fixture-roles-v2"; binding: Binding }
export interface Evidence { attemptId: string; outcome: "passed" | "failed"; message: string }
export type Event = { version: 2; id: string } & (
  | { kind: "proposed"; plan: Plan }
  | { kind: "confirmed"; planId: string; binding: Binding; source: "operator-command" }
  | { kind: "role-completed"; planId: string; binding: Binding; assignment: Assignment; output: RoleOutput }
  | { kind: "checked"; planId: string; binding: Binding; evidence: Evidence }
  | { kind: "completed"; planId: string; binding: Binding }
  | { kind: "reset" }
);
export interface State {
  phase: "inactive" | "proposed" | "confirmed" | "collected" | "judged" | "applied" | "checked" | "complete";
  plan?: Plan;
  evidence?: Evidence;
  handoff?: { id: string; assignment: Assignment; output: RoleOutput };
  source?: string;
}
export const MAX_EVENTS = 256;
export const initial = (): State => ({ phase: "inactive" });
export function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function record(value: unknown, keys: string[]): Record<string, unknown> {
  requireCondition(value && typeof value === "object" && !Array.isArray(value), "Expected an object");
  const obj = value as Record<string, unknown>;
  requireCondition(Object.keys(obj).length === keys.length && keys.every(k => Object.hasOwn(obj, k)), "Unknown or missing record fields");
  return obj;
}
function text(value: unknown, max = 240): asserts value is string {
  requireCondition(typeof value === "string" && value.trim().length > 0 && value.length <= max && !/[\u0000-\u001f\u007f-\u009f]/u.test(value), "Invalid bounded text");
}
function binding(value: unknown): asserts value is Binding {
  const b = record(value, ["root", "commit", "inputDigest"]);
  text(b.root, 4096);
  requireCondition(typeof b.commit === "string" && /^[a-f0-9]{40,64}$/.test(b.commit), "Invalid commit");
  requireCondition(typeof b.inputDigest === "string" && /^[a-f0-9]{64}$/.test(b.inputDigest), "Invalid input digest");
}
export function parseEvent(value: unknown): Event {
  requireCondition(value && typeof value === "object", "Invalid event");
  const raw = value as Record<string, unknown>;
  requireCondition(raw.version === 2, "Unsupported event version");
  text(raw.id, 80);
  if (raw.kind === "reset") record(raw, ["version", "id", "kind"]);
  else if (raw.kind === "proposed") {
    record(raw, ["version", "id", "kind", "plan"]);
    const p = record(raw.plan, ["id", "objective", "checkId", "binding"]);
    text(p.id, 80); text(p.objective); binding(p.binding);
    requireCondition(p.checkId === "fixture-roles-v2", "Unknown check");
  } else if (raw.kind === "role-completed") {
    record(raw, ["version", "id", "kind", "planId", "binding", "assignment", "output"]);
    text(raw.planId, 80); binding(raw.binding);
    const a = record(raw.assignment, ["id", "role", "planId", "binding", "inputId", "target"]);
    text(a.id, 80); text(a.planId, 80); text(a.inputId, 80); binding(a.binding);
    requireCondition(typeof a.role === "string" && Object.hasOwn(profiles, a.role), "Unknown worker role");
    requireCondition(a.target === profiles[a.role as keyof typeof profiles].target, "Assignment target exceeds role scope");
    requireCondition(raw.output && typeof raw.output === "object", "Invalid role output");
    requireCondition(JSON.stringify(raw.output).length <= 8192, "Role output exceeds limit");
  } else if (raw.kind === "confirmed" || raw.kind === "checked" || raw.kind === "completed") {
    record(raw, ["version", "id", "kind", "planId", "binding", ...(raw.kind === "confirmed" ? ["source"] : raw.kind === "checked" ? ["evidence"] : [])]);
    text(raw.planId, 80); binding(raw.binding);
    if (raw.kind === "confirmed") requireCondition(raw.source === "operator-command", "Confirmation must originate from the operator command");
    if (raw.kind === "checked") {
      const e = record(raw.evidence, ["attemptId", "outcome", "message"]);
      text(e.attemptId, 80); text(e.message);
      requireCondition(e.outcome === "passed" || e.outcome === "failed", "Invalid check result");
    }
  } else throw new Error("Unknown event kind");
  return structuredClone(value) as Event;
}
export function sameBinding(a: Binding, b: Binding): boolean {
  return a.root === b.root && a.commit === b.commit && a.inputDigest === b.inputDigest;
}
export function assertCurrent(state: State, current: Binding): Plan {
  requireCondition(state.plan && sameBinding(state.plan.binding, current), "Plan inputs changed; propose and confirm a new plan");
  return state.plan;
}
export function transition(state: State, event: Event): State {
  if (event.kind === "reset") return initial();
  if (event.kind === "proposed") return { phase: "proposed", plan: structuredClone(event.plan) };
  const plan = assertCurrent(state, event.binding);
  requireCondition(event.planId === plan.id, "Wrong plan identity");
  if (event.kind === "confirmed") {
    requireCondition(state.phase === "proposed", "Only a proposed plan can be confirmed");
    return { phase: "confirmed", plan };
  }
  if (event.kind === "role-completed") {
    const expected = state.phase === "confirmed" ? "collect" : state.phase === "collected" ? "judge" : state.phase === "judged" ? "mechanical" : undefined;
    const a = event.assignment;
    requireCondition(expected && a.role === expected, "Role handoff is out of order or lacks confirmation");
    requireCondition(a.planId === plan.id && sameBinding(a.binding, event.binding), "Wrong assignment identity");
    requireCondition(a.inputId === (state.handoff?.id ?? plan.id), "Stale handoff identity");
    const source = a.role === "collect" && event.output.role === "collect" ? event.output.source : state.source;
    requireCondition(typeof source === "string", "Missing collected source");
    const output = runRole(expected, a, source, state.handoff?.output);
    requireCondition(canonical(output) === canonical(event.output), "Role output violates its assignment or frozen decision");
    return { ...state, phase: expected === "collect" ? "collected" : expected === "judge" ? "judged" : "applied", source, handoff: { id: a.id, assignment: structuredClone(a), output } };
  }
  if (event.kind === "checked") {
    requireCondition(state.phase === "applied", "One check requires an unconsumed applied candidate and operator confirmation");
    return { ...state, phase: "checked", evidence: structuredClone(event.evidence) };
  }
  requireCondition(state.phase === "checked" && state.evidence?.outcome === "passed", "Completion requires a current passing fixture check");
  return { ...state, phase: "complete" };
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  return JSON.stringify(value);
}
export function replay(values: readonly unknown[]): State {
  requireCondition(values.length <= MAX_EVENTS, "Demo history limit reached; use a new isolated session");
  let state = initial();
  const seen = new Map<string, string>();
  const assignments = new Set<string>();
  for (const value of values) {
    const event = parseEvent(value);
    const payload = canonical(event);
    if (seen.has(event.id)) {
      requireCondition(seen.get(event.id) === payload, "Conflicting duplicate event ID");
      continue;
    }
    if (event.kind === "role-completed") {
      requireCondition(!assignments.has(event.assignment.id), "Reused assignment identity");
      assignments.add(event.assignment.id);
    }
    state = transition(state, event);
    seen.set(event.id, payload);
  }
  return state;
}
export function summary(state: State): string {
  const next = state.phase === "inactive" ? "propose" : state.phase === "proposed" ? "confirm" : state.phase === "confirmed" ? "collect" : state.phase === "collected" ? "judge" : state.phase === "judged" ? "apply" : state.phase === "applied" ? "check" : state.phase === "checked" ? state.evidence?.outcome === "passed" ? "close" : "diagnose and propose again" : "reset or propose";
  return `Fixture demo: ${state.phase}; check=${state.evidence?.outcome ?? "not run"}; next=${next}.`;
}
