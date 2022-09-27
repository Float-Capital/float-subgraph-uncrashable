import { GraphAccount, NameSignalTransaction } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";
import {
  createGraphAccount,
  createNameSignalTransaction,
  generateGraphAccountId,
  generateNameSignalTransactionId,
} from "../../src/generated/UncrashableHelpers";

export function mockGraphAccount(id: string): void {
  createGraphAccount(generateGraphAccountId(id), {
    createdAt: 0,
    operators: [],
    balance: BigInt.fromI32(0),
    curationApproval: BigInt.fromI32(0),
    stakingApproval: BigInt.fromI32(0),
    gnsApproval: BigInt.fromI32(0),
    subgraphQueryFees: BigInt.fromI32(0),
    tokenLockWallets: [],
  });
}
export function mockNameSignalTransaction(id: string, signer: string): void {
  createNameSignalTransaction(generateNameSignalTransactionId(id), {
    signer: signer,
    blockNumber: 1,
    timestamp: 1,
    type: "stake",
    nameSignal: BigInt.fromI32(1),
    versionSignal: BigInt.fromI32(1),
    tokens: BigInt.fromI32(1),
    subgraph: "1",
  });
}
