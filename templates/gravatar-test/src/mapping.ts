import { BigDecimal, log } from "@graphprotocol/graph-ts";
import { NewGravatar, UpdatedGravatar } from "../generated/Gravity/Gravity";
import { Gravatar } from "../generated/schema";
import {
  generateGravatarId,
  createGravatar,
  updateGravatar,
  createTestEntity,
  generateTestEntityId,
  generateTestEntity2Id,
  createTestEntity2,
} from "./generated/EntityHelpers";

export function handleNewGravatar(event: NewGravatar): void {
  let x: Array<BigDecimal> = [BigDecimal.fromString("1.2")];
  let test2 = generateTestEntity2Id("t2", BigDecimal.fromString("2"));
  createTestEntity2(test2, {
    text: "test",
    num: BigDecimal.zero(),
    nums: x,
  });
  let grav = createGravatar(generateGravatarId(event.params.id), {
    owner: event.params.owner,
    displayName: event.params.displayName,
    imageUrl: event.params.imageUrl,
    testEntitiesTwo: [test2],
  });

  createTestEntity(generateTestEntityId("name", BigDecimal.zero()), {
    text: "test",
    num: BigDecimal.zero(),
    nums: x,
    gravatar: grav.id,
  });
}

export function handleUpdatedGravatar(event: UpdatedGravatar): void {
  updateGravatar(generateGravatarId(event.params.id), {
    owner: event.params.owner,
    displayName: event.params.displayName,
    imageUrl: event.params.imageUrl,
  });
}
