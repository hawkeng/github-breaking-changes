import { useEffect, useState, useRef, useCallback } from "react";
import getGithubReleasesBetween from "../api/getGithubReleasesBetween";
import paginatedAsyncIterable from "../utils/paginatedAsyncIterable";
import { filterAsync, mapAsync } from "../utils/asyncIterationFunctions";
import extractBreakingChanges from "../utils/extractBreakingChanges";

/**
 * @param {Object} options
 * @param {String} options.repository
 * @param {Object} [options.between]
 * @param {String} [options.between.majorVersion]
 * @param {String} [options.between.minorVersion]
 * @param {Number} [options.page=1]
 * @param {Number} [options.pageSize=100]
 * @returns {Release[]}
 */
const useGithubReleasesWithBreakingChanges = ({
  repository,
  between = {},
  page = 1,
  pageSize = 100
}) => {
  const [state, setState] = useState({
    releases: [],
    loading: true,
    error: null
  });

  const mountRef = useRef(true);
  const setStateIfMounted = useCallback(
    newState => {
      if (mountRef.current) {
        setState(newState);
      }
    },
    [mountRef]
  );

  useEffect(() => {
    return () => (mountRef.current = null);
  }, []);

  const { minorVersion, majorVersion } = between;
  useEffect(() => {
    async function getData() {
      try {
        const releaseIterator = getGithubReleasesBetween({
          repository,
          minorVersion,
          majorVersion
        });
        const releaseWithBreakingIterator = mapAsync(
          releaseIterator,
          release => ({
            ...release,
            breakingChanges: extractBreakingChanges({
              text: release.description
            })
          })
        );
        const onlyBreakingIterator = filterAsync(
          releaseWithBreakingIterator,
          release => release.breakingChanges
        );

        const releases = await paginatedAsyncIterable({
          iterable: onlyBreakingIterator,
          page,
          pageSize
        });
        setStateIfMounted({ releases, loading: false, error: null });
      } catch (err) {
        setStateIfMounted({ releases: [], loading: false, error: err });
      }
    }

    if (repository) {
      getData();
    }
  }, [
    repository,
    minorVersion,
    majorVersion,
    page,
    pageSize,
    setStateIfMounted
  ]);

  return state;
};

export default useGithubReleasesWithBreakingChanges;
