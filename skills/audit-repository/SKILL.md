---
name: audit-repository
description: "Perform an evidence-based repository audit focused on consequential risks and useful findings. Use for an explicit audit or readiness investigation; do not silently turn findings into implementation."
---

# Audit from risk and evidence

Establish scope, source revision, important user outcomes and exclusions. Read repository rules and relevant architecture. Prioritize consequences such as data loss, identity errors, compatibility breaks and misleading evidence before cosmetic consistency.

Build a small evidence registry: claim, source, observed/inferred/unresolved/refuted status, impact, owner and remaining verification. For absence claims record where and how you searched. Spot-read load-bearing source and tests; do not rely only on a collector summary.

Look for contradicting evidence and actual consuming paths. A currently unreachable defect can remain a routed risk; a hypothetical concern is not automatically a confirmed defect. Use domain specialists only where the task and available capabilities justify them.

Tie each finding to an invariant, exact evidence and bounded repair. Distinguish current defects from historical artifacts. Avoid severity inflation and overlapping reports of one root cause.

Return prioritized findings, inspected scope, uncertainties, validation limits and recommended next tasks. Remain read-only unless repair is authorized. A finding does not grant scope to rewrite unrelated code, alter settings or publish issues.
