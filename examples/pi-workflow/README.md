# A small Pi workflow extension

This original teaching example runs **operator confirmation → collector → judge → mechanical writer → validation → completion**. Each handoff is bound to the plan, source and preceding assignment.

The three workers are deterministic TypeScript functions, not model sessions. The collector returns the actual fixture bytes; the judge checks them and freezes a `ready=true` change; the mechanical writer applies that exact change to a **session-stored candidate**. Validation checks the candidate. The source fixture starts with `ready=false` and remains untouched.

This demonstrates role admission, scoped outputs and handoff validation. It provides no subprocess worker orchestration, filesystem sandbox, remote review or merge automation. The other five roles in [the role guide](../../docs/AGENT_ROLES.md) remain design guidance. Unsupported roles cannot be dispatched by this demo.

## Run the isolated walkthrough

From the kit root, install and validate using [CONTRIBUTING.md](../../CONTRIBUTING.md). Then start:

```sh
npm run demo
```

The helper creates a temporary Git repository containing only the fixture, a separate Pi configuration directory and a synthetic session greeting. It uses the locked Pi package, loads only this extension, disables built-in tools and omits provider credentials. It does not modify global Pi settings or call a model. The greeting explicitly says it is synthetic; it is not model or engineering evidence.

Pi 0.85.0 defers a fresh session's initial disk persistence until an assistant entry exists. The helper uses a synthetic Pi v3 session fixture to test persistence without requiring a model call. The extension refuses proposals in a fresh/unpersisted session. This is an example of a host lifecycle dependency your own runtime must understand.

Use these commands inside Pi:

| Command | Expected observation |
| --- | --- |
| `/workflow-demo status` | Inactive; no repository check was run. |
| `/workflow-demo check` | Refuses without an operator confirmation. |
| `/workflow-demo propose Verify the teaching fixture` | Proposed; plan binds root, commit and fixture digest. |
| `/workflow-demo confirm` | An operator dialog describes the exact plan, three-role route, session candidate and fixed check. |
| Cancel the dialog | Plan remains unconfirmed; no check is allowed. |
| `/workflow-demo confirm` and accept | Confirmed; the model did not approve it. |
| `/workflow-demo apply` before collection/judgment | Refuses an out-of-order writer assignment. |
| `/workflow-demo collect` | Collected; exact source bytes and digest are bound to a read-only assignment. |
| `/workflow-demo report` | Shows the current assignment and evidence. |
| `/workflow-demo judge` | Judged; `ready=true` is frozen, preserving the other fields. |
| `/workflow-demo apply` | Applied; the mechanical writer produces the session candidate. |
| `/workflow-demo report` | Shows the candidate with `ready=true` and its assignment target. |
| `/workflow-demo check` | Actual candidate check passes; this route cannot run a second check. |
| `/workflow-demo close` | Complete for this fixture check only. |
| `/workflow-demo status` | Complete with a passing result. |
| `/workflow-demo roles` | Lists the three supported role profiles and their targets. |
| `/workflow-demo reset` | Inactive; history and repository files remain. |

The helper prints the temporary workspace location and retains it when you exit. It contains only generated demo data. You may inspect or remove that exact directory when finished; no cleanup command targets your real repositories.

## Try failure and restoration

In that disposable repository, change the fixture's `lesson` value to `unsupported`. The old plan becomes stale. Propose and confirm a new plan; collection refuses the unsupported shape instead of inventing a repair. Check and closeout remain blocked. Restore `lesson=evidence`, propose again and confirm a new route. `ready=false` is the intended starting condition, not a validation failure: the writer prepares a passing candidate from it.

Try `judge` before `collect`, `apply` before `judge`, or `check` before `apply`: each refuses. Repeating a completed stage refuses too. A new proposal or reset discards usable handoffs. The report command refuses stale evidence. The fixed successful route has no naturally failing candidate; unit tests also cover failed-check records and refusal to close them.

Changing the commit or fixture after a passing check also blocks completion. A result applies only to the plan, commit and fixture digest it records. Other dirty files are deliberately outside this example's evidence scope.

For a repeatable restart test, run the integration check defined in [CONTRIBUTING.md](../../CONTRIBUTING.md). It starts the actual Pi CLI in RPC mode with an isolated operator UI client, drives approval/cancellation, verifies disk records, restarts the same session and resumes after collection and exercises stale source and unsupported fixture refusal. The client supplies scripted operator responses for testing; those are not evidence of a human product approval.

Events now use payload **version 2** and check ID `fixture-roles-v2`. The existing custom-entry namespace is retained so old version-1 records are detected rather than silently ignored. Old sessions are deliberately refused: start a new isolated demo session; there is no automatic migration of old approvals.

Malformed history blocks the demo and requires a fresh isolated session. Reset does not bypass malformed history. A persistence error blocks the running controller, because Pi can update its in-memory branch before an append fails. The demo does not promise transactional durability or recovery from a corrupted host session.

## Read the implementation

- [core.ts](core.ts): validated event records, replay, transitions and evidence freshness.
- [controller.ts](controller.ts): local inspection, decisions and actual check execution; stale asynchronous decisions are discarded.
- [index.ts](index.ts): Pi commands, proposal tool, selected-branch restoration and status.
- [fixture.ts](fixture.ts): bounded source reading and the fixed candidate check.
- [roles.ts](roles.ts): role profiles, assignment scope, evidence checking and the frozen candidate transformation.
- [contracts.ts](contracts.ts): broader interfaces for later implementation exercises.

The model-facing `workflow_demo_propose` tool only proposes. There is no model-facing role execution, confirm/check/merge tool. Commands and records are trusted within the local Pi host; this is not an adversarial authentication boundary.

The extension creates no timers or workers. Shutdown invalidates pending decisions and clears its status. It restores the selected session branch on start/navigation. [The framework](../../docs/EXTENSION_FRAMEWORK.md) explains what to add next and what those additions would require.

## What the role checks enforce

The controller admits only the next supported role. Every recorded result includes an assignment ID, role, plan ID, source binding, predecessor ID and fixed target. Replay recomputes the permitted deterministic output and refuses stale predecessors, unknown roles, wrong targets, reused assignment IDs and altered decisions/candidates. Collection and judgment have no mutation operation; only the mechanical step can produce the candidate, and it can change only `ready` to `true`.

These are application checks inside a trusted process, not containment of hostile agents. There is no filesystem-write capability passed to these workers. A production extension must enforce model tool permissions and workspace isolation separately. Candidate data lives in the local session event log, is validated before publication to controller state, and can be inspected with `report`; it is not a source edit or a PR.
