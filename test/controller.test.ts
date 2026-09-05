import test from "node:test";
import assert from "node:assert/strict";
import { Controller, type Ports } from "../examples/pi-workflow/controller.js";
import type { Binding, Event } from "../examples/pi-workflow/core.js";
function harness() {
  let sequence = 0;
  let current: Binding = { root: "/fixture", commit: "a".repeat(40), inputDigest: "b".repeat(64) };
  let bytes = Buffer.from('{"schema":1,"lesson":"evidence","ready":true}');
  const records: Event[] = [];
  const ports: Ports = { id: () => `id-${++sequence}`, append: event => records.push(event), inspect: () => ({ binding: { ...current }, bytes }) };
  const controller = new Controller(ports);
  return { controller, records, ports, setBinding: (b: Partial<Binding>) => { current = { ...current, ...b }; }, failFixture: () => { bytes = Buffer.from('{}'); } };
}
test("a real fixture check completes and rehydrates", async () => {
  const h = harness(); h.controller.propose("Check fixture", "/fixture");
  await h.controller.confirm("/fixture", async text => { assert.match(text, /No edits/); return true; });
  h.controller.check("/fixture"); h.controller.close("/fixture");
  const restored = new Controller(h.ports); restored.restore(h.records);
  assert.equal(restored.getState().phase, "complete");
});
test("cancelled operator decision leaves no confirmation event", async () => {
  const h = harness(); h.controller.propose("Check", "/fixture");
  await assert.rejects(h.controller.confirm("/fixture", async () => false), /cancelled/);
  assert.equal(h.records.length, 1);
  assert.throws(() => h.controller.check("/fixture"), /confirmation/);
});
test("session change while UI is pending discards late approval", async () => {
  const h = harness(); h.controller.propose("Check", "/fixture");
  let finish!: (value: boolean) => void;
  const pending = h.controller.confirm("/fixture", () => new Promise(resolve => { finish = resolve; }));
  h.controller.restore([]); finish(true);
  await assert.rejects(pending, /Session changed/);
  assert.equal(h.controller.getState().phase, "inactive");
  assert.equal(h.records.length, 1);
});
test("reset and shutdown invalidate pending confirmation", async () => {
  for (const action of ["reset", "stop"] as const) {
    const h = harness(); h.controller.propose("Check", "/fixture");
    let finish!: (value: boolean) => void;
    const pending = h.controller.confirm("/fixture", () => new Promise(resolve => { finish = resolve; }));
    h.controller[action](); finish(true);
    await assert.rejects(pending, /Session changed/);
    assert.equal(h.records.filter(e => e.kind === "confirmed").length, 0);
  }
});
test("concurrent confirmation and plan replacement refuse while UI is pending", async () => {
  const h = harness(); h.controller.propose("Check", "/fixture");
  let finish!: (value: boolean) => void;
  const pending = h.controller.confirm("/fixture", () => new Promise(resolve => { finish = resolve; }));
  await assert.rejects(h.controller.confirm("/fixture", async () => true), /pending/);
  assert.throws(() => h.controller.propose("Other", "/fixture"), /pending/);
  finish(true); await pending;
});
test("input changes during confirmation/check or before close refuse", async () => {
  const h = harness(); h.controller.propose("Check", "/fixture");
  await assert.rejects(h.controller.confirm("/fixture", async () => { h.setBinding({ inputDigest: "c".repeat(64) }); return true; }), /inputs changed/);
  h.controller.propose("Retry", "/fixture");
  await h.controller.confirm("/fixture", async () => true);
  const original = h.ports.inspect; let reads = 0;
  h.ports.inspect = cwd => { if (++reads === 2) h.setBinding({ commit: "d".repeat(40) }); return original(cwd); };
  assert.throws(() => h.controller.check("/fixture"), /Inputs changed during/);
  assert.equal(h.records.filter(e => e.kind === "checked").length, 0);
  h.ports.inspect = original;
  h.controller.propose("Retry current", "/fixture"); await h.controller.confirm("/fixture", async () => true);
  h.controller.check("/fixture"); h.setBinding({ inputDigest: "e".repeat(64) });
  assert.throws(() => h.controller.close("/fixture"), /inputs changed/);
  assert.match(h.controller.status("/fixture"), /stale/);
});
test("failed fixture produces failed evidence and cannot complete", async () => {
  const h = harness(); h.failFixture(); h.controller.propose("Check", "/fixture");
  await h.controller.confirm("/fixture", async () => true); h.controller.check("/fixture");
  assert.equal(h.controller.getState().evidence?.outcome, "failed");
  assert.throws(() => h.controller.close("/fixture"), /passing/);
});
test("persistence failure does not publish success", () => {
  const h = harness(); h.ports.append = () => { throw new Error("disk unavailable"); };
  assert.throws(() => h.controller.propose("Check", "/fixture"), /persistence failed/);
  assert.equal(h.controller.getState().phase, "inactive");
  h.controller.restore([]);
  assert.throws(() => h.controller.propose("Retry", "/fixture"), /persistence failed/);
});
test("invalid history remains blocked, including reset; inactive startup does no repository I/O", () => {
  const h = harness(); h.ports.inspect = () => { throw new Error("Should not inspect"); };
  assert.match(h.controller.status("/fixture"), /inactive/);
  h.controller.restore([{ version: 9 }]);
  assert.match(h.controller.status("/fixture"), /Invalid demo history/);
  assert.throws(() => h.controller.reset(), /Invalid demo history/);
  assert.throws(() => h.controller.propose("Check", "/fixture"), /Invalid demo history/);
});
