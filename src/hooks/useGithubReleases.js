import { useEffect, useState, useRef, useCallback } from "react";
import getGithubReleasesBetween from "../api/getGithubReleasesBetween";
import paginatedAsyncIterable from "../utils/paginatedAsyncIterable";

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
const useGithubReleases = ({
  repository,
  between,
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

  useEffect(() => {
    async function getData() {
      try {
        const releaseIterator = getGithubReleasesBetween({
          repository,
          ...between
        });
        const releases = await paginatedAsyncIterable({
          iterable: releaseIterator,
          page,
          pageSize
        });
        setStateIfMounted({ releases, loading: false, error: null });
      } catch (err) {
        setStateIfMounted({ releases: [], loading: false, error: err });
      }
    }

    getData();
  }, [repository, between, page, pageSize]);

  return state;
};

export default useGithubReleases;
