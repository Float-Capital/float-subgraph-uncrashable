import { BigInt, dataSource, log } from "@graphprotocol/graph-ts";
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
  updateManager,
} from "./generated/UncrashableHelpers";

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
  let tokenLockWallet = getTokenLockWallet(
    generateTokenLockWalletId(event.address)
  );
  updateManager(event.address.toHexString(), {
    manager: event.params._newManager,
  });
}

export function handleApproveTokenDestinations(
  event: ApproveTokenDestinations
): void {
  let tokenLockWalletId = generateTokenLockWalletId(dataSource.address());

  if (dataSource.network() == "rinkeby") {
    setTokenDestinationsApproved(tokenLockWalletId, {
      tokenDestinationsApproved: true,
    });
  }
  let context = dataSource.context();
  if (context.get("contextVal")!.toI32() > 0) {
    setTokensReleased(tokenLockWalletId, {
      tokensReleased: BigInt.fromI32(context.get("contextVal")!.toI32()),
    });
  }
}

export function handleRevokeTokenDestinations(
  event: RevokeTokenDestinations
): void {
  let tokenLockWalletId = generateTokenLockWalletId(dataSource.address());
  setTokenDestinationsApproved(tokenLockWalletId, {
    tokenDestinationsApproved: false,
  });
}
