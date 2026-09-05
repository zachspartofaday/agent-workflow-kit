# Contributing

This is a documentation and teaching-code repository. It is not a production agent supervisor.

## Setup

Use Node.js 22.19 or newer and npm. The lockfile records the development toolchain:

```sh
npm ci
```

## Validation

Run on the complete candidate:

```sh
npm run check
```

This compiles TypeScript, runs behavioral core/adapter/fixture tests and checks local Markdown links, skill structure and self-containment. It does not establish live provider behavior or a security sandbox.

After changing SVG sources, regenerate the checked-in PNGs:

```sh
npm run render:diagrams
```

Inspect affected diagrams at full size and README width. SVGs in `assets/diagrams/` are the editable source. The renderer uses a locked development dependency.

After adapter changes, run the actual Pi RPC integration check:

```sh
npm run test:pi
```

It uses temporary Git/config/session data, scripted operator UI responses and no model calls. Then perform the interactive walkthrough in [the demo guide](examples/pi-workflow/README.md). Record the actual Pi version and manual gaps in [validation evidence](docs/VALIDATION.md). Never borrow an active workflow session or change global Pi settings for a test.

Before committing:

```sh
git diff --check
```

Review the staged payload for private references, local paths, session data and unsupported claims. Generated builds and dependencies stay ignored. MIT applies to original content; cited projects retain their own terms.
