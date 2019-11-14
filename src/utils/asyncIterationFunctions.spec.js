import { expect } from "chai";
import { filterAsync, mapAsync } from "./asyncIterationFunctions";
import createAsyncIterable from "./createAsyncIterable";

it("should filter odd numbers only", async () => {
  const myIterable = createAsyncIterable([1, 2, 3, 4, 5, 6, 7]);
  const filteredIterable = filterAsync(myIterable, x => x % 2 !== 0);

  const result = [];
  for await (const value of filteredIterable) {
    result.push(value);
  }

  expect(result).to.eql([1, 3, 5, 7]);
});

it("should map to square", async () => {
  const myIterable = createAsyncIterable([1, 2, 3]);
  const mappedIterable = mapAsync(myIterable, x => x * x);

  const result = [];
  for await (const value of mappedIterable) {
    result.push(value);
  }

  expect(result).to.eql([1, 4, 9]);
});
