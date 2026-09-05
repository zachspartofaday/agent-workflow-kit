# Agent roles and how work moves between them

The workflow separates **finding facts, judging claims, applying a decided change, and challenging the result**. Treating all of those as a generic “worker” hides the reason for the role system.

This guide generalizes the role responsibilities and routing found in the author's Runtime source. It preserves the distinctions without distributing private role prompts, schemas, model assignments or operating limits. Readers can adapt the design; the kit's small executable demo exercises collector, judge and mechanical roles as deterministic functions; it does not launch model workers.

![Role map: operator, coordinator and runtime controls; four evidence and judgment workers; three writing workers; a trajectory supervisor and separate formal review.](../assets/diagrams/agent-roles.png)

## Operator, coordinator and runtime

| Participant | Responsibility | Boundary |
| --- | --- | --- |
| **Operator** | Sets goals, confirms scope and consequential actions, resolves material choices and selects a new strategy when needed. | An agent's proposal is not an operator decision. |
| **Coordinator** | Maintains the overall task, prepares bounded assignments, selects the appropriate workflow, integrates compact reports and presents decisions/blockers. | In this architecture, active-workflow source edits belong to assigned writers. The coordinator does not become another writer. |
| **Runtime controllers** | Enforce configured permissions, assign workspaces, schedule work, preserve identity and state, observe completion and route results. | These are code, not another model role. They enforce authorization rather than invent it. |

The coordinator is the main agent session. The eight worker roles below are distinct assignments, not eight agents that must always run together.

## Eight worker roles

The short keys identify the conceptual roles being generalized; only `collect`, `judge` and `mechanical` have executable deterministic counterparts in the teaching demo.

| Role | Question it owns | Expected output | Writes? |
| --- | --- | --- | --- |
| **Evidence collector** (`collect`) | What is actually present at this source revision and assigned surface? | Facts, source anchors, searches behind absence claims, uncertainty and coverage gaps. | No. It gathers evidence rather than choosing a design or fix. |
| **Audit lead** (`auditor`) | What consequential risks does this scoped audit reveal? | A prioritized assessment that separates observed defects, inference and unresolved evidence. | No. It may request bounded collectors for missing evidence. |
| **Decision judge** (`judge`) | What conclusion or bounded disposition does the evidence support? | A source-checked decision, including refuted claims and remaining questions. | No. It verifies load-bearing evidence rather than accepting collector conclusions blindly. |
| **Independent refuter** (`refuter`) | Can this claim be disproved by actual code, reachability or a counterexample? | A survives/refuted/unresolved verdict, evidence and remaining assumptions. | No. It must be independent of constructing or judging the claim. |
| **Mechanical writer** (`mechanical`) | How do I apply this already-decided change faithfully? | A bounded diff, conformance evidence and assigned validation. | Yes, inside the assigned scope. A stale edit shape or new design choice returns to judgment. |
| **Documentation writer** (`docs`) | How do I apply the accepted wording or documentation decision consistently? | Scoped documentation edits, corrected references and reported out-of-scope drift. | Yes, in assigned documentation. It does not decide new policy or author a new contract on its own. |
| **Implementation owner** (`implement`) | What change solves the problem when reasoning and editing cannot usefully be separated? | A coherent implementation, causal explanation, tests and unresolved risks. | Yes. Use for genuinely interdependent control-flow, lifecycle or ownership work; scope-changing choices still stop for a decision. |
| **Trajectory supervisor** (`supervisor`) | What does the history of attempts reveal about stalled or recurring failure? | Several fresh candidate directions informed by the whole trajectory. | No. It neither chooses nor ranks a preferred direction, and it does not dispatch work. The operator selects. |

An audit lead supervises evidence collection. A trajectory supervisor examines progress across attempts. The shared word “supervisor” does not give them the same job.

A formal PR reviewer or review service is a separate integration. The judge and refuter do not automatically satisfy the repository's final review policy.

## Choose a route for the task

| Situation | Appropriate route | Result |
| --- | --- | --- |
| One factual question | Collector → coordinator | A bounded answer or evidence gap. |
| Scoped audit | Audit lead ↔ collectors → coordinator | Prioritized findings; no implementation implied. |
| Design or finding disposition | Judge ↔ collectors → coordinator | A decision or an unresolved question. |
| Decided implementation | Accepted decision → mechanical writer | An implementation of the frozen edit shape. |
| Review findings needing a fix | Judge ↔ collectors → mechanical writer → validation → formal review | Decision and application remain separate; evidence follows the changed candidate. |
| Accepted wording change | Documentation writer → documentation checks | Wording applied without reopening policy. |
| Inseparable reasoning and implementation | Implementation owner → validation → formal review | A bounded unsplit change, with appropriate independent checks. |
| A claim needs adversarial examination | Independent refuter ↔ collectors where permitted | Counterevidence or an explicit remaining gap. |
| Repeated failure or stalled progress | Attempt history → trajectory supervisor → operator → coordinator | A chosen new direction within existing or newly approved scope. |

These are selected routes, not a mandatory production line. A small factual lookup does not require a judge, writer and refuter. A straightforward decided edit need not be re-designed. Conversely, calling a design task “mechanical” does not remove its decisions.

## The decision/application split

![Handoffs: evidence supports a judge, a ready decision passes to a mechanical writer, and validation and formal review assess the candidate. Independent refutation and trajectory review are separate conditional routes.](../assets/diagrams/coordination.png)

The judge inspects evidence and states what should change. The mechanical writer applies that decision without introducing another design. If the source no longer matches the decision, the writer reports the mismatch instead of improvising. Review findings return through judgment before another mechanical application.

The implementation-owner route exists because some problems cannot be frozen into a reliable edit recipe before working through the code. Choosing that route should be explicit. It is not a blanket escape from the decision/application split.

For example, a recurring parser defect may begin with collectors checking callers and test coverage. The judge identifies the violated parsing invariant and the affected cases. The mechanical writer applies the agreed correction and tests. If the issue instead depends on exploratory ownership or asynchronous lifecycle reasoning that changes as code is inspected, use the implementation owner. A relevant refuter then challenges the resulting claim independently; formal review still follows local policy.

## Delegation and independence

Where the selected workflow enables it, auditor, judge and refuter sessions may request **read-only collectors**. The runtime admits only bounded child questions inside the parent's existing surface and budget. Collectors are leaves; this is not an unrestricted tree of agents that can spawn writers.

The trajectory supervisor is a separate read-only worker, not the coordinator and not the generic collector-parent route. It receives retained attempt/validation/review history and proposes alternatives. Strategy selection remains with the operator.

Return compact reports with source identity, observations, uncertainties and next evidence needed. The parent must still check load-bearing anchors. A separate session can reduce contamination; using a different model alone does not establish independence if it receives the author's preferred conclusion as a premise.

## Configure model and reasoning effort per role

**The roles are designed to support different configurable models and reasoning effort levels.** This is an efficiency mechanism as well as a responsibility split: reserve expensive reasoning for decisions that need it, and use an efficient execution profile for bounded evidence gathering and already-decided changes. Two roles can share a model while using different effort levels, or use different models altogether.

The judge → mechanical writer handoff makes that practical. The reasoning-heavy worker resolves the decision once; the execution-focused worker applies it without paying to redesign it. Collection similarly supplies bounded evidence to the judgment worker. Savings are an objective to measure, not a guarantee: a cheaper worker that misses evidence or causes retries can increase total cost and elapsed time.

| Roles | Illustrative profile | Why |
| --- | --- | --- |
| Collector, mechanical writer, documentation writer | Efficient model; lower effort where supported and sufficient | Bounded searches, frozen edits and accepted wording reward accurate execution. |
| Auditor, judge, refuter, trajectory supervisor | Reasoning-capable model; higher effort when warranted | Risk assessment, evidence checking, counterexamples and trajectory analysis require judgment. |
| Implementation owner | Capable coding/reasoning model; effort matched to complexity | Reasoning and editing stay together for interdependent changes. |

These are starting hypotheses for evaluation, not the author's private assignments or mandatory defaults. A difficult collection task may need a stronger profile. Changing a model or effort setting does not change the role's permissions, output contract or independence requirements.

For example, an extension could resolve aliases from its own configuration:

```json
{
  "profiles": {
    "efficient": { "model": "YOUR_EFFICIENT_MODEL", "effort": "low" },
    "reasoning": { "model": "YOUR_REASONING_MODEL", "effort": "high" }
  },
  "roles": {
    "collect": "efficient",
    "mechanical": "efficient",
    "docs": "efficient",
    "auditor": "reasoning",
    "judge": "reasoning",
    "refuter": "reasoning",
    "supervisor": "reasoning",
    "implement": "reasoning"
  }
}
```

This is illustrative configuration for a runtime you build, **not a Pi configuration schema or a file consumed by the teaching demo**. Model identifiers and effort values must be resolved and validated against the selected provider/host. Reject unsupported settings or require an explicit configured fallback; do not silently pretend the requested effort was applied.

Keep model selection and effort alongside the role's tool ceiling, timeout, concurrency and allowed children in validated configuration. Record the effective model and effort with each assignment so outcomes can be compared. Support explicit role overrides without weakening permissions. Evaluate profiles using representative tasks, checking correctness, missed findings, retries, token cost and end-to-end latency before lowering or raising the budget.

A role card should state purpose, inputs, output, permitted actions, stop conditions and delegation. A worker prompt cannot expand its own tools or assignment. The runtime must separately enforce the permissions it claims; a sentence saying “read-only” is not a security boundary.

## What to add to your own extension

Start by supporting only the roles your first workflow needs. Carry role and assignment identity alongside the plan, source revision, allowed paths and output contract. Add tests that a collector cannot write, a judge cannot dispatch an unapproved writer, a mechanical writer cannot silently alter the decided shape, and a trajectory supervisor cannot select its own strategy. Implement the actual enforcement points before claiming these properties.

See [the extension framework](EXTENSION_FRAMEWORK.md) for the separation between policy and Pi integration, and [the build milestones](BUILD_MILESTONES.md) for worker execution, validation and review integration.
