import fetchGithubRelease from "./fetchGithubRelease";

/**
 * Retrieves information of all the releases between two versions (both inclusive)
 * @param {Object} options
 * @param {String} options.repository - Repository URL. Example: octocat/Hello-World
 * @param {String} [options.majorVersion] - e.g: v12.4.8
 * @param {String} [options.minorVersion] - e.g: v10.11.9
 * @yields {Release}
 */
export default async function* getGithubReleasesBetween({
  majorVersion,
  minorVersion,
  repository
}) {
  const majorVersionLowerCase = majorVersion
    ? majorVersion.toLowerCase()
    : null;
  const minorVersionLowerCase = minorVersion
    ? minorVersion.toLowerCase()
    : null;

  const releaseIterator = fetchGithubRelease(repository);

  let majorVersionRelease;

  // TODO: Test throwing error from fetchGithubRelease

  for await (const release of releaseIterator) {
    if (!majorVersionRelease) {
      if (
        !majorVersionLowerCase ||
        release.tagName.toLowerCase() === majorVersionLowerCase
      ) {
        majorVersionRelease = release;
      } else {
        continue;
      }
    } else if (release.tagName.toLowerCase() === minorVersionLowerCase) {
      yield release;
      break;
    }

    yield release;
  }
}
