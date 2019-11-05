import sinon from "sinon";
import { expect } from "chai";
import apolloClient from "../apollo-client";
import fetchGithubRelease from "./fetchGithubRelease";

const validateRelease = release => {
  expect(release).to.be.an("object");
  expect(release.tagName).to.be.a("string");
  expect(release.createdAt).to.be.a("string");
  expect(release.url).to.be.a("string");
};

describe("fetchGithubRelease", () => {
  it("should fetch a release", async () => {
    const gen = fetchGithubRelease("storybookjs/storybook");
    const result = await gen.next();

    validateRelease(result.value);
  });

  it("should fetch releases in one call", async () => {
    sinon.stub(apolloClient, "query").resolves({
      data: {
        repository: {
          releases: { totalCount: 2, edges: [{ node: 1 }, { node: 2 }] }
        }
      }
    });
    const gen = fetchGithubRelease("octocat/Hello-World", { count: 100 });
    const result1 = await gen.next();
    const result2 = await gen.next();
    const endResult = await gen.next();

    expect(result1.value).to.equal(1);
    expect(result2.value).to.equal(2);
    expect(apolloClient.query.calledOnce).to.be.true;
    expect(endResult.value).to.be.undefined;
    expect(endResult.done).to.be.true;

    apolloClient.query.restore();
  });

  it("should fetch releases in two calls", async () => {
    const mockRelease = {
      tagName: "v3.0.0-beta",
      createdAt: "2019-11-04T20:58:41.189Z",
      url: "https://github/octocat/Hello-World/releases/v3.0.0-beta"
    };
    sinon
      .stub(apolloClient, "query")
      .onFirstCall()
      .resolves({
        data: {
          repository: {
            releases: { totalCount: 2, edges: [{ node: mockRelease }] }
          }
        }
      })
      .onSecondCall()
      .resolves({
        data: {
          repository: {
            releases: { totalCount: 2, edges: [{ node: "fakeRelease" }] }
          }
        }
      });

    const gen = fetchGithubRelease("octocat/Hello-World", { count: 1 });
    const result1 = await gen.next();
    const result2 = await gen.next();
    const endResult = await gen.next();

    expect(result1.value).to.eql(mockRelease);
    expect(apolloClient.query.callCount).to.equal(2);
    expect(apolloClient.query.getCall(0).args[0]).to.be.an("object");
    expect(apolloClient.query.getCall(0).args[0]).to.include.all.keys(
      "query",
      "variables"
    );
    expect(apolloClient.query.getCall(0).args[0].variables).to.eql({
      owner: "octocat",
      repository: "Hello-World",
      count: 1
    });
    expect(result2.value).to.equal("fakeRelease");
    expect(endResult.value).to.be.undefined;
    expect(endResult.done).to.be.true;

    apolloClient.query.restore();
  });
});
