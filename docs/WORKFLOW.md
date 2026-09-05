# A workflow that can become a runtime

The purpose is to keep long-running engineering connected to its goal, source state and evidence. A useful harness helps an agent know what to do next and prevents an old result, unverified claim or suggested action from becoming current authority.

## The working loop

1. **Inspect.** Read the task and repository rules. Establish a baseline from source, tests and current records. Separate observations from assumptions.
2. **Plan.** Define outcomes, exclusions, owners, dependencies and verification. Resolve decisions that change scope or acceptance. A small task can have a small plan.
3. **Confirm scope.** Honor existing user authorization. Where a consequential operation or expansion needs a decision, show its concrete effect and rollback. A proposal does not approve itself.
4. **Implement.** Work in an assigned branch or isolated workspace. Keep the change coherent and avoid unrelated cleanup.
5. **Validate.** Run the repository's actual checks on the candidate being assessed. Observe user-facing behavior when tests cannot establish it.
6. **Review.** Assess that candidate, resolve findings with evidence and repeat affected validation after fixes.
7. **Close out.** State what landed or stopped, what was verified, what remains and the state of branches/artifacts. Merge, release and cleanup follow their own authorization.

Inspection continues throughout the loop. A failure can return work to diagnosis or a decision without silently widening the task.

## Give each fact one home

| Information | Suggested owner | Keep out |
| --- | --- | --- |
| Durable repository rules and routing | Agent instructions | Long histories and tool manuals |
| Exact build/test commands | Existing development guide | Competing command copies |
| Current work, blockers and next action | Short status or active tracker | Completed chronology |
| Design rationale | Focused specification or decision | Repeated volatile status |
| Candidate evidence and findings | Issue/PR or bounded run record | Claims detached from a revision |
| Historical outcomes | Dated records or merged PRs | Rewritten history |

These are roles, not required filenames. Adapt to existing documentation before adding a parallel system. A template describes what to discover; it does not establish a project fact.

## Scale to the consequence

A wording fix usually needs focused hygiene and review. A multi-step feature may need a compact plan. A shared API, persisted-data or cross-repository change needs consumers, compatibility checks, rollback and dependency order.

Add specialized assurance when its evidence could change a decision. Do not require a panel or proof document because a template exists. A small diff can still have a large consequence: removing an authorization check is not low risk because it changes one line.

## Evidence has an identity

For a clean candidate, record the repository and commit. For dirty work, record the base plus a digest of relevant changes and label it provisional. Environment and attempt identity matter when results depend on a running application or generated artifact.

Use **observed**, **inferred**, **unresolved** and **refuted** precisely. A model reporting success is not an execution result. A passing test is not a completed review. A review of yesterday's commit does not cover today's fix. Old evidence can remain useful history while being unusable for the next transition.

Canonical commands have a single owner. Focused checks run on applicable candidates; broad integration checks run at their declared checkpoint. Do not repeat an unchanged broad suite merely because a reviewer is taking time. After a change, refresh the affected evidence and any required final-candidate checks.

## Review and recovery

Use one formal review operation at a time for a candidate. Associate findings with an invariant or root cause, not only a line. Each finding is fixed, refuted with evidence or deliberately deferred when local policy permits it. A failed or ambiguous review remains unresolved.

Finish fixes and validation before requesting another review. Settle prerequisites and update a stacked change's base before final review. A clean review never grants merge or release permission by itself.

Repeated failure is information. If fixes keep failing at the same mechanism, pause patching and gather discriminating evidence: instrumentation, a minimal reproduction, consumer checks or a consequence audit. Record what was tried and ruled out. Two same-family failures can be a useful initial strategy-checkpoint policy; the repository owner chooses its threshold and consequences.

A blocker report names what failed, what remains usable, the event or action that clears it, and which claim is withheld. It must not turn uncertainty into success or retry indefinitely.

## Several workers or repositories

Use the [role guide](AGENT_ROLES.md) to distinguish evidence collection, audit, judgment, independent refutation, decided writing, inseparable implementation and trajectory review. These are selected responsibilities, not interchangeable workers.

Delegate concrete independent work when useful and allowed. Freeze inputs, source revision, paths, exclusions and expected output. Workers cannot expand authority by rewriting their assignment.

Use one writer per workspace. Coordinators integrate concise evidence and resolve dependencies; they do not need every transcript. Reviewers inspect load-bearing source rather than accepting another worker's conclusions as proof.

A multi-repository plan names each implementation owner, parent outcome, compatibility boundary and integration checkpoint. A parent tracker cannot substitute for checks in the owning repository. Keep dependent work provisional until prerequisites settle.

## Context and continuation

Keep the plan, candidate, results, decisions, findings and attempt history outside a conversational summary. Project current essentials into a new turn. Retain raw logs by reference rather than copying them into every prompt.

A continuation brief contains the goal, authorized next action, current candidate, usable evidence, failed approaches, blockers and remaining acceptance. Compaction cannot create confirmation or fresh evidence.

A runtime can wait for process or review events and send one concise update. Automatic continuation should stop for a decision, missing authority, exhausted recovery or an actual blocker. A quiet wait is not a failure and does not need model-driven polling.

## Skills and extension ownership

Skills guide judgment about scope, documents and evidence quality. An extension can own dispatch, waiting, persistence and transitions. When it owns a mechanism, the skill uses its interface instead of creating another controller. Disabling the extension should leave understandable docs and a manual path.
