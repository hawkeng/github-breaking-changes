import sinon from "sinon";
import { expect } from "chai";
import asyncPaginatedResource from "./asyncPaginatedResource";

it("should call resource fetcher 3 times", async () => {
  const fetchFnResults = [
    { data: [1, 2], totalRecords: 5, cursor: 2 },
    { data: [3, 4], totalRecords: 5, cursor: 4 },
    { data: [5], totalRecords: 5, cursor: 5 }
  ];
  const fetchFn = sinon
    .stub()
    .onFirstCall()
    .resolves(fetchFnResults[0])
    .onSecondCall()
    .resolves(fetchFnResults[1])
    .onThirdCall()
    .resolves(fetchFnResults[2]);

  const asyncResourceIterator = asyncPaginatedResource(fetchFn);
  const results = [];
  for await (const value of asyncResourceIterator) {
    results.push(value);
  }

  expect(results).to.eql([1, 2, 3, 4, 5]);
  expect(fetchFn.getCall(0).args[0]).to.equal(undefined);
  expect(fetchFn.getCall(1).args[0]).to.equal(2);
  expect(fetchFn.getCall(2).args[0]).to.equal(4);
});
