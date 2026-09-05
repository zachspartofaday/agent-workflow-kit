---
name: design-workflow-extension
description: "Design a Pi workflow extension from adopted repository rules and demonstrated coordination problems. Use for runtime architecture or a bounded extension slice; do not assume skills require automation."
---

# Design a workflow extension

Inspect adopted repository guidance, the requested outcomes, existing Pi extensions and repeated failure/friction evidence. Identify which mechanisms already have an owner. Do not create a second controller for dispatch, review, waiting or continuation.

Separate judgment from deterministic checks. For each selected rule name inputs, event owner, predicate, enforcement surface, refusal/clearing action, persisted state and tests. Prefer one vertical slice over a generic workflow engine. Read [design prompts](references/design-prompts.md) for the required lifecycle questions.

Use a testable core where useful and explicit Pi integration for commands, model tools, events, session state and UI. This is a proposed boundary, not assumed portability: document any reliance on Pi session branches, compaction, RPC or TUI behavior. Consult the installed version's actual API and official upstream docs.

Bind actions to the accepted plan and observed source. Keep operator decisions distinct from model proposals. Validate untrusted/restored data at runtime; types alone are insufficient. State where enforcement ends. A hook or command filter does not create an OS sandbox.

Propose acceptance and failure tests, isolated runtime verification, compatibility, data retention, disable/rollback and later stages. Preserve docs as a usable manual fallback. Choose language and host based on requirements; a standalone runtime does not inherently require Python.

Return a decision-complete design for the authorized slice. If implementation is requested, implement and verify that slice within existing authorization; do not turn it into an unrequested production framework, package release or global installation.
