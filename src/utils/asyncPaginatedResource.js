/**
 * @param {Function} fetchFn - A function that accepts a cursor as a parameter
 * and returns a Promise of an object with the shape of:
 * { data, totalRecords, cursor }
 */
const asyncPaginatedResource = fetchFn => {
  async function* paginatedFetching() {
    let i = 0;
    let totalIndex = 0;
    let done = false;
    let data, totalRecords, cursor;

    while (!done) {
      let next = data ? data[i] : null;

      if (!next) {
        i = 0;
        ({ data, totalRecords, cursor } = await fetchFn(cursor));
        next = data[i];
      }

      done = totalIndex + 1 === totalRecords;

      i++;
      totalIndex++;
      yield next;
    }
  }

  return paginatedFetching();
};

export default asyncPaginatedResource;
