import get from "lodash.get";
import "../typedef";

const DATA_SOURCE =
  "https://us-central1-github-breaking-changes-7f7d1.cloudfunctions.net/githubReleases";

const getTotalCount = data => get(data, "repository.releases.totalCount", 0);

const getReleases = data =>
  get(data, "repository.releases.edges", []).map(item => item.node);

const getCursor = data => {
  const edges = get(data, "repository.releases.edges", []);
  const lastElement = edges[edges.length - 1];
  return lastElement ? lastElement.cursor : null;
};

/**
 * @typedef GithubReleasesResult
 * @property {Release[]} data
 * @property {Number} totalRecords
 * @property {String} cursor
 */

/**
 * @param {Object} options
 * @param {String} options.repositoryUrl - In the form of <owner>/<repository>
 * @param {String} [options.cursor]
 * @param {String} [options.count] - Number of records to fetch
 * @returns {GithubReleasesResult}
 */
export default async function fetchGithubReleases({
  repositoryUrl,
  cursor,
  count
} = {}) {
  let [owner, repository] = repositoryUrl.split("/");
  if (!owner || !repository) {
    throw new Error(
      `Malformed repository, expected format <owner>/<repository> but received ${repositoryUrl}`
    );
  }

  try {
    const rawParams = {
      repository,
      owner,
      ...(count ? { count } : undefined),
      ...(cursor ? { cursor } : undefined)
    };
    const params = new URLSearchParams(rawParams);

    const response = await fetch(`${DATA_SOURCE}?${params}`);
    const { data } = await response.json();
    return {
      data: getReleases(data),
      totalRecords: getTotalCount(data),
      cursor: getCursor(data)
    };
  } catch (err) {
    err.message = `FetchError: ${err.message}`;
    throw err;
  }
}
