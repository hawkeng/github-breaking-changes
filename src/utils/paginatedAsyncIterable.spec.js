import { expect } from "chai";
import paginatedAsyncIterable from "./paginatedAsyncIterable";
import createAsyncIterable from "./createAsyncIterable";

describe("paginatedAsyncIterable", () => {
  it("should resolve first 5 elements", async () => {
    const asyncIterable = createAsyncIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const result = await paginatedAsyncIterable({
      iterable: asyncIterable,
      page: 1,
      pageSize: 5
    });

    expect(result).to.eql([1, 2, 3, 4, 5]);
  });

  it("should resolve latest 4 elements", async () => {
    const asyncIterable = createAsyncIterable([1, 2, 3, 4, 5, 6, 7, 8]);

    const result = await paginatedAsyncIterable({
      iterable: asyncIterable,
      page: 2,
      pageSize: 4
    });

    expect(result).to.eql([5, 6, 7, 8]);
  });

  it("should resolve middle 2 elements", async () => {
    const asyncIterable = createAsyncIterable([1, 2, 3, 4, 5, 6]);

    const result = await paginatedAsyncIterable({
      iterable: asyncIterable,
      page: 2,
      pageSize: 2
    });

    expect(result).to.eql([3, 4]);
  });
});
