import {
  assert,
  clearStore,
  test,
  describe,
  afterEach,
} from "matchstick-as/assembly/index";

test(
  "Should throw an error",
  () => {
    throw new Error();
  },
  true
);

describe("boilerplate", () => {
  afterEach(() => {
    clearStore();
  });

  test("boilerplate", () => {
    // Call mappings
  });
});
