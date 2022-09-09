import {
  Address,
  ethereum,
  JSONValue,
  Value,
  ipfs,
  json,
  Bytes,
} from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as/assembly/index";

import { Gravatar } from "../../generated/schema";
import {
  NewGravatar,
  Gravity,
  UpdatedGravatar,
} from "../../generated/Gravity/Gravity";
import { handleNewGravatar } from "../../src/mapping";

export function handleNewGravatars(events: NewGravatar[]): void {
  events.forEach((event) => {
    handleNewGravatar(event);
  });
}

let contractAddress = Address.fromString(
  "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
);
let contract = Gravity.bind(contractAddress);

export function saveGravatarFromContract(gravatarId: string): void {
  let contractGravatar = contract.getGravatar(contractAddress);

  let gravatar = new Gravatar(gravatarId);
  gravatar.displayName = contractGravatar.value0;
  gravatar.imageUrl = contractGravatar.value1;
  gravatar.owner = contractAddress;
  gravatar.save();
}

export function createNewGravatarEvent(
  id: i32,
  ownerAddress: string,
  displayName: string,
  imageUrl: string
): NewGravatar {
  let newGravatarEvent = changetype<NewGravatar>(newMockEvent());
  newGravatarEvent.parameters = new Array();
  let idParam = new ethereum.EventParam("id", ethereum.Value.fromI32(id));
  let addressParam = new ethereum.EventParam(
    "ownderAddress",
    ethereum.Value.fromAddress(Address.fromString(ownerAddress))
  );
  let displayNameParam = new ethereum.EventParam(
    "displayName",
    ethereum.Value.fromString(displayName)
  );
  let imageUrlParam = new ethereum.EventParam(
    "imageUrl",
    ethereum.Value.fromString(imageUrl)
  );

  newGravatarEvent.parameters.push(idParam);
  newGravatarEvent.parameters.push(addressParam);
  newGravatarEvent.parameters.push(displayNameParam);
  newGravatarEvent.parameters.push(imageUrlParam);

  return newGravatarEvent;
}

export function createUpdateGravatarEvent(
  id: i32,
  ownerAddress: string,
  displayName: string,
  imageUrl: string
): UpdatedGravatar {
  let updatedGravatarEvent = changetype<UpdatedGravatar>(newMockEvent());
  updatedGravatarEvent.parameters = new Array();
  let idParam = new ethereum.EventParam("id", ethereum.Value.fromI32(id));
  let addressParam = new ethereum.EventParam(
    "ownderAddress",
    ethereum.Value.fromAddress(Address.fromString(ownerAddress))
  );
  let displayNameParam = new ethereum.EventParam(
    "displayName",
    ethereum.Value.fromString(displayName)
  );
  let imageUrlParam = new ethereum.EventParam(
    "imageUrl",
    ethereum.Value.fromString(imageUrl)
  );

  updatedGravatarEvent.parameters.push(idParam);
  updatedGravatarEvent.parameters.push(addressParam);
  updatedGravatarEvent.parameters.push(displayNameParam);
  updatedGravatarEvent.parameters.push(imageUrlParam);

  return updatedGravatarEvent;
}
