# Initial validation record

Verified on 2026-09-05. Exact repeatable commands are owned by [CONTRIBUTING.md](../CONTRIBUTING.md). This record describes teaching-kit evidence, not a production harness certification.

## Automated checks

- TypeScript compilation passed with the locked development dependencies.
- All 20 Node behavioral tests passed: transitions, malformed/unknown history, duplicate events, missing/cancelled confirmation, changed plans/inputs, failed checks, late decisions, shutdown/reset, persistence failure and fixture reading against temporary Git repositories.
- Local Markdown links, nine standalone skill packages and accessible diagram-source structure passed the repository checker.
- All nine skills passed the authoring validator's metadata/name/scaffold checks. This structural check is not evidence of independent model evaluation.
- Pi 0.85.0's actual bundled CLI passed an isolated RPC walkthrough: extension registration, missing-approval refusal, operator cancellation/approval, actual fixture result, persisted session restoration, stale evidence, failed check and reset. No model calls were made.

## Interactive and visual observations

An isolated Pi 0.85.0 TUI session displayed the synthetic greeting and extension, accepted a proposal, showed the exact confirmation dialog, recorded an accepted decision, ran the fixture check and reached fixture-only completion. Exit settled successfully. The 80-column status and dialog remained readable.

The offline host reported an unavailable optional `fd` binary and skipped downloading it. The demo does not use that tool; this did not prevent the walkthrough.

All five original SVG/PNG diagrams were inspected at full size and at an 800-pixel README width. Overview text and coordination labels were corrected before final export. Shared context arrows reach every workflow stage, and failure feedback is separate from the ready path to closeout. Mermaid versions provide editable simplified flows in [the visual guide](VISUALS.md).

## Skill behavior exercises

The authoring agent performed the two disposable adoption cases in [adoption scenarios](../test/adoption-scenarios.md):

- Existing owners: changed only the README routing and agent links; preserved the canonical command file, package configuration, storage decision and unrelated operator draft byte-for-byte. No duplicate contribution/status/program files appeared. A second inspection required no edits; file hashes remained unchanged.
- Missing commands: retained the no-network boundary, identified the command as unresolved and made no changes in the proposal-only case.

The review, dependency, recurring-failure and manual-gap cases were reviewed against the corresponding skills' decision rules. They were not executed through an independent model or a live review provider. The scenario document makes those exercises repeatable for future evaluation.

## Scope and limits

The demo's result covers one JSON fixture and its bound commit/input digest. It does not validate a product, execute arbitrary commands, supervise workers, authenticate remote approvals, enforce a sandbox, or perform review/merge/release. The broader contracts and milestones are unimplemented design guidance.

Pi session fixtures and lifecycle behavior are version-specific. The synthetic greeting initializes host persistence and is explicitly not model output. Local records rely on the trusted host and are not signed or transactionally crash-proof. Windows/Linux host execution and other Pi versions have not been manually verified; the observed environment was macOS with Node.js 26.8.1.

Original content and the staged payload were reviewed for private repository links, local paths, copied private implementation and credentials. Public publication remains a separate decision.
