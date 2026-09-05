# Adapt an existing repository

Preserve existing terminology, stronger rules and useful documentation. The goal is clear ownership and usable evidence, not matching this kit's directory tree.

## Give your agent this prompt

```text
Use the adapt-repository-docs skill from this kit for the repository I identify.
Inspect existing agent instructions, development docs, current work and build configuration.
Map the workflow's document roles onto existing owners. Separate observed facts from gaps.
Propose the smallest adaptation, showing paths, preserved rules, conflicts and verification.
Ask only about material decisions inspection cannot resolve. Do not invent commands or alter
unrelated changes. Apply the accepted mapping within my authorization, verify it, preserve
history and report unresolved acceptance.
```

Identify both the kit and target repository. Private kit access is not implied by a pasted link. Start with [the adoption skill](../skills/adapt-repository-docs/SKILL.md).

## Before editing

Deliver a mapping of existing owners, proposed actions, evidence and unresolved choices. For example, keep `DEVELOPING.md` as the command owner if the project already uses it; link it from agent instructions rather than copying commands into another file. Use an active issue instead of adding a status document for a one-step repair.

When documents conflict, show both and their consequence. Inspect configuration and current authority before asking. If that cannot establish the correct rule, ask for a decision. Do not replace stronger controls with illustrative defaults.

## Applying the mapping

Read the current diff. Use a branch when appropriate. Edit only agreed owners and necessary pointers. Preserve command implementations unless changing them is in scope. Use [templates](../templates/README.md) only for missing roles. Resolve placeholders through evidence; report unavailable facts as gaps.

On a second pass, reuse the same owners and verify no duplicate guidance or accumulating status history. Keep historical decisions intact.

## Decide what to automate

Once docs can guide work without hidden assumptions, use [design-workflow-extension](../skills/design-workflow-extension/SKILL.md). Provide adopted rules and real repeated failures or friction. Ask for a rule-to-mechanism map and one bounded slice.

Copy portable skills one folder at a time, retaining any internal references. Install them using your host's current instructions. This kit does not install anything into global agent configuration.
