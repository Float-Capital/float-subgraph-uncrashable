---
id: installation
title: Installation
sidebar_label: Installation
slug: /installation
---

<sub><sup> NOTE: These docs are under active development 👷‍♀️👷 </sup></sub>

---

Subgraph Uncrashable is available as a standalone npm package or using the Graph CLI as an optional flag.

## Graph CLI

```graph codegen [options] [<subgraph-manifest>]```

```
Options:
-h, --help Show usage information
-o, --output-dir <path> Output directory for generated types (default: generated/)
--skip-migrations Skip subgraph migrations (default: false)
-w, --watch Regenerate types when subgraph files change (default: false)
-u, --uncrashable Generate Float Subgraph Uncrashable helper file
-uc, --uncrashable-config <path> Directory for uncrashable config (default: ./uncrashable-config.yaml)
```

Run the graph uncrashable codegen via the Graph CLI:

```graph codegen -u```

## Standalone npm package

The Subgraph Uncrashable tool can be installed using `npm` or `yarn`:

### npm
```npm install @float-capital/float-subgraph-uncrashable```

### Yarn
 ```yarn add @float-capital/float-subgraph-uncrashable```

Run the graph uncrashable codegen as a standalone package:

```uncrashable```
