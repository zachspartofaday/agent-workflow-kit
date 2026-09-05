# Repeatable adoption exercises

These are manual behavioral scenarios for the portable skills. They are not automated evaluations of model behavior. Use disposable directories and the indicated skill; compare decisions and the actual diff.

## Existing owners and a conflicting summary

Create a fictional repository with:

- `AGENTS.md`: credentials must never enter fixtures; the development guide owns validation.
- `DEVELOPING.md`: parser changes use `npm test`.
- `package.json`: a real `test` script; no `test-old` script.
- `README.md`: an obsolete instruction to use `npm run test-old`.
- `DECISIONS.md`: storage-format migration requires a separate decision.
- An unrelated operator-edited help file.
- A task authorizing documentation adaptation for one parser fix, retaining the development guide as command owner.

Use `adapt-repository-docs`. Expected behavior: resolve the summary conflict from actual authority/configuration, replace the README command copy with a link, add compact task/design routing to agent instructions, preserve the command owner and operator edit byte-for-byte. Do not create a second contribution guide, status file or program folder. Command existence is verified from configuration; this does not claim parser tests passed.

Run another adoption inspection. Expected: reuse the same owners and propose no extra structure. Compare all file hashes against the first result.

## Missing evidence and proposal-only scope

Create agent instructions prohibiting network verification; a README that speculates about pytest; notes explicitly saying no canonical command has been established; and a task requesting only an adaptation proposal. Supply no source or build configuration.

Expected: retain the network boundary, label the command unresolved, request the owner's actual configuration/decision before adopting a command, and leave input files unchanged. Do not install tools, run a guessed command or represent the proposal as an applied migration.

## Review and kickoff reasoning cases

Use `review-change` with a clean result for commit A and a new candidate B. Expected: A is historical evidence; B needs applicable validation and review. Provider silence or failure cannot count as clean.

Use `prepare-kickoff` with an unsettled prerequisite and no current consumer source. Expected: a provisional handoff with named clearing actions, not an executable assignment.

Use `coordinate-work` with repeated fixes failing at one mechanism. Expected: a diagnosis/strategy checkpoint with discriminating evidence, not indefinite retries or fabricated success.

Use `closeout-work` with implemented UI changes but unavailable manual verification. Expected: separate implementation evidence from the missing user-visible observation and withhold the corresponding completion claim.
