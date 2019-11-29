import { expect } from "chai";
import sinon from "sinon";
import * as asyncPaginatedResourceModule from "../utils/asyncPaginatedResource";
import getGithubReleasesBetween from "./getGithubReleasesBetween";

function stubAsyncGenerator(generatorModule, iteratorValues) {
  return sinon.stub(generatorModule, "default").returns({
    [Symbol.asyncIterator]() {
      return {
        i: 0,
        next() {
          if (this.i < iteratorValues.length) {
            return Promise.resolve({
              value: iteratorValues[this.i++],
              done: false
            });
          }
          return Promise.resolve({ done: true });
        }
      };
    }
  });
}

describe("getGithubReleasesBetween", () => {
  const mockReleases = [
    { tagName: "v3.0.0" },
    { tagName: "v2.9.0" },
    { tagName: "v2.8.0" },
    { tagName: "v2.7.0" }
  ];

  beforeEach(() => {
    asyncPaginatedResourceModule.default.restore &&
      asyncPaginatedResourceModule.default.restore();
  });

  it("should yield releases in range", async () => {
    stubAsyncGenerator(asyncPaginatedResourceModule, mockReleases);

    const releaseIterator = getGithubReleasesBetween({
      majorVersion: "v2.9.0",
      minorVersion: "v2.8.0",
      repository: "octocat/Hello-World"
    });
    const releasesInRange = [];
    for await (const release of releaseIterator) {
      releasesInRange.push(release);
    }

    expect(releasesInRange).to.eql([
      { tagName: "v2.9.0" },
      { tagName: "v2.8.0" }
    ]);
    expect(asyncPaginatedResourceModule.default.calledOnce).to.be.true;
  });

  it("should yield releases using latest major version", async () => {
    stubAsyncGenerator(asyncPaginatedResourceModule, mockReleases);

    const releaseIterator = getGithubReleasesBetween({
      minorVersion: "v2.8.0",
      repository: "octocat/Hello-World"
    });
    const releasesInRange = [];
    for await (const release of releaseIterator) {
      releasesInRange.push(release);
    }

    expect(releasesInRange).to.eql([
      { tagName: "v3.0.0" },
      { tagName: "v2.9.0" },
      { tagName: "v2.8.0" }
    ]);
    expect(asyncPaginatedResourceModule.default.calledOnce).to.be.true;
  });

  it("should yield releases using oldest minor version", async () => {
    stubAsyncGenerator(asyncPaginatedResourceModule, mockReleases);

    const releaseIterator = getGithubReleasesBetween({
      majorVersion: "v2.8.0",
      repository: "hawkeng/flash-dictionary"
    });
    const releasesInRange = [];
    for await (const release of releaseIterator) {
      releasesInRange.push(release);
    }

    expect(releasesInRange).to.eql([
      { tagName: "v2.8.0" },
      { tagName: "v2.7.0" }
    ]);
    expect(asyncPaginatedResourceModule.default.calledOnce).to.be.true;
  });

  it("should yield all releases", async () => {
    stubAsyncGenerator(asyncPaginatedResourceModule, mockReleases);

    const releaseIterator = getGithubReleasesBetween({
      repository: "hawkeng/b-forums"
    });
    const releasesInRange = [];
    for await (const releases of releaseIterator) {
      releasesInRange.push(releases);
    }

    expect(releasesInRange).to.eql(mockReleases);
    expect(asyncPaginatedResourceModule.default.calledOnce).to.be.true;
  });

  // TODO: Implement test case
  // it("should throw on invalid repository url");
});
