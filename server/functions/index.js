const functions = require("firebase-functions");
const { gql, default: ApolloClient } = require("apollo-boost");
const fetch = require("node-fetch");

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
          cursor
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

const githubAccessToken = functions.config().github.access_token;
const apolloClient = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    Authorization: `token ${githubAccessToken}`
  },
  fetch
});

const whitelistString = functions.config().security.allowed_origins;
const allowedOrigins = whitelistString ? whitelistString.split(",") : [];
exports.githubReleases = functions.https.onRequest(async (req, res) => {
  // TODO: Use a single origin, not a string with many
  res.set("Access-Control-Allow-Origin", getAllowedOrigin(res, allowedOrigins));

  const { owner, repository, count = 100, cursor } = req.query;
  const countInt = parseInt(count, 10);

  try {
    const result = await apolloClient.query({
      query: LATEST_RELEASES_QUERY,
      variables: { owner, repository, count: countInt, cursor },
      fetchPolicy: "cache-first"
    });

    res.json(result).end();
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message })
      .end();
  }
});

function getAllowedOrigin(res, allowedOrigins) {
  const i = allowedOrigins.indexOf(res.get("origin"));
  if (i >= 0) {
    return allowedOrigins[i];
  }
  return allowedOrigins[0];
}
