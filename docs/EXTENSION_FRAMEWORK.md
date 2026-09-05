# Build a Pi workflow extension

A runtime maintains state and performs repeatable coordination. It can live inside an agent host as an extension; it does not have to replace the model loop.

## Why make a workflow executable?

A skill can tell an agent to remember the candidate commit. A controller can reject a result for the wrong commit every time. A skill recommends waiting; an event listener can wake the agent once. A summary describes approval; an operator-owned decision record binds it to the actual plan.

Automate rules with identifiable inputs, a deterministic predicate and a clear failure or next action. Keep product judgment, ambiguous findings and scope choices with the responsible human or agent. Storing a result does not prove correctness.

Costs include a maintained program, host API coupling, persisted-data versions and recovery testing. Stay with skills when tasks are short and the host already provides adequate controls. Add one mechanism when a demonstrated problem justifies it.

## Three responsibilities

![Repository knowledge and skills feed a workflow core; a Pi adapter supplies commands, tools, lifecycle, persistence and UI.](../assets/diagrams/extension-layers.png)

**Docs and skills** own requirements, local conventions and judgment. They remain useful with the extension disabled.

**Workflow core** applies rules to typed records. Separate pure transitions from I/O where useful so failure cases are cheap to test. It can reason about plans and evidence without UI widgets or model names.

**Pi integration** registers tools and operator commands, observes lifecycle events, handles session data and displays status. Use the actual supported API.

This separation is a design goal, not a claim that existing runtimes have achieved portability. A Pi extension may own substantial orchestration and depend deeply on Pi's session branches, compaction, settled events, RPC workers and TUI. Extracting it can require redesigning lifecycle and recovery, not swapping an adapter. Keep that cost visible as your own extension grows.

## Written rule to tested mechanism

| Rule | Mechanism | Negative test | Judgment left |
| --- | --- | --- | --- |
| Stay within scope | Bind actions to plan/repository | Changed plan refuses | Whether a request expands scope |
| Confirm consequential work | Operator-owned exact decision | Proposal cannot confirm itself | Whether work is desirable |
| Validate current inputs | Bind execution to commit, digest, attempt | Stale result cannot complete | Which checks are sufficient |
| Serialize review | One active request per target | Overlap/late result rejected | Whether a finding is correct |
| Retain useful state | Versioned events and concise projection | Invalid restoration refuses | Which lessons generalize |
| Detect repeated failure | Attempt history and checkpoint | Recurrence causes intervention | Which strategy to try |
| Preserve uncertain work | Registered ownership and terminal evidence | Ambiguous cleanup refuses | Whether to abandon work |

A tool-call hook is not a general security boundary. Extensions run with host permissions; arbitrary shell tools can write through many routes. Production enforcement requires controlling relevant execution paths and using process/OS isolation where necessary. Filtering command strings is not a sandbox.

## Give an agent this prompt

```text
Use design-workflow-extension with my adopted repository docs.
Identify repeated problems that merit deterministic mechanisms and what remains judgment.
Design a Pi extension with a testable core and explicit host responsibilities. Map selected
rules to records, event owners, enforcement points, failures and tests. Preserve existing
authorization and do not compete with an active controller. Propose one vertical slice with
acceptance, data boundaries, rollback and an isolated Pi walkthrough. Treat the teaching
example as a pattern, not a production security or orchestration library.
```

Read [contracts](CONTRACTS.md), run [the example](../examples/pi-workflow/README.md), then use [build milestones](BUILD_MILESTONES.md). The demo covers one fixture plan/check/close loop. Worker orchestration and review integration are later stages.

## Pi versus standalone

Pi offers sessions, tools, UI and lifecycle integration. A standalone application offers hosting control but must supply or integrate those responsibilities. A reusable core with host adapters is an intermediate option only if its boundaries are actually implemented and tested.

Hosting and language are independent choices. A standalone runtime can use JavaScript/TypeScript. Python can be appropriate for an existing ecosystem or deployment requirement, but is not an automatic architectural upgrade.

Decide from required hosts, API constraints, deployment, team knowledge, supervision and recovery. Measure suspected bottlenecks. Keeping a working Pi extension is a valid decision.

## Versioning and rollout

Record the Pi version actually tested. Reject unknown persisted versions rather than reinterpret prior decisions. Session records are trusted local data, not signed proof against a compromised host.

Start with observations and enforce one tested transition. Exercise restart and failure in disposable repositories. Preserve a manual fallback and disable path. Global installation, distribution and migration are separate deployment decisions.
