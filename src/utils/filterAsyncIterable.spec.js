import { expect } from "chai";
import filterAsyncIterable from "./filterAsyncIterable";
import createAsyncIterable from "./createAsyncIterable";

it("should return odd numbers only", async () => {
  const myIterable = createAsyncIterable([1, 2, 3, 4, 5, 6, 7]);
  const filteredIterable = filterAsyncIterable(myIterable, x => x % 2 !== 0);

  const result = [];
  for await (const value of filteredIterable) {
    result.push(value);
  }

  expect(result).to.eql([1, 3, 5, 7]);
});
