import { BigInt, dataSource } from "@graphprotocol/graph-ts";
import {
  TokensReleased,
  TokensWithdrawn,
  TokensRevoked,
  ManagerUpdated,
  ApproveTokenDestinations,
  RevokeTokenDestinations,
} from "../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet";

import { TokenLockWallet } from "../generated/schema";

import {
  getTokenLockWallet,
  generateTokenLockWalletId,
  setTokensReleased,
  setTokensWithdrawn,
  setTokensRevoked,
  setTokenDestinationsApproved,
} from "./generated/UncrashableHelpers";

// export function handleTokensReleased(event: TokensReleased): void {
//   let tokenLockWallet = TokenLockWallet.load(event.address.toHexString())!
//   tokenLockWallet.tokensReleased = tokenLockWallet.tokensReleased.plus(event.params.amount)
//   tokenLockWallet.save()
// }

// export function handleTokensWithdrawn(event: TokensWithdrawn): void {
//   let tokenLockWallet = TokenLockWallet.load(event.address.toHexString())!
//   tokenLockWallet.tokensWithdrawn = tokenLockWallet.tokensWithdrawn.plus(event.params.amount)
//   tokenLockWallet.save()
// }

// export function handleTokensRevoked(event: TokensRevoked): void {
//   let tokenLockWallet = TokenLockWallet.load(event.address.toHexString())!
//   tokenLockWallet.tokensRevoked = tokenLockWallet.tokensRevoked.plus(event.params.amount)
//   tokenLockWallet.save()
// }
export function handleTokensReleased(event: TokensReleased): void {
  let tokenLockWallet = getTokenLockWallet(
    generateTokenLockWalletId(event.address)
  );
  setTokensReleased(event.address.toHexString(), {
    tokensReleased: tokenLockWallet.tokensReleased.plus(event.params.amount),
  });
}

export function handleTokensWithdrawn(event: TokensWithdrawn): void {
  let tokenLockWallet = getTokenLockWallet(
    generateTokenLockWalletId(event.address)
  );
  setTokensWithdrawn(event.address.toHexString(), {
    tokensWithdrawn: tokenLockWallet.tokensWithdrawn.plus(event.params.amount),
  });
}

export function handleTokensRevoked(event: TokensRevoked): void {
  let tokenLockWallet = getTokenLockWallet(
    generateTokenLockWalletId(event.address)
  );
  setTokensRevoked(event.address.toHexString(), {
    tokensRevoked: tokenLockWallet.tokensRevoked.plus(event.params.amount),
  });
}

export function handleManagerUpdated(event: ManagerUpdated): void {
  let id = event.address.toHexString();
  let tokenLockWallet = TokenLockWallet.load(id)!;
  tokenLockWallet.manager = event.params._newManager;
  tokenLockWallet.save();
}

export function handleApproveTokenDestinations(
  event: ApproveTokenDestinations
): void {
  let tokenLockWallet = getTokenLockWallet(
    generateTokenLockWalletId(dataSource.address())
  );
  if (dataSource.network() == "rinkeby") {
    setTokenDestinationsApproved(
      generateTokenLockWalletId(dataSource.address()),
      { tokenDestinationsApproved: true }
    );
  }
  let context = dataSource.context();
  if (context.get("contextVal")!.toI32() > 0) {
    tokenLockWallet.setBigInt(
      "tokensReleased",
      BigInt.fromI32(context.get("contextVal")!.toI32())
    );
  }
  tokenLockWallet.save();
}

export function handleRevokeTokenDestinations(
  event: RevokeTokenDestinations
): void {
  let tokenLockWallet = TokenLockWallet.load(event.address.toHexString())!;
  tokenLockWallet.tokenDestinationsApproved = false;
  tokenLockWallet.save();
}
