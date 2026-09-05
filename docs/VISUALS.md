# Visual guide

These original diagrams explain the proposed workflow and extension design. SVG files are editable sources; PNGs are generated exports. Each diagram also has a simplified Mermaid version below. No external artwork is embedded.

## Workflow and feedback

[SVG](../assets/diagrams/workflow-overview.svg) · [PNG](../assets/diagrams/workflow-overview.png)

![The engineering loop with repository knowledge, skills, feedback and closeout.](../assets/diagrams/workflow-overview.png)

Intent and repository knowledge guide the work. Validation and review feed diagnosis. Completion is evidence-based, and consequential outward actions retain their own authority.

```mermaid
flowchart LR
  Intent[Operator intent] --> Context[Shared context for the whole loop]
  Docs[Repository knowledge] --> Context
  Skills[Portable skills] --> Context
  Context --> Inspect
  Context --> Plan
  Context --> Implement
  Context --> Validate
  Context --> Review
  Inspect --> Plan --> Decision{Required decisions settled?}
  Decision -->|yes| Implement --> Validate --> Review
  Decision -->|no| Blocker[Named decision or blocker]
  Validate -->|failure| Diagnose
  Review -->|findings| Diagnose --> Implement
  Review -->|current evidence| Closeout
  Runtime[Runtime: state, waiting, evidence] -. supports .-> Validate
```

## Extension responsibilities

[SVG](../assets/diagrams/extension-layers.svg) · [PNG](../assets/diagrams/extension-layers.png)

![Knowledge, workflow mechanisms and Pi integration, with separate creators for proposals, decisions and evidence.](../assets/diagrams/extension-layers.png)

The layers are responsibilities to design and test. Existing Pi runtimes can have substantial host coupling. A modular source tree alone does not prove that replacing the adapter is possible.

```mermaid
flowchart LR
  Docs[Docs and skills: requirements and judgment] --> Core[Workflow core: state and rules]
  Core <--> Pi[Pi integration: events, UI, tools, sessions]
  Model[Model tool] --> Proposal[Proposal]
  Operator[Operator command] --> Decision[Decision]
  Check[Check controller] --> Evidence[Observed evidence]
  Proposal --> Core
  Decision --> Core
  Evidence --> Core
```

## Documentation adaptation

[SVG](../assets/diagrams/documentation-adaptation.svg) · [PNG](../assets/diagrams/documentation-adaptation.png)

![Inspect existing docs, map ownership, decide the adaptation and verify local guidance.](../assets/diagrams/documentation-adaptation.png)

Map roles onto current owners. Preserve stronger requirements and history. A repeated adoption should reconcile those same owners rather than generate a second system.

```mermaid
flowchart LR
  Existing[Existing docs, source and diff] --> Mapping[Owner and gap mapping]
  Mapping --> Decision[Accepted adaptation]
  Decision --> Edit[Focused local edits]
  Edit --> Verify[Check facts, links and preserved rules]
  Verify -->|repeat adoption| Mapping
```

## Role map

[SVG](../assets/diagrams/agent-roles.svg) · [PNG](../assets/diagrams/agent-roles.png) · [Role guide](AGENT_ROLES.md)

![Operator, coordinator and runtime controls; eight specialist worker roles and separate formal review.](../assets/diagrams/agent-roles.png)

This is a responsibility map, not an instruction to run every role. The operator decides, the coordinator routes, and runtime code enforces the selected workflow. The eight worker roles have different inputs, permissions and outputs.

```mermaid
flowchart TB
  Operator[Operator: goals and decisions] --> Coordinator[Coordinator: bounded assignments]
  Coordinator --> Evidence[Evidence and judgment]
  Evidence --- Collector[Collector]
  Evidence --- Auditor[Audit lead]
  Evidence --- Judge[Decision judge]
  Evidence --- Refuter[Independent refuter]
  Coordinator --> Writing[Assigned writing]
  Writing --- Mechanical[Mechanical writer]
  Writing --- Docs[Documentation writer]
  Writing --- Implement[Implementation owner]
  Coordinator --> Supervisor[Trajectory supervisor: alternatives]
  Supervisor -->|directions, not a selection| Operator
  Runtime[Runtime code: permissions, state, execution] -. enforces selected routes .-> Coordinator
```

## Role handoffs

[SVG](../assets/diagrams/coordination.svg) · [PNG](../assets/diagrams/coordination.png)

![Evidence, judgment and decided application followed by validation and formal review; separate conditional refutation and trajectory routes.](../assets/diagrams/coordination.png)

The main row shows a selected decision/application route. Its arrows carry reports, decisions, candidates and results; actual dispatch remains runtime-mediated under coordinator/operator authority. The other rows show conditional alternatives, not automatic extra stages.

```mermaid
flowchart LR
  Collect[Collectors] -->|evidence| Judge[Judge]
  Judge -->|ready decision within authority| Mechanical[Mechanical writer]
  Mechanical -->|candidate| Validate[Validation]
  Validate -->|passing candidate| Review[Formal review]
  Review -->|findings| Judge
  Validate -->|failure requiring diagnosis| Judge
  Claim[Claim and source] --> Refuter[Independent refuter]
  Refuter -->|targeted question when permitted| Child[Read-only collector]
  Child -->|evidence| Refuter
  Refuter --> Verdict[Survives, refuted or unresolved]
  History[Attempt history] --> Supervisor[Trajectory supervisor]
  Supervisor -->|candidate directions| Operator[Operator selects]
  Operator --> Coordinator[Coordinator routes the selected next step]
```

## Rule to mechanism

[SVG](../assets/diagrams/rule-to-mechanism.svg) · [PNG](../assets/diagrams/rule-to-mechanism.png)

![A written rule becomes an explicit binding and a negative test that stale evidence cannot complete the workflow.](../assets/diagrams/rule-to-mechanism.png)

Choose one deterministic rule, implement its enforcement point, then test a violating case. Keep unimplemented production mechanisms clearly separate from the teaching example.

```mermaid
flowchart LR
  Rule[Check current inputs] --> Binding[Plan, commit, input digest and attempt]
  Binding --> Execution[Observe actual check]
  Execution --> Test[Change the inputs]
  Test --> Refusal[Old evidence cannot complete]
  Refusal --> Next[New plan and decision]
```

## Runtime component connections

The [component blueprint](RUNTIME_COMPONENTS.md#how-the-components-connect) includes an editable Mermaid diagram connecting goal, plan, admission, workers, validation/review, progress, persistence and continuation. Its inventory identifies what the executable demo covers and what remains to build.
