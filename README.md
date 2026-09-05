# Agent Workflow Kit

**Understand the workflow. Adapt your docs. Build your own Pi extension.**

A practical blueprint for turning an engineering process into an agent workflow: repository knowledge, reusable skills, verifiable work, and deterministic orchestration.

![Operator intent and repository knowledge feed an agent loop; validation and review return evidence; a runtime maintains state and stops at decisions.](assets/diagrams/workflow-overview.png)

## Choose a starting point

| You want to… | Start here |
| --- | --- |
| Understand how the pieces fit | [Workflow handbook](docs/WORKFLOW.md) |
| Have an agent adapt your repository | [Adoption guide and prompt](docs/ADOPTION.md) |
| Build your own Pi workflow extension | [Architecture and build path](docs/EXTENSION_FRAMEWORK.md) |
| Try a small working example | [Pi teaching extension](examples/pi-workflow/README.md) |
| Use one portable skill | [Skill catalog](skills/README.md) |
| Explore diagrams and research influences | [Visual guide](docs/VISUALS.md) · [Sources](docs/SOURCES.md) |

The full workflow is explained, but adoption is proportional. A small change may need an issue, a test and a review. A long-running multi-repository change may need explicit dependencies, durable evidence and a controller that remembers what is current.

## Included

Nine standalone skills, adaptable templates, fictional examples, a rule-to-mechanism framework, original technical diagrams, and a runnable TypeScript Pi extension. The extension demonstrates an operator decision, a fixed fixture check, versioned state and evidence freshness. It does not supervise production workers, enforce a filesystem sandbox, automate code review or merge changes.

## Origins and reuse

Created by Zach Skjaveland, informed by his Limitless engineering workflow. This is newly authored guidance, not an export of the private runtime or its exact skills. The modular architecture taught here is a design pattern for readers, not a claim that the private runtime is already host-independent. A substantial Pi extension can have deep lifecycle, persistence, worker and UI coupling even when some policy logic is modular.

Research influences, including NVIDIA AVO, are credited in [Sources](docs/SOURCES.md). No affiliation, endorsement or benchmark equivalence is implied.

Original code, documentation and artwork use the [MIT license](LICENSE). This first version is prepared for private review before public sharing.
