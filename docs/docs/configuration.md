---
id: configuration
title: Configuration
sidebar_label: Configuration
slug: /configuration
---

<sub><sup> NOTE: These docs are under active development 👷‍♀️👷 </sup></sub>

---

## Getting Started

Subgraph Uncrashable by Float is a complementary tool to an existing subgraph that ensures data safety and atomic loading. To begin developing your subgraph start [here](https://thegraph.com/docs/en/developing/creating-a-subgraph/).

## Uncrashable Config

Once your subgraph is in place, Subgraph Uncrashable can be used to create helper functions for your entities to ensure your entities function as intended.

Below is an example `uncrashable-config.yaml` file for the [gravatar example subgraph](https://github.com/graphprotocol/example-subgraph).

```yaml
networkConfig:
  entityIdPrefixes:
    - networks:
        - mainnet
      prefix: ""
    - networks:
        - ganache
      prefix: local
entitySettings:
  Gravatar:
    useDefault:
      imageUrl: {}
    setters:
      - name: updateGravatar
        fields:
          - owner
          - displayName
          - imageUrl
      - name: setOwner
        fields:
          - owner
      - name: setDisplayName
        fields:
          - displayName
      - name: setImageUrl
        fields:
          - imageUrl
    entityId:
      - name: gravityId
        type: BigInt
```

## Network Config

The `networkConfig` specification in the `uncrashable-config.yaml` allows for specifying certain prefixes for the entity IDs. This is useful when deploying the same subgraph on multiple chains.

Required fields:

- `entityIdPrefixes` — An array of `networks` and `prefix`.
- `networks` — An array of all networks that would correspond to the prefix.
- `prefix` - A string appended to the start of any ID on that specific network. This is useful to differentiate entities in a multi-chain application.

Example of generated function for the Gravatar Entity ID as per the above configuration:

```typescript
export function generateGravatarId(gravityId: BigInt): string {
  return ENTITY_ID_PREFIX + gravityId.toString();
}
```

## EntitySettings

The `entitySettings` field allows for specifying the configuration of any entity in the subgraph schema.
The following fields are supported:

- `useDefault` — Specify which entity parameters are defaulted when creating the entity.
- `entityId` — Specify the fields and their types that will comprise the ID of the entity. (This ensures standardization of all entity IDs) - see generated example above.
- `setters` - An array of setter functions that can be used to be set or update entity parameters after initial creation of the entity.

### entityId

Supported types for entityId values are:

```javascript
String;
BigInt;
Bytes;
Address;
BigDecimal;
constant;
```

`constant` is a unique type to the Float Subgraph Uncrashable and allows for specifying a constant string in the ID. Example:

```yaml
entityId:
  - type: constant
    value: "Gravatar"
```

### setters

Specify setter functions to update entity parameters after entity creation. Ensures atomic loading and saving.

Example of `updateGravatar` as per the above `uncrashable-config.yaml`

```typescript
export function updateGravatar(
  entityId: string,
  newValues: updateGravatarValues
): void {
  let entity = getGravatar(entityId);
  entity.owner = newValues.owner;
  entity.displayName = newValues.displayName;
  entity.imageUrl = newValues.imageUrl;

  entity.save();
}
```

## Using the Float Graph Uncrashable

Once the `uncrashable-config.yaml` has been created run the following:

```sh
graph codegen -u
```

and then run the graph uncrashable codegen.

Now you can import the generated functions from the `UncrashableHelpers.ts` into your subgraph mapping files.

Additionally the `-uc <path-to-config>` flag can be used to set the config file used by uncrashable. This is useful if you have multiple configurations in the same codebase. Along the same lines the output folder can be renamed using the `-o <folder-name>` command.

## Usage examples from the above uncrashable-config.yaml

Create Gravatar:

```typescript
createGravatar(generateGravatarId(event.params.id), {
  owner: event.params.owner,
  displayName: event.params.displayName,
});
```

This creates and saves a Gravatar entity with the correct ID and initial parameters set. `imageUrl` is defaulted in this example.

Update Gravatar setter function:

```typescript
updateGravatar(generateGravatarId(event.params.id), {
  owner: event.params.owner,
  displayName: event.params.displayName,
  imageUrl: event.params.imageUrl,
});
```

By using the `generateGravatarId` function, this ensures that the id always conforms to configured specifications.

Creating and updating entities in the above way provides assurance that the data in the entities is always up to date and as expected.
