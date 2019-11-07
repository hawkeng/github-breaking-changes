/**
 * Iterates over the async iterable in a paginated manner returning only as many
 * items as requested
 * @param {Object} options
 * @param {AsyncIterable} options.iterable
 * @param {Number} options.page
 * @param {Number} options.pageSize
 */
export default async function paginatedAsyncIterable({
  iterable,
  page,
  pageSize
}) {
  const firstElementIndex = (page - 1) * pageSize;
  const lastElementIndex = page * pageSize - 1;
  const accumulated = [];
  let i = 0;
  for await (let item of iterable) {
    const iBetweenFirstAndLast =
      i >= firstElementIndex && i <= lastElementIndex;

    if (iBetweenFirstAndLast) {
      accumulated.push(item);
    } else if (i > lastElementIndex) {
      return accumulated;
    }

    i++;
  }

  return accumulated;
}
