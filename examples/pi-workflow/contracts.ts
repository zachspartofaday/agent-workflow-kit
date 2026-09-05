/** Design interfaces for later exercises. They are not implemented runtime capabilities. */
import type { Binding } from "./core.js";
export interface CommandDeclaration {
  id: string;
  owner: { repository: string; path: string; revision: string };
  exactCommand: string;
  checkpoint: "candidate" | "integration";
}
export interface ValidationEvidence {
  candidate: Binding;
  planId: string;
  attemptId: string;
  commandId: string;
  environmentId: string;
  outcome: "passed" | "failed" | "cancelled" | "unavailable";
  artifactReference?: string;
}
export interface ReviewEvidence {
  candidate: Binding;
  requestId: string;
  sourceReference: string;
  outcome: "clean" | "findings" | "incomplete";
  findings: Array<{ id: string; invariant: string; disposition: "open" | "fixed" | "refuted" | "deferred" }>;
}
export interface Blocker {
  operation: string;
  reason: string;
  clearingAction: string;
  evidenceReference?: string;
}
export interface WorkerAssignment {
  id: string;
  candidate: Binding;
  allowedPaths: string[];
  exclusions: string[];
  resultContract: string;
}
