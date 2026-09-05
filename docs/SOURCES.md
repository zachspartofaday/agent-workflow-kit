# Sources and attribution

This kit is an original synthesis informed by Zach Skjaveland's Limitless workflow. It contains no private source or private repository links. Fictional examples are not production evidence.

## NVIDIA AVO

[AVO: Agentic Variation Operators for Autonomous Evolutionary Search](https://arxiv.org/abs/2603.24517), Terry Chen and colleagues, 2026. [Version 1 full text](https://arxiv.org/html/2603.24517v1).

Relevant parallels are consulting prior solutions and domain knowledge, evaluating changes, and learning from feedback over a trajectory. The paper discusses supervision when search stalls or cycles. This kit uses those ideas to explain engineering feedback and retained attempts; operator authority, repository guidance and review contracts are separate design choices.

The [NVIDIA technical overview](https://developer.nvidia.com/blog/nvidia-avo-reaches-100-on-arc-agi-3-demonstrating-a-frontier-level-general-purpose-architecture-for-long-horizon-autonomous-agents/) discusses memory, tools and supervision at the system level.

No benchmark results transfer to this kit. It does not implement AVO or claim equivalent performance. All diagrams are original; paper figures and logos are not redistributed. No endorsement is implied.

## GPT-Erdos: candidate proofs and review

[GPT-Erdos](https://github.com/neelsomani/gpt-erdos), maintained by Neel Somani, is a research repository documenting LLM-generated candidate proofs for Erdős problems. Its [methodology](https://github.com/neelsomani/gpt-erdos#methodology) describes literature checks, candidate generation, reviewer feedback and, where possible, Lean autoformalization attempts. This reference is a project and methodology, not a paper citation.

It was an earlier inspiration for the author's workflow. Relevant lessons are to distinguish a candidate claim from a checked result, preserve reviewer feedback, and classify outcomes more carefully than “solved” or “failed.” The project's findings distinguish literature recovery, hidden constraints, conditional arguments, non-improving proofs and subtle errors.

The engineering adaptation is to retain evidence, assumptions and finding dispositions, and use independent review or refutation before accepting a claim. That adaptation is this kit's synthesis; GPT-Erdos does not establish this kit's role architecture, runtime correctness or performance. No proof artifacts or project code are redistributed here.

## Pi

- [Extension guide](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md): tools, commands, lifecycle, UI and persistence.
- [RPC guide](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md): programmatic host interaction.
- [Extension examples](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/examples/extensions): integration patterns.

Upstream APIs evolve. The lockfile and validation record identify the version tested. These references do not establish compatibility with future versions.
