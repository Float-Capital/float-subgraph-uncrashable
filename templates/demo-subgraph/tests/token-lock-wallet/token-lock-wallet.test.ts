import {
  assert,
  test,
  newMockEvent,
  dataSourceMock,
  describe,
  beforeAll,
  afterAll,
  logStore,
  clearStore,
} from "matchstick-as/assembly/index";
import {
  Address,
  BigInt,
  Bytes,
  DataSourceContext,
  store,
  Value,
} from "@graphprotocol/graph-ts";

import { handleApproveTokenDestinations } from "../../src/token-lock-wallet";
import { ApproveTokenDestinations } from "../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet";
import {
  NameSignalTransaction,
  TokenLockWallet,
  GraphAccount,
  Subgraph,
} from "../../generated/schema";
import { mockGraphAccount, mockNameSignalTransaction } from "./utils";
import {
  createTokenLockWallet,
  generateGraphAccountId,
  generateNameSignalTransactionId,
  generateTokenLockWalletId,
  getGraphAccount,
  getTokenLockWallet,
  setOperators,
  setSigner,
} from "../../src/generated/UncrashableHelpers";

describe("dataSourceMock", () => {
  beforeAll(() => {
    let addressString = "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A";
    let address = Address.fromString(addressString);

    createTokenLockWallet(generateTokenLockWalletId(address), {
      token: Bytes.fromHexString("0xc944e90c64b2c07662a292be6244bdf05cda44a7"),
    });

    let context = new DataSourceContext();
    context.set("contextVal", Value.fromI32(325));

    dataSourceMock.setReturnValues(addressString, "rinkeby", context);
  });

  afterAll(() => {
    dataSourceMock.resetValues();
  });

  test("Simple dataSource mocking example", () => {
    let addressString = "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A";
    let address = Address.fromString(addressString);

    let event = changetype<ApproveTokenDestinations>(newMockEvent());
    let wallet = TokenLockWallet.load(address.toHex())!;

    assert.assertTrue(!wallet.tokenDestinationsApproved);

    handleApproveTokenDestinations(event);

    wallet = getTokenLockWallet(address.toHex())!;

    assert.assertTrue(wallet.tokenDestinationsApproved);
    assert.bigIntEquals(wallet.tokensReleased, BigInt.fromI32(325));
  });
});

describe("@derivedFrom fields", () => {
  beforeAll(() => {
    mockGraphAccount("12");
    mockGraphAccount("1");
  });

  afterAll(() => {
    clearStore();
  });

  test("Derived fields example test", () => {
    let mainAccount = GraphAccount.load("12")!;

    setOperators(generateGraphAccountId("1"), {
      operators: [mainAccount.id],
    });

    mockNameSignalTransaction("1234", mainAccount.id);
    mockNameSignalTransaction("2", mainAccount.id);

    mainAccount = getGraphAccount(generateGraphAccountId("12"));

    assert.assertNotNull(mainAccount.get("nameSignalTransactions"));
    assert.assertNotNull(mainAccount.get("operatorOf"));
    assert.i32Equals(2, mainAccount.nameSignalTransactions.length);
    assert.stringEquals("1", mainAccount.operatorOf[0]);

    mockNameSignalTransaction("2345", mainAccount.id);

    setSigner(generateNameSignalTransactionId("1234"), {
      signer: "11",
    });

    store.remove("NameSignalTransaction", "2");

    mainAccount = GraphAccount.load("12")!;
    assert.i32Equals(1, mainAccount.nameSignalTransactions.length);
  });
});
