import get from "lodash.get";
import { gql } from "apollo-boost";
import apolloClient from "../apollo-client";
import "../typedef";

const FETCH_LIMIT_FOR_RECORDS = 100;

const LATEST_RELEASES_QUERY = gql`
  query LatestReleases(
    $owner: String!
    $repository: String!
    $count: Int!
    $cursor: String
  ) {
    repository(owner: $owner, name: $repository) {
      releases(
        first: $count
        after: $cursor
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        totalCount
        edges {
          node {
            tagName
            createdAt
            url
            description
          }
        }
      }
    }
  }
`;

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
 * @param {String} [options.count=FETCH_LIMIT_FOR_RECORDS] - Number of records
 * to fetch
 * @returns {GithubReleasesResult}
 */
export default async function fetchGithubReleases({
  repositoryUrl,
  cursor,
  count = FETCH_LIMIT_FOR_RECORDS
} = {}) {
  let [owner, repository] = repositoryUrl.split("/");
  if (!owner || !repository) {
    throw new Error(
      `Malformed repository, expected format <owner>/<repository> but received ${repositoryUrl}`
    );
  }

  try {
    const { data } = await apolloClient.query({
      query: LATEST_RELEASES_QUERY,
      variables: { owner, repository, count, cursor },
      fetchPolicy: "cache-first"
    });
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
