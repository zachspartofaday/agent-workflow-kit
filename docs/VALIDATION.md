# Validation record

Verified on 2026-09-05. The initial and documentation-only observations below precede the executable role update recorded at the end. Exact repeatable commands are owned by [CONTRIBUTING.md](../CONTRIBUTING.md). This record describes teaching-kit evidence, not a production harness certification.

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

## Role documentation update — 2026-09-05

The role guide was checked against the author's Runtime role definitions and dispatch paths. It generalizes eight worker responsibilities, bounded collector delegation, the judgment/application split and operator selection after trajectory review, without distributing private prompts or configuration.

The new role map and revised handoff diagram were rendered and inspected at full size and 800-pixel README width. The repository now contains six diagram sources. TypeScript compilation, all 20 existing behavioral tests, and documentation/link/skill checks passed after this update. No adapter behavior changed; the earlier Pi integration observations remain the applicable record. The teaching demo still does not dispatch or enforce these worker roles.


## Executable role update — 2026-09-05

The example now runs deterministic collector, judge and mechanical functions with role/target admission, bound predecessor identities, source freshness and exact-output validation. The writer changes a session-stored candidate from `ready=false` to `ready=true`; the source fixture remains unchanged. These are trusted-process application checks, not model-worker isolation or an implementation of all eight roles.

TypeScript compilation, all 24 behavioral tests and documentation checks passed. Negative cases include skipped roles, wrong targets, stale predecessors and source, forged evidence/decisions/candidates, reused assignment IDs, duplicate delivery, malformed source, reset and persistence failure. Existing approval, failed-result and stale-completion coverage remains. Version-1 payloads are deliberately refused; old approvals are not migrated.

The actual Pi 0.85.0 RPC walkthrough passed cancellation/approval, early-writer refusal, report inspection, restart after collection, judgment/application, candidate validation, completion restoration, stale-source refusal and unsupported-shape refusal. It verified the source fixture remained unchanged. No model calls were made.

An isolated interactive Pi 0.85.0 TUI walkthrough displayed the expanded confirmation at 80 columns, refused an early writer, advanced through all three roles, showed the mechanical assignment and `ready=true` candidate through `report`, passed validation and completed. The report wrapped long identities; phase/next-action status remained readable. Exit settled successfully. The previously noted optional `fd` warning persisted and did not affect the demo. No diagrams changed in this update.
