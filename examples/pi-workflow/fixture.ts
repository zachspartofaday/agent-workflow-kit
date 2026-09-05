import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { closeSync, constants, fstatSync, openSync, readFileSync, realpathSync } from "node:fs";
import { join, relative, isAbsolute } from "node:path";
import { requireCondition, type Binding } from "./core.js";
import { SOURCE } from "./roles.js";
export const FIXTURE = SOURCE;
export function inspect(cwd: string): { binding: Binding; bytes: Buffer } {
  const git = (...args: string[]) => execFileSync("git", args, { cwd, encoding: "utf8", timeout: 3000, maxBuffer: 16384, stdio: ["ignore", "pipe", "pipe"] }).trim();
  const root = realpathSync(git("rev-parse", "--show-toplevel"));
  const commit = git("rev-parse", "HEAD");
  const path = join(root, FIXTURE);
  const resolved = realpathSync(path);
  const rel = relative(root, resolved);
  requireCondition(!isAbsolute(rel) && rel !== ".." && !rel.startsWith("../") && !rel.startsWith("..\\"), "Fixture escapes repository");
  requireCondition(resolved === path, "Fixture path must not contain symlinks");
  const fd = openSync(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  let bytes: Buffer;
  try {
    const stat = fstatSync(fd);
    requireCondition(stat.isFile() && stat.size <= 4096, "Fixture must be a regular file of at most 4096 bytes");
    bytes = readFileSync(fd);
    requireCondition(bytes.length <= 4096, "Fixture exceeded size limit");
  } finally { closeSync(fd); }
  return { binding: { root, commit, inputDigest: createHash("sha256").update(bytes).digest("hex") }, bytes };
}
export function checkFixture(bytes: Buffer): { outcome: "passed" | "failed"; message: string } {
  try {
    const value = JSON.parse(bytes.toString("utf8"));
    const passed = value && typeof value === "object" && !Array.isArray(value)
      && Object.keys(value).sort().join(",") === "lesson,ready,schema"
      && value.schema === 1 && value.lesson === "evidence" && value.ready === true;
    return { outcome: passed ? "passed" : "failed", message: passed ? "The demo fixture is ready." : "The fixture must have schema=1, lesson=evidence and ready=true, with no extra fields." };
  } catch { return { outcome: "failed", message: "The fixture is not valid JSON." }; }
}
