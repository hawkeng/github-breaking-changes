export async function* filterAsync(asyncIterator, filterFn) {
  for await (const value of asyncIterator) {
    if (filterFn(value)) {
      yield value;
    }
  }
}

export async function* mapAsync(asyncIterator, mapFn) {
  for await (const value of asyncIterator) {
    yield mapFn(value);
  }
}
