/** Deterministic teaching workers. No model, filesystem write or child-dispatch capability. */
import { createHash } from "node:crypto";
import { requireCondition, type Binding } from "./core.js";
export const SOURCE = "examples/pi-workflow/fixture.json";
export const CANDIDATE = "session:candidate";
export type Role = "collect" | "judge" | "mechanical";
export interface Fixture { schema: 1; lesson: "evidence"; ready: boolean }
export interface Assignment {
  id: string;
  role: Role;
  planId: string;
  binding: Binding;
  inputId: string;
  target: typeof SOURCE | typeof CANDIDATE;
}
export type RoleOutput =
  | { role: "collect"; source: string }
  | { role: "judge"; before: Fixture; after: Fixture; field: "ready" }
  | { role: "mechanical"; candidate: Fixture };
export const profiles = {
  collect: { target: SOURCE, purpose: "Read exact fixture bytes; return evidence, no edits" },
  judge: { target: SOURCE, purpose: "Check evidence; freeze ready=true, no edits" },
  mechanical: { target: CANDIDATE, purpose: "Apply only the frozen ready change to a session candidate" }
} as const;
export const digest = (bytes: Buffer | string): string => createHash("sha256").update(bytes).digest("hex");
export function parseFixture(source: string): Fixture {
  const value = JSON.parse(source);
  requireCondition(value && typeof value === "object" && !Array.isArray(value)
    && Object.keys(value).sort().join(",") === "lesson,ready,schema"
    && value.schema === 1 && value.lesson === "evidence" && typeof value.ready === "boolean",
    "Unsupported fixture shape; collector cannot invent a repair");
  return value as Fixture;
}
/** Operation identity is selected by the controller, never supplied by worker output. */
export function runRole(operation: Role, assignment: Assignment, source: string, previous?: RoleOutput): RoleOutput {
  requireCondition(Object.hasOwn(profiles, operation) && assignment.role === operation, "Wrong role for operation");
  requireCondition(assignment.target === profiles[operation].target, "Assignment target exceeds role scope");
  requireCondition(Buffer.byteLength(source) <= 4096 && digest(source) === assignment.binding.inputDigest, "Role source does not match assignment");
  const fixture = parseFixture(source);
  if (operation === "collect") return { role: "collect", source };
  if (operation === "judge") {
    requireCondition(previous?.role === "collect" && previous.source === source, "Judge requires current collector evidence");
    return { role: "judge", before: fixture, after: { ...fixture, ready: true }, field: "ready" };
  }
  requireCondition(previous?.role === "judge" && JSON.stringify(previous.before) === JSON.stringify(fixture)
    && previous.field === "ready" && JSON.stringify(previous.after) === JSON.stringify({ ...fixture, ready: true }),
    "Mechanical writer requires the unchanged frozen decision");
  return { role: "mechanical", candidate: { ...fixture, ready: previous.after.ready } };
}
