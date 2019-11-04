import fetchGithubRelease from "../../src/api/fetchGithubRelease";

it("should fetch a release", async () => {
  const gen = fetchGithubRelease("storybookjs/storybook");

  const release = await gen.next();

  console.log(release);
});
