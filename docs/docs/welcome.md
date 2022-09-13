---
id: welcome
title: Welcome
sidebar_label: Welcome
slug: /
---

<sub><sup> NOTE: These docs are under active development 👷‍♀️👷 </sup></sub>

---

The team behind Float has been building subgraphs for last 5 years. Their first subgraph was for [wildcards.world](https://wildcards.world/) near the end of 2018, and since then, they have been contracted to build out multiple production critical graphs for clients (as [avolabs.io](http://avolabs.io/)) and most recently for their own protocol, [Float](https://float.capital). 

Through working extensively with subgraphs, common problems seen repeatedly in subgraph development are issues of loading undefined entities, not setting or initializing all values of entities, and race conditions on loading and saving entities, respectively. Mishandled entities cause subgraphs to crash, which can be very disruptive for projects that are dependent on the graph. The unavailability of subgraphs can result in unavailability of the overall system and adverse business impacts.

The Float team has found strategies to make subgraphs more type-safe via a variety of helper functions that make many classes of common graph bugs impossible, and have been used with great effect in developing and upgrading Float’s subgraphs. 

In August 2022, the Float team decided that the use of this tool would benefit any subgraph developer and ultimately benefit overall Graph ecosystem, and applied for a grant with The Graph Foundation. After successful application, Float received funding to decouple the tool from its current hard-coded integration,  package the code generation tool into a stand-alone application, open-source it, and integrate with the [Graph CLI](https://thegraph.com/docs/en/cookbook/quick-start/). 

Any project building or upgrading a subgraph could use this tool to make their subgraphs “uncrashable” and ensure continuous uptime :rocket: