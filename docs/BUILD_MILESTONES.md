# Grow an extension in useful slices

Each slice needs observable behavior, failure tests and a disable path. Finish its recovery cases before expanding authority. The example implements only the first slice's narrow fixture workflow.

| Stage | Build | Acceptance |
| --- | --- | --- |
| 1. State and one check | Proposal, decision, fixed check, events, status | Reject missing decision, changed input, failed check and malformed history |
| 2. Guidance | Resolve adopted command owners and repository identity | Ambiguous guidance blocks; no invented defaults |
| 3. Workspaces | One assigned writer per registered branch/worktree | Refuse shared ownership and unknown cleanup targets |
| 4. Execution | Reviewed commands, bounded output, cancellation | Launch failure, nonzero exit and parent death cannot become success |
| 5. Scheduling | Resource conflicts and integration checkpoints | No overlapping exclusive jobs; freshness at admission and result |
| 6. Review | Request/target/head/result identity and serialized operations | Stale results cannot close; findings retain disposition |
| 7. Continuation | Durable recall and completion-driven wake | No duplicate turns or autonomous resolution of missing decisions |
| 8. Attempt history | Recurrence checkpoints and useful lessons | Intervention follows observed history; operator selects strategy |
| 9. Multiple repos | Dependencies and integration acceptance | Consumer readiness waits for prerequisite and compatible evidence |

## Worker lifecycle

Choose supported responsibilities using the [role guide](AGENT_ROLES.md) before adding dispatch. Define the collector, judgment and writing boundaries and select only the routes your workflow needs. Role identity and permission checks accompany workspace and attempt identity.

Distinguish requested, admitted, running, settling and terminal states when processes are introduced. "Done" text does not prove process exit or workspace release. Bind results to unique attempts and reject old-generation delivery.

Assign ownership of cancellation, streams, timeouts and cleanup. Restrict workers through controls appropriate to the host. Do not widen tool permissions when a configured tool is unavailable. Preserve dirty or unmerged work and uncertain processes for explicit disposition.

## Waiting and continuation

Prefer host/process events. If a service requires polling, use a bounded adapter with backoff, cancellation and a terminal failure state. Avoid repeated model turns checking completion. Resume only at a supported settled boundary after retries and queued work drain.

Continuation can request another authorized step; it cannot grant permission. Define stop and recovery behavior before automatic turns. Start trajectory supervision in advisory mode before making it blocking.

## Measure the benefit

Track completion, failures, waiting versus working time, repeated context, operator interventions and recovery. Compare equivalent tasks and environments. Keep raw transcripts private. A smaller prompt alone is not reliability evidence.

## Rollout and rollback

Test configuration, stored-record migration, late events, process ownership and provider failure. State which guarantees rely on the host and which are unimplemented. Disable dispatch/continuation first, settle owned processes and preserve records/workspaces. Fall back to repository docs and manual commands. Do not delete uncertain work as part of disabling automation.
