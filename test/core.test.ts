import test from "node:test";
import assert from "node:assert/strict";
import { initial, replay, MAX_EVENTS, type Binding, type Event } from "../examples/pi-workflow/core.js";
import { digest, runRole, profiles, type Role, type RoleOutput, type Assignment } from "../examples/pi-workflow/roles.js";
const source = '{"schema":1,"lesson":"evidence","ready":false}';
const binding: Binding = { root: "/fixture", commit: "a".repeat(40), inputDigest: digest(source) };
const proposed: Event = { version: 2, id: "e1", kind: "proposed", plan: { id: "p1", objective: "Check a fixture", checkId: "fixture-roles-v2", binding } };
const confirmed: Event = { version: 2, id: "e2", kind: "confirmed", planId: "p1", binding, source: "operator-command" };
const checked: Event = { version: 2, id: "e3", kind: "checked", planId: "p1", binding, evidence: { attemptId: "a1", outcome: "passed", message: "Passed" } };
const completed: Event = { version: 2, id: "e4", kind: "completed", planId: "p1", binding };
const roles: Event[] = [];
let previous: RoleOutput | undefined;
let inputId = proposed.plan.id;
for (const role of ["collect", "judge", "mechanical"] as Role[]) {
  const assignment: Assignment = { id: `assignment-${role}`, role, planId: proposed.plan.id, binding, inputId, target: profiles[role].target };
  const output = runRole(role, assignment, source, previous);
  roles.push({ version: 2, id: `event-${role}`, kind: "role-completed", planId: proposed.plan.id, binding, assignment, output });
  previous = output; inputId = assignment.id;
}
test("replay reconstructs an actual complete event chain", () => {
  assert.equal(replay([proposed, confirmed, ...roles, checked, completed]).phase, "complete");
  assert.deepEqual(replay([]), initial());
});
test("duplicate delivery is idempotent but conflicting reuse refuses", () => {
  assert.equal(replay([proposed, confirmed, confirmed]).phase, "confirmed");
  assert.throws(() => replay([proposed, { ...proposed, kind: "reset" }]), /Unknown or missing/);
  assert.throws(() => replay([proposed, { version: 2, id: "e1", kind: "reset" }]), /Conflicting duplicate/);
});
test("no shortcut from proposal or confirmation to completion", () => {
  assert.throws(() => replay([proposed, checked]), /confirmation/);
  assert.throws(() => replay([proposed, confirmed, completed]), /passing/);
  assert.throws(() => replay([confirmed]), /inputs changed/);
});
test("failed results cannot close or consume the same confirmation again", () => {
  const failed = { ...checked, evidence: { attemptId: "a1", outcome: "failed", message: "Failed" } };
  assert.equal(replay([proposed, confirmed, ...roles, failed]).evidence?.outcome, "failed");
  assert.throws(() => replay([proposed, confirmed, ...roles, failed, completed]), /passing/);
  assert.throws(() => replay([proposed, confirmed, ...roles, checked, { ...checked, id: "retry" }]), /unconsumed/);
});
test("changed binding and replaced plan invalidate old approval", () => {
  for (const change of [{ root: "/other" }, { commit: "c".repeat(40) }, { inputDigest: "d".repeat(64) }]) {
    assert.throws(() => replay([proposed, { ...confirmed, binding: { ...binding, ...change } }]), /inputs changed/);
  }
  const replacement = { ...proposed, id: "new-event", plan: { ...proposed.plan, id: "new-plan" } };
  assert.throws(() => replay([proposed, confirmed, replacement, checked]), /Wrong plan/);
});
test("malformed, unsupported, extra and oversized records refuse restoration", () => {
  for (const value of [null, {}, { ...proposed, version: 1 }, { ...proposed, extra: true }, { ...proposed, plan: { ...proposed.plan, objective: "x".repeat(241) } }, { ...proposed, plan: { ...proposed.plan, checkId: "shell" } }, { ...confirmed, source: "model" }]) {
    assert.throws(() => replay([value]));
  }
  assert.throws(() => replay(Array(MAX_EVENTS + 1).fill(proposed)), /history limit/);
});
test("reset removes usable plan and evidence without erasing prior history", () => {
  const events = [proposed, confirmed, ...roles, checked, completed, { version: 2, id: "reset", kind: "reset" }];
  assert.deepEqual(replay(events), initial());
  assert.equal(events.length, 8);
});

test("role replay rejects skipped, stale, mis-scoped and forged handoffs", () => {
  const collected = roles[0] as Extract<Event, { kind: "role-completed" }>;
  const judged = roles[1] as Extract<Event, { kind: "role-completed" }>;
  const applied = roles[2] as Extract<Event, { kind: "role-completed" }>;
  assert.throws(() => replay([proposed, confirmed, judged]), /out of order/);
  assert.throws(() => replay([proposed, confirmed, collected, applied]), /out of order/);
  for (const assignment of [
    { ...collected.assignment, role: "mechanical" },
    { ...collected.assignment, target: "other.json" },
    { ...collected.assignment, inputId: "old-assignment" },
    { ...collected.assignment, planId: "old-plan" },
    { ...collected.assignment, binding: { ...binding, commit: "f".repeat(40) } }
  ]) assert.throws(() => replay([proposed, confirmed, { ...collected, assignment }]));
  assert.throws(() => replay([proposed, confirmed, { ...collected, output: { role: "collect", source: source.replace("false", "true") } }]), /source/);
  assert.throws(() => replay([proposed, confirmed, collected, { ...judged, output: { role: "judge", before: JSON.parse(source), after: { schema: 1, lesson: "other", ready: true }, field: "ready" } }]), /output violates/);
  assert.throws(() => replay([proposed, confirmed, ...roles.slice(0, 2), { ...applied, output: { role: "mechanical", candidate: { schema: 1, lesson: "evidence", ready: false } } }]), /output violates/);
});

test("assignment IDs cannot be reused and duplicate role deliveries remain idempotent", () => {
  const collected = roles[0] as Extract<Event, { kind: "role-completed" }>;
  const judged = roles[1] as Extract<Event, { kind: "role-completed" }>;
  assert.equal(replay([proposed, confirmed, collected, collected, ...roles.slice(1)]).phase, "applied");
  assert.throws(() => replay([proposed, confirmed, collected, { ...judged, assignment: { ...judged.assignment, id: collected.assignment.id } }]), /Reused assignment/);
});
