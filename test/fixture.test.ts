import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkFixture, inspect, FIXTURE } from "../examples/pi-workflow/fixture.js";
function repository() {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "workflow-kit-test-")));
  const git = (...args: string[]) => execFileSync("git", args, { cwd: root, stdio: "ignore" });
  git("init", "-q"); git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--allow-empty", "-qm", "Fixture base");
  mkdirSync(join(root, "examples/pi-workflow"), { recursive: true });
  writeFileSync(join(root, FIXTURE), '{"schema":1,"lesson":"evidence","ready":true}');
  return { root, git, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}
test("real Git inspection binds root, HEAD and dirty fixture bytes", () => {
  const r = repository();
  try {
    const a = inspect(r.root); assert.equal(a.binding.root, r.root); assert.equal(checkFixture(a.bytes).outcome, "passed");
    writeFileSync(join(r.root, FIXTURE), '{}'); const b = inspect(r.root);
    assert.equal(a.binding.commit, b.binding.commit); assert.notEqual(a.binding.inputDigest, b.binding.inputDigest);
    assert.equal(checkFixture(b.bytes).outcome, "failed");
    r.git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--allow-empty", "-qm", "New base");
    assert.notEqual(inspect(r.root).binding.commit, b.binding.commit);
  } finally { r.cleanup(); }
});
test("missing, oversized, symlinked and non-Git fixtures refuse", () => {
  const r = repository();
  try {
    writeFileSync(join(r.root, FIXTURE), 'x'.repeat(4097)); assert.throws(() => inspect(r.root), /4096/);
    rmSync(join(r.root, FIXTURE)); assert.throws(() => inspect(r.root));
    writeFileSync(join(r.root, "other.json"), '{}'); symlinkSync(join(r.root, "other.json"), join(r.root, FIXTURE));
    assert.throws(() => inspect(r.root), /symlinks/);
    rmSync(join(r.root, ".git"), { recursive: true }); assert.throws(() => inspect(r.root));
  } finally { r.cleanup(); }
});
test("malformed JSON, wrong schema and non-boolean readiness fail", () => {
  for (const data of ['{', 'null', '[]', '{"schema":2,"lesson":"evidence","ready":true}', '{"schema":1,"lesson":"evidence","ready":"true"}', '{"schema":1,"lesson":"evidence","ready":true,"extra":1}']) {
    assert.equal(checkFixture(Buffer.from(data)).outcome, "failed");
  }
});
