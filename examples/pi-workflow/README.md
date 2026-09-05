# A small Pi workflow extension

This original teaching example demonstrates one rule: **only a confirmed plan with a passing check of its current fixture inputs can complete**.

It runs a fixed JSON fixture check. It provides no generic shell executor, worker orchestration, filesystem sandbox, remote review or merge automation. The broader TypeScript contracts are design exercises, not additional capabilities.

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
| `/workflow-demo confirm` | An operator dialog describes the exact plan and one fixed check. |
| Cancel the dialog | Plan remains unconfirmed; no check is allowed. |
| `/workflow-demo confirm` and accept | Confirmed; the model did not approve it. |
| `/workflow-demo check` | Actual fixture check passes and consumes the confirmation. |
| `/workflow-demo close` | Complete for this fixture check only. |
| `/workflow-demo status` | Complete with a passing result. |
| `/workflow-demo reset` | Inactive; history and repository files remain. |

The helper prints the temporary workspace location and retains it when you exit. It contains only generated demo data. You may inspect or remove that exact directory when finished; no cleanup command targets your real repositories.

## Try failure and restoration

In that disposable repository, change the fixture's `ready` value to `false`. The old plan becomes stale. Propose and confirm a new plan; its check fails and closeout refuses. Restore the fixture, propose again and obtain a new decision.

Changing the commit or fixture after a passing check also blocks completion. A result applies only to the plan, commit and fixture digest it records. Other dirty files are deliberately outside this example's evidence scope.

For a repeatable restart test, run the integration check defined in [CONTRIBUTING.md](../../CONTRIBUTING.md). It starts the actual Pi CLI in RPC mode with an isolated operator UI client, drives approval/cancellation, verifies disk records, restarts the same session and exercises stale and failed results. The client supplies scripted operator responses for testing; those are not evidence of a human product approval.

Malformed history blocks the demo and requires a fresh isolated session. Reset does not bypass malformed history. A persistence error blocks the running controller, because Pi can update its in-memory branch before an append fails. The demo does not promise transactional durability or recovery from a corrupted host session.

## Read the implementation

- [core.ts](core.ts): validated event records, replay, transitions and evidence freshness.
- [controller.ts](controller.ts): local inspection, decisions and actual check execution; stale asynchronous decisions are discarded.
- [index.ts](index.ts): Pi commands, proposal tool, selected-branch restoration and status.
- [fixture.ts](fixture.ts): bounded fixture reading and the fixed check.
- [contracts.ts](contracts.ts): broader interfaces for later implementation exercises.

The model-facing `workflow_demo_propose` tool only proposes. There is no model-facing confirm/check/merge tool. Commands and records are trusted within the local Pi host; this is not an adversarial authentication boundary.

The extension creates no timers or workers. Shutdown invalidates pending decisions and clears its status. It restores the selected session branch on start/navigation. [The framework](../../docs/EXTENSION_FRAMEWORK.md) explains what to add next and what those additions would require.
