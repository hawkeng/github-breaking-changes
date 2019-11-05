import fetchGithubRelease from "./fetchGithubRelease";

/**
 * Retrieves information of all the releases between two versions (both inclusive)
 * @param {Object} options
 * @param {String} options.majorVersion - e.g: v12.4.8
 * @param {String} options.minorVersion - e.g: v10.11.9
 *
 */
export default async function* getReleasesBetween({
  majorVersion,
  minorVersion,
  repositoryUrl
}) {
  const releaseIterator = fetchGithubRelease(repositoryUrl);

  let majorVersionRelease;

  for await (const release of releaseIterator) {
    if (!majorVersion && !majorVersionRelease) {
      majorVersionRelease = release;
    }

    if (release.tagName.toLowerCase() === minorVersion.toLowerCase()) {
      return release;
    }

    if (
      !majorVersionRelease &&
      release.tagName.toLowerCase() !== majorVersion.toLowerCase()
    ) {
      continue;
    }

    yield release;
  }
}
