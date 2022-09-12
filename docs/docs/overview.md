---
id: overview
title: Overview
sidebar_label: Overview
slug: /overview
---

<sub><sup> NOTE: These docs are under active development 👷‍♀️👷 </sup></sub>

---

**Subgraph Uncrashable by Float** is a code generation tool that generates a set of helper functions from the graphql scheme of the project. 

This completely abstracts the need for subgraph developers to call `new Entity`, `Entity.load` and `Entity.save()` functions which are all inherently error prone, and in turn ensures that all interactions with entities in the subgraph are completely safe. 

Please note, this doesn’t mean that the subgraph code won’t have logic errors. Sometimes it is useful for a subgraph to crash when things appear to go wrong (e.g. while it is syncing historic data), other times you want it to keep going but alert the development team that there is an issue so they can rectify things as soon as possible. We have gone with the approach of allowing the subgraph developer to specify a timestamp after which the subgraph should no-longer crash on error but rather keep going using our default entity approach.

The code generation tool accommodates all subgraph types and is configurable for users to set  sane defaults on values. The code generation will use this config to generate helper functions that are to the users specification.

The framework also includes a way (via the config file) to create custom but safe setter functions for groups of entity variables. This way it is impossible for the user to load/use a stale graph entity and it is also impossible to forget to save or set a variable that is required by the function.

Warning logs are recorded as warning logs indicating where there is a breach of subgraph logic to help patch the issue to ensure data accuracy. These logs can be viewed in the The Graph's hosted service under the 'Logs' section. 