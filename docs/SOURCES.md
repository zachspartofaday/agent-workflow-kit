# Sources and attribution

This kit is an original synthesis informed by Zach Skjaveland's Limitless workflow. It contains no private source or private repository links. Fictional examples are not production evidence.

## NVIDIA AVO

[AVO: Agentic Variation Operators for Autonomous Evolutionary Search](https://arxiv.org/abs/2603.24517), Terry Chen and colleagues, 2026. [Version 1 full text](https://arxiv.org/html/2603.24517v1).

Relevant parallels are consulting prior solutions and domain knowledge, evaluating changes, and learning from feedback over a trajectory. The paper discusses supervision when search stalls or cycles. This kit uses those ideas to explain engineering feedback and retained attempts; operator authority, repository guidance and review contracts are separate design choices.

The [NVIDIA technical overview](https://developer.nvidia.com/blog/nvidia-avo-reaches-100-on-arc-agi-3-demonstrating-a-frontier-level-general-purpose-architecture-for-long-horizon-autonomous-agents/) discusses memory, tools and supervision at the system level.

No benchmark results transfer to this kit. It does not implement AVO or claim equivalent performance. All diagrams are original; paper figures and logos are not redistributed. No endorsement is implied.

## Autonomous disproofs: planning, construction and review

Yichen Huang, [*Autonomous disproofs of the sum-product conjecture over ℝ with GPT-5.5 Pro*](https://arxiv.org/abs/2607.20525), July 9, 2026. The [Agent section](https://arxiv.org/html/2607.20525v1#S2) describes the harness; the [public project repository](https://github.com/yichenhuang/sum-product) provides code, intermediate outputs and generated proofs.

This paper was an earlier inspiration for the author's workflow. Its three-stage process develops a proof plan, constructs the proof, then critically examines and refines the result. The transferable ideas are explicit planning before construction, deliberate review afterward, and reporting unresolved gaps instead of presenting incomplete work as finished.

The paper's harness uses successive rounds in one conversation. The kit's separate worker roles, independent refutation, configurable per-role model/effort profiles, operator authority and repository-bound evidence are additional engineering design choices, not capabilities attributed to that harness. Mathematical results and reported performance do not establish this kit's correctness or efficiency. No paper figures, prompts or implementation are redistributed here.

## Pi

- [Extension guide](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md): tools, commands, lifecycle, UI and persistence.
- [RPC guide](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md): programmatic host interaction.
- [Extension examples](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/examples/extensions): integration patterns.

Upstream APIs evolve. The lockfile and validation record identify the version tested. These references do not establish compatibility with future versions.
