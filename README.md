# Subgraph Uncrashable: a safe subgraph code generation framework

This repository contains the software packages and dependencies to install and run Subgraph Uncrashable - a safe subgraph code generation framework - developed by Float.

"Since moving to this graph generation strategy internally more than 10 months ago, we have had zero graph crashes in production. We believe the system of code-generation that we have created would allow users to build graphs with more confidence. Haskell is to programming languages (ie no runtime errors) as what our code-generation framework is to the graph" - Jason Smythe, Co-Founder at Float

## Overview 

Subgraph Uncrashable is a code generation framework that subgraph developers can integrate into their repository for safe subgraph development and upgrades. The tool generates a set of helper functions from the graphql schema of the tool to esnure that all interactions with entities in subgraphs are completely safe.

Common problems seen repeatedly in subgraph development are issues of loading undefined entities, not setting or initializing all values of entities, and race conditions on loading and saving entities, respectively. Mishandled entities cause subgraphs to crash, which can be very disruptive for projects that are dependent on the graph. Unavailability of subgraphs can result in unavailability of the overall system and adverse business impacts.

The code generation is also configurable to set default values and configure the level of security checks that suits individual projects’ needs. Additionally, the tool can notify the users whenever there is a breach or potential breach of subgraph logic security and help them patch these issues. Mor einfo on this in the 'Usage' section.

Start integrate with Subgraph Uncrashable to make your subgraph "uncrashable" and ensure continuous uptime. 


## Built with 

This section should contain all software and frameworks used in building this tool

## Prerequisites

This section should make clear any implicit assumptions (e.g. javascript packet manager installed,runtime environment, minimum version required, etc.) 

## Run the app

This section should provide steps on how to start the app

## Usage

This section should provide steps on how to configure the app

## Contributions

This is an open source project and any contributions are welcomed! Please see the [Contribution Guidelines](github.com/Float-Capital/float-subgraph-uncrashable/blob/main/CONTRIBUTING.md) to start contributing.


## Dev notes

The templates folders are submodules, run this command to clone 

`git submodule update --init`  