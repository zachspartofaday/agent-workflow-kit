---
name: maintain-docs
description: "Audit and repair documentation ownership, current-state drift and broken references within the requested scope. Use for documentation maintenance rather than general source-code review."
---

# Maintain documentation health

Identify the requested repository and whether the task authorizes repair or only findings. Inspect existing owners, current source, active work, historical records and the working-tree diff.

Check whether mutable facts have one owner, commands have a real canonical home, indexes point to current areas, and status remains current rather than chronological. Check referenced files and claims against actual source. Preserve historical evidence instead of editing it to impersonate current state.

Identify duplicated or conflicting rules and establish the real authority before changing them. Preserve stronger local requirements. A missing fact is a gap, not an invitation to insert a plausible default.

If repair is authorized, edit the narrow owner and necessary pointers; preserve unrelated changes. Do not restructure the repository merely for uniform filenames. Retain useful rationale and archive only within accepted scope.

Report observed defects separately from suggestions. For each change or finding provide the owner, impact, evidence, verification and unresolved decisions. A second pass should find the same ownership map rather than create another layer of guidance.
