import { Gravatar, Transaction } from "../generated/schema";
import {
  NewGravatar,
  UpdatedGravatar,
  CreateGravatarCall,
} from "../generated/Gravity/Gravity";
import {
  generateGravatarId,
  createGravatar,
  updateGravatar,
  createTransaction,
  generateTransactionId,
} from "./generated/UncrashableHelpers";

export function handleNewGravatar(event: NewGravatar): void {
  createGravatar(generateGravatarId(event.params.id), {
    owner: event.params.owner,
    displayName: event.params.displayName,
    imageUrl: event.params.imageUrl,
  });
}

export function handleUpdatedGravatar(event: UpdatedGravatar): void {
  updateGravatar(generateGravatarId(event.params.id), {
    owner: event.params.owner,
    displayName: event.params.displayName,
    imageUrl: event.params.imageUrl,
  });
}

export function handleCreateGravatar(call: CreateGravatarCall): void {
  createTransaction(generateTransactionId(call.transaction.hash), {
    displayName: call.inputs._displayName,
    imageUrl: call.inputs._imageUrl,
  });

  // let id = call.transaction.hash.toHex();
  // let transaction = new Transaction(id);
  // transaction.displayName = call.inputs._displayName;
  // transaction.imageUrl = call.inputs._imageUrl;
  // transaction.save();
}
