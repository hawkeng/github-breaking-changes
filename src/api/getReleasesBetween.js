import fetchGithubRelease from "./fetchGithubRelease";

/**
 * Retrieves information of all the releases between two versions (both inclusive)
 * @param {Object} options
 * @param {String} options.majorVersion - e.g: v12.4.8
 * @param {String} options.minorVersion - e.g: v10.11.9
 *
 */
async function* getReleasesBetween({
  majorVersion,
  minorVersion,
  repositoryUrl
}) {
  const releaseIterator = fetchGithubRelease(repositoryUrl);
  for await (const release of releaseIterator) {
    // TODO: Keep track if we already got the major and minor version
  }
}
