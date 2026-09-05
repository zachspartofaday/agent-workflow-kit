# Questions that affect an extension design

For each mechanism, settle these questions from source and accepted intent; ask only about choices that cannot be discovered.

- Which responsibilities need distinct roles: collection, audit, judgment, independent refutation, mechanical or documentation writing, inseparable implementation, and trajectory review? Keep coordinator routing and operator decisions separate.
- Can judgment be frozen before a writer applies it, or must reasoning and implementation stay together? What happens when a mechanical assignment encounters a new design choice?
- Which roles may request bounded read-only collectors? Do not infer permission to spawn writers or unrestricted descendants.
- What state changes action eligibility? Who may create each transition?
- What exactly does an operator decision authorize, and how does a model proposal differ?
- Which root, candidate, dirty inputs and execution attempt bind a result?
- What survives session changes, branches, compaction and restart? Which host events are required?
- How are malformed/unknown records and stale decisions rejected?
- Who owns an in-flight operation? How are cancellation, terminal state and late results handled?
- Does a task require real process/worktree isolation? Which paths could bypass a hook?
- What is shown to the model, what stays local, and what is retained after failure?
- What condition triggers intervention, and what evidence clears it?
- How is the extension disabled without losing work or leaving processes unowned?

Use a pure transition function for rules and small I/O controllers for observations where that simplifies testing. Event IDs need idempotence checks; duplicate payloads are distinct from conflicting reuse of an ID. A persisted approval is trusted local data unless a stronger attestation system is explicitly built.

A first slice can demonstrate plan -> operator decision -> one fixed check -> evidence-bound completion. Later slices may add real command execution, workspace ownership, review watching and continuation, each with its own failure tests.
