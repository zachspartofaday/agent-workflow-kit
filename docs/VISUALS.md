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

## Optional coordination

[SVG](../assets/diagrams/coordination.svg) · [PNG](../assets/diagrams/coordination.png)

![A coordinator assigns independent work and integrates concise evidence from isolated writers and reviewers.](../assets/diagrams/coordination.png)

Workers receive bounded assignments. Reviewers inspect actual source. Integration checks the combined outcome and dependent consumers; it is not simply a collection of green worker reports.

```mermaid
flowchart TB
  Coordinator[Plan and dependency state] --> A[Writer A: assigned workspace]
  Coordinator --> B[Writer B: assigned workspace]
  Coordinator --> Reviewer[Reviewer: actual candidate source]
  A --> Integration[Combined acceptance and consumer evidence]
  B --> Integration
  Reviewer --> Integration
  Integration -->|unresolved outcome| Coordinator
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
