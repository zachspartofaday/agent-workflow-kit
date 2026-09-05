import { profiles } from "./roles.js";
import { existsSync } from "node:fs";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { Controller, defaultPorts } from "./controller.js";
export const ENTRY = "workflow-kit.demo.v1";
export default function extension(pi: ExtensionAPI) {
  const controller = new Controller({ ...defaultPorts, append: event => pi.appendEntry(ENTRY, event) });
  const render = (ctx: ExtensionContext) => {
    const value = controller.status(ctx.cwd);
    if (ctx.hasUI) ctx.ui.setStatus("workflow-kit-demo", value.startsWith("Fixture demo: inactive;") ? undefined : value);
    return value;
  };
  const restore = (_event: unknown, ctx: ExtensionContext) => {
    controller.restore(ctx.sessionManager.getBranch().filter(e => e.type === "custom" && e.customType === ENTRY).map(e => e.type === "custom" ? e.data : undefined));
    render(ctx);
  };
  pi.on("session_start", restore);
  pi.on("session_tree", restore);
  pi.on("session_shutdown", (_event, ctx) => {
    controller.stop();
    if (ctx.hasUI) ctx.ui.setStatus("workflow-kit-demo", undefined);
  });
  const requirePersistedSession = (ctx: ExtensionContext) => {
    const file = ctx.sessionManager.getSessionFile();
    const hasAssistant = ctx.sessionManager.getBranch().some(e => e.type === "message" && e.message.role === "assistant");
    if (!file || !existsSync(file) || !hasAssistant) throw new Error("Use the prepared demo session (npm run demo); fresh Pi sessions may not yet persist entries.");
  };
  pi.registerTool({
    name: "workflow_demo_propose", label: "Propose fixture demo", description: "Propose the fixed collector/judge/mechanical candidate workflow. This does not confirm or execute it; the operator uses /workflow-demo confirm.",
    parameters: Type.Object({ objective: Type.String({ minLength: 1, maxLength: 240 }) }, { additionalProperties: false }),
    async execute(_id, params, signal, _update, ctx) {
      if (signal?.aborted) throw new Error("Proposal cancelled");
      requirePersistedSession(ctx);
      controller.propose(params.objective, ctx.cwd);
      return { content: [{ type: "text", text: render(ctx) }], details: { phase: controller.getState().phase } };
    }
  });
  pi.registerCommand("workflow-demo", {
    description: "Fixture teaching workflow: propose [objective] | confirm | collect | judge | apply | check | close | status | roles | report | reset",
    async handler(args, ctx) {
      const [action, ...words] = args.trim().split(/\s+/);
      try {
        switch (action) {
          case "propose": requirePersistedSession(ctx); controller.propose(words.join(" ") || "Verify the teaching fixture", ctx.cwd); break;
          case "confirm":
            if (!ctx.hasUI) throw new Error("Confirmation needs an operator UI; no headless auto-approval");
            await controller.confirm(ctx.cwd, description => ctx.ui.confirm("Confirm fixture role workflow", description));
            break;
          case "collect": controller.run("collect", ctx.cwd); break;
          case "judge": controller.run("judge", ctx.cwd); break;
          case "apply": controller.run("mechanical", ctx.cwd); break;
          case "report": ctx.ui.notify(controller.report(ctx.cwd), "info"); return;
          case "roles": ctx.ui.notify(Object.entries(profiles).map(([role, p]) => `${role}: ${p.purpose}; target=${p.target}`).join("\n"), "info"); return;
          case "check": controller.check(ctx.cwd); break;
          case "close": controller.close(ctx.cwd); break;
          case "reset": controller.reset(); break;
          case "status": break;
          default: throw new Error("Use propose, confirm, collect, judge, apply, check, close, status, roles, report or reset");
        }
        ctx.ui.notify(render(ctx), "info");
      } catch (error) {
        // Avoid exposing raw filesystem/process diagnostics in routine model/UI context.
        const message = error instanceof Error ? error.message : "Operation unavailable";
        ctx.ui.notify(message.startsWith("Command failed") || message.includes("ENOENT") ? "Repository or fixture unavailable; use a Git checkout containing the demo fixture." : message, "error");
        render(ctx);
      }
    }
  });
}
