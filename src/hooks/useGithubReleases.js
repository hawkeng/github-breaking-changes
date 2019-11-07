import { useEffect, useState } from "react";
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

  // TODO: USE react-async ???

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
        setState({ releases, loading: false, error: null });
      } catch (err) {
        setState({ releases: [], loading: false, error: err });
      }
    }

    getData();
  }, [repository, between, page, pageSize]);

  return state;
};

export default useGithubReleases;
