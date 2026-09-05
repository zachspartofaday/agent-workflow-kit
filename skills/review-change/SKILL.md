---
name: review-change
description: "Review a specific change and manage finding resolution against its current candidate. Use for a review loop or readiness assessment, with the actual provider adapter when applicable."
---

# Review the actual candidate

Identify repository, target, base/dependencies and exact candidate. Read local review policy and validation commands. If another controller owns formal review, use its interface. Do not issue a competing request.

Admit final review when declared work is complete, required validation is current and prerequisites are settled. Use one formal operation per target. A provider acknowledgement, silence or model-written summary is not a completed result. If the provider cannot bind a result to the candidate, report it as incomplete evidence.

Classify findings by violated invariant and severity under local policy. For each, record fixed with resolving change and checks; refuted with current evidence; stale with why it no longer applies; or deliberately deferred only where policy permits. Do not drop inconvenient findings to manufacture cleanliness.

After fixes, finish the candidate, refresh affected validation and request review of its current identity. An old clean result remains history. A changed dependency can also stale evidence. If failures recur at the same mechanism, diagnose the class and consequences before another patch round. Keep retries bounded by a concrete recovery policy.

Return reviewed candidate, validation evidence, completed provider result or manual-review limits, finding dispositions, dependency state and blockers. Tests are not review evidence; review is not permission to merge or publish. Never claim independent review when no independent reviewer inspected the change.
