import get from "lodash.get";
import { gql } from "apollo-boost";
import apolloClient from "../apollo-client";

const RECORDS_TO_FETCH_DEFAULT = 100;

const LATEST_RELEASES_QUERY = gql`
  query LatestReleases($owner: String!, $repository: String!, $count: Int!) {
    repository(owner: $owner, name: $repository) {
      releases(first: $count, orderBy: { field: CREATED_AT, direction: DESC }) {
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

const parseRepositoryUrl = repositoryUrl => {
  const [owner, repository] = repositoryUrl.split("/");
  return { owner, repository };
};

const fetchReleases = async ({
  owner,
  repository,
  count = RECORDS_TO_FETCH_DEFAULT
} = {}) => {
  try {
    const { data } = await apolloClient.query({
      query: LATEST_RELEASES_QUERY,
      variables: { owner, repository, count },
      fetchPolicy: "cache-first"
    });
    return {
      releases: getReleases(data),
      totalReleases: getTotalCount(data)
    };
  } catch (err) {
    err.message = `FetchError: ${err.message}`;
    throw err;
  }
};

export default async function* fetchGithubRelease(
  repositoryUrl,
  { count } = {}
) {
  try {
    const { owner, repository } = parseRepositoryUrl(repositoryUrl);
    let { releases, totalReleases } = await fetchReleases({
      owner,
      repository,
      count
    });
    let i = 0;
    let totalReleasesIndex = 0;

    while (totalReleasesIndex < totalReleases) {
      if (releases[i] === undefined) {
        ({ releases, totalReleases } = await fetchReleases({
          owner,
          repository,
          count
        }));

        i = 0;
      }

      totalReleasesIndex++;
      yield releases[i++];
    }
  } catch (err) {
    throw err;
  }
}
