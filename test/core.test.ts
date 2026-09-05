import test from "node:test";
import assert from "node:assert/strict";
import { initial, replay, MAX_EVENTS, type Binding, type Event } from "../examples/pi-workflow/core.js";
const binding: Binding = { root: "/fixture", commit: "a".repeat(40), inputDigest: "b".repeat(64) };
const proposed: Event = { version: 1, id: "e1", kind: "proposed", plan: { id: "p1", objective: "Check a fixture", checkId: "fixture-v1", binding } };
const confirmed: Event = { version: 1, id: "e2", kind: "confirmed", planId: "p1", binding, source: "operator-command" };
const checked: Event = { version: 1, id: "e3", kind: "checked", planId: "p1", binding, evidence: { attemptId: "a1", outcome: "passed", message: "Passed" } };
const completed: Event = { version: 1, id: "e4", kind: "completed", planId: "p1", binding };
test("replay reconstructs an actual complete event chain", () => {
  assert.equal(replay([proposed, confirmed, checked, completed]).phase, "complete");
  assert.deepEqual(replay([]), initial());
});
test("duplicate delivery is idempotent but conflicting reuse refuses", () => {
  assert.equal(replay([proposed, confirmed, confirmed]).phase, "confirmed");
  assert.throws(() => replay([proposed, { ...proposed, kind: "reset" }]), /Unknown or missing/);
  assert.throws(() => replay([proposed, { version: 1, id: "e1", kind: "reset" }]), /Conflicting duplicate/);
});
test("no shortcut from proposal or confirmation to completion", () => {
  assert.throws(() => replay([proposed, checked]), /confirmation/);
  assert.throws(() => replay([proposed, confirmed, completed]), /passing/);
  assert.throws(() => replay([confirmed]), /inputs changed/);
});
test("failed results cannot close or consume the same confirmation again", () => {
  const failed = { ...checked, evidence: { attemptId: "a1", outcome: "failed", message: "Failed" } };
  assert.equal(replay([proposed, confirmed, failed]).evidence?.outcome, "failed");
  assert.throws(() => replay([proposed, confirmed, failed, completed]), /passing/);
  assert.throws(() => replay([proposed, confirmed, checked, { ...checked, id: "retry" }]), /unconsumed/);
});
test("changed binding and replaced plan invalidate old approval", () => {
  for (const change of [{ root: "/other" }, { commit: "c".repeat(40) }, { inputDigest: "d".repeat(64) }]) {
    assert.throws(() => replay([proposed, { ...confirmed, binding: { ...binding, ...change } }]), /inputs changed/);
  }
  const replacement = { ...proposed, id: "new-event", plan: { ...proposed.plan, id: "new-plan" } };
  assert.throws(() => replay([proposed, confirmed, replacement, checked]), /Wrong plan/);
});
test("malformed, unsupported, extra and oversized records refuse restoration", () => {
  for (const value of [null, {}, { ...proposed, version: 2 }, { ...proposed, extra: true }, { ...proposed, plan: { ...proposed.plan, objective: "x".repeat(241) } }, { ...proposed, plan: { ...proposed.plan, checkId: "shell" } }, { ...confirmed, source: "model" }]) {
    assert.throws(() => replay([value]));
  }
  assert.throws(() => replay(Array(MAX_EVENTS + 1).fill(proposed)), /history limit/);
});
test("reset removes usable plan and evidence without erasing prior history", () => {
  const events = [proposed, confirmed, checked, completed, { version: 1, id: "reset", kind: "reset" }];
  assert.deepEqual(replay(events), initial());
  assert.equal(events.length, 5);
});
