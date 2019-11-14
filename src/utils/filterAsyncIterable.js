export default async function* filterAsyncIterable(asyncIterable, filterFn) {
  for await (const value of asyncIterable) {
    if (filterFn(value)) {
      yield value;
    }
  }
}
