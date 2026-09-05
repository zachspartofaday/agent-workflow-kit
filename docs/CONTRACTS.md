# Small contracts for a workflow core

These are original teaching interfaces, not wire-compatible contracts for another runtime. The runnable subset is in [core.ts](../examples/pi-workflow/core.ts); the broader design interfaces are in [contracts.ts](../examples/pi-workflow/contracts.ts).

| Record | Creator | Binding | Invalidated by |
| --- | --- | --- | --- |
| Repository binding | Local inspector | Root, commit, relevant input digest | Root, commit or input change |
| Plan | Agent/operator proposal | ID, objective, action and binding | Replacement or changed binding |
| Operator decision | Operator command | Exact plan and binding | New plan or mismatched context |
| Role assignment/result | Controller and deterministic role | Role, unique assignment, plan/source, predecessor, fixed target and output | Wrong role/order/target, changed source or decision, reused identity |
| Validation evidence | Actual check controller | Plan, binding, attempt and result | Changed inputs or incomplete execution |
| Review evidence | Observer of reviewer | Candidate, request and result | Changed candidate or ambiguity |
| Blocker | Controller | Failed condition and clearing action | Explicitly resolved condition |

## Runtime validation

TypeScript cannot validate restored JSON. Replay accepted transition events through the same reducer; reject malformed, unsupported or out-of-order records. Duplicate IDs are harmless only when the complete payload matches. Bound history and model-authored text.

The teaching lifecycle is deliberately narrow:

```text
inactive -> proposed -> confirmed -> collected -> judged -> applied -> checked -> complete
                                  (source)      (decision) (candidate) -> failed check blocks close
```

Failed checks never satisfy closeout. A new proposal invalidates old approval and evidence. A model tool may propose; an operator command confirms. Confirmation authorizes one fixed three-role route and candidate check. The mechanical step can create only a session-stored candidate with `ready=true`; it cannot edit repository files. The collector and judge have read-only responsibilities. Roles are deterministic functions, not model sessions.

## Freshness and trust

Commit identity misses dirty inputs. The demo also digests its fixture and re-inspects before/after each role and the candidate check. A production executor must fingerprint all relevant inputs or require a clean tree, plus environment and attempt identity when results depend on them.

The fixture digest proves nothing about other repository files. The demo does not attest review, production correctness or resistance to malicious concurrent modification.

A local Pi command is the trusted operator surface here. Persisted records are not signed attestations. Remote decisions need verified actor metadata from their service; text signatures or model reports are insufficient.

Untrusted output and repository text cannot create new execution authority. A production command executor should use reviewed exact command IDs, not model-authored shell reconstructed from prose.

## Recovery and projection

Version-2 payloads reject old version-1 histories without migrating approvals; start a new demo session. Restore the selected session branch, not all historical branches. The demo requires an already persisted Pi session; the isolated helper seeds a clearly synthetic greeting because Pi defers initial persistence until an assistant entry. A disk append failure blocks the controller rather than trusting a possibly advanced host-memory branch. Rebind before dependent actions. Invalidate pending UI operations on session changes so late confirmation cannot approve another session's plan.

Project phase, check result and next action in status; expose assignment identity and the current handoff through the explicit report command. Keep bulk history outside routine model context. Reset makes the example inactive; it does not delete files or rewrite history.
