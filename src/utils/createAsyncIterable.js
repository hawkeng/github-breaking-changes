export default function createAsyncIterable(iterableValues) {
  const asyncGenerator = async function*() {
    for (const value of iterableValues) {
      yield Promise.resolve(value);
    }
  };
  return asyncGenerator();
}
