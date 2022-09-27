import {
  assert,
  clearStore,
  test,
  describe,
  afterEach,
} from "matchstick-as/assembly/index";

import {
  handleNewGravatars,
  createNewGravatarEvent,
  createUpdateGravatarEvent,
} from "./utils";
import { handleUpdatedGravatar } from "../../src/mapping";
import { BigDecimal } from "@graphprotocol/graph-ts";

let GRAVATAR_ENTITY_TYPE = "Gravatar";
let TEST_ENTITY_TYPE = "TestEntity";
let TEST_ENTITY_TYPE_2 = "TestEntity2";

test(
  "Should throw an error",
  () => {
    throw new Error();
  },
  true
);

describe("Mocked Events", () => {
  afterEach(() => {
    clearStore();
  });

  test("Can call mappings with custom events", () => {
    // Call mappings
    let newGravatarEvent = createNewGravatarEvent(
      12,
      "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      "Gravatar 0xdead",
      "https://example.com/image0xdead.png"
    );

    let anotherGravatarEvent = createNewGravatarEvent(
      13,
      "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      "Gravatar 0xbeef",
      "https://example.com/image0xbeef.png"
    );

    handleNewGravatars([newGravatarEvent, anotherGravatarEvent]);

    assert.entityCount(GRAVATAR_ENTITY_TYPE, 2);
    assert.fieldEquals(
      GRAVATAR_ENTITY_TYPE,
      "12",
      "displayName",
      "Gravatar 0xdead"
    );
    assert.fieldEquals(
      GRAVATAR_ENTITY_TYPE,
      "13",
      "displayName",
      "Gravatar 0xbeef"
    );
    assert.fieldEquals(GRAVATAR_ENTITY_TYPE, "13", "testEntities", "[name-0]");
    assert.fieldEquals(TEST_ENTITY_TYPE, "name-0", "text", "test");
    assert.fieldEquals(TEST_ENTITY_TYPE, "name-0", "bigDecimalNum", "3");

    assert.fieldEquals(
      TEST_ENTITY_TYPE_2,
      "t2-2",
      "bigDecimalNum",
      BigDecimal.zero().toString()
    );

    let updateGravatarEvent = createUpdateGravatarEvent(
      12,
      "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      "Gravatar 0xfeed",
      "https://example.com/image0xfeed.png"
    );
    handleUpdatedGravatar(updateGravatarEvent);
    assert.fieldEquals(
      GRAVATAR_ENTITY_TYPE,
      "12",
      "displayName",
      "Gravatar 0xfeed"
    );
  });
});
