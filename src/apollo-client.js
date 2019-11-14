import ApolloClient from "apollo-boost";

const githubAccessToken = process.env.REACT_APP_GITHUB_ACCESS_TOKEN;

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    Authorization: `token ${githubAccessToken}`
  }
});

export default client;
