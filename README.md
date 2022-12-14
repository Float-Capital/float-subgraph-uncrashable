# Subgraph Uncrashable: a safe subgraph code generation framework

This repository contains the software packages and dependencies to install and run Subgraph Uncrashable - a safe subgraph code generation framework - built by Float.

"Since moving to this graph generation strategy internally more than 10 months ago, we have had zero graph crashes in production. We believe the system of code-generation that we have created would allow users to build graphs with more confidence. Haskell is to programming languages (ie no runtime errors) as what our code-generation framework is to the graph" - Jason Smythe, Co-Founder at Float

## Overview

Subgraph Uncrashable is a code generation framework that subgraph developers can integrate into their repository for safe subgraph development and upgrades. The tool generates a set of helper functions from the graphql schema of the tool to esnure that all interactions with entities in subgraphs are completely atomic.

Common problems seen repeatedly in subgraph development are issues of loading undefined entities, not setting or initializing all values of entities, and race conditions on loading and saving entities, respectively. Mishandled entities cause subgraphs to crash, which can be very disruptive for projects that are dependent on the graph. Unavailability of subgraphs can result in unavailability of the overall system and adverse business impacts.

The code generation is also configurable to set default values and configure the level of security checks that suits individual projects’ needs. Additionally, the tool can notify the users whenever there is a breach or potential breach of subgraph logic security and help them patch these issues. More info on this in the 'Usage' section.

Integrate with Subgraph Uncrashable to make your subgraph "uncrashable" and ensure continuous uptime.

## Installation

The Float Subgraph Uncrashable can be installed with `npm` or `yarn`:

```sh
# NPM
npm install @float-capital/float-subgraph-uncrashable

# Yarn
 yarn add @float-capital/float-subgraph-uncrashable
---
```

## Getting Started

Subgraph Uncrashable by Float is a complementary tool to an existing subgraph that ensures data safety and atomic loading. To begin developing your subgraph start [here](https://thegraph.com/docs/en/developing/creating-a-subgraph/).

Once your subgraph is in place, Subgraph Uncrashable can be used to create helper functions for your entities to ensure your subgraph doesn't crash. For more information see our [helpful docs](https://float-capital.github.io/float-subgraph-uncrashable/docs/) for how to setup and configure your subgraph to be Uncrashable.

##

## Contributions

This is an open source project and any contributions are welcome! Please see the [Contribution Guidelines](github.com/Float-Capital/float-subgraph-uncrashable/blob/main/CONTRIBUTING.md) to start contributing.
