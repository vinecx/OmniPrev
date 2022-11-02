export function groupBy<K, V>(array: V[], grouper: (item: V) => K) {
  return array.reduce((store, item) => {
    const key = grouper(item);
    if (!store.has(key)) {
      store.set(key, [item]);
    } else {
      store.get(key)?.push(item);
    }
    return store;
  }, new Map<K, V[]>());
}

export function groupByAndMap<T, K, R>(
  array: T[],
  grouper: (x: T) => K,
  mapper: (x: T[]) => R,
) {
  const groups = groupBy(array, grouper);
  return transformMap(groups, value => mapper(value));
}

export function transformMap<K, V, R>(
  source: Map<K, V>,
  transformer: (value: V, key: K) => R,
) {
  return new Map(Array.from(source, v => [v[0], transformer(v[1], v[0])]));
}

export function mapToArray<K, V, R>(
  m: Map<K, V>,
  transformer: (key: K, item: V) => R,
) {
  return Array.from(m.entries()).map(x => transformer(x[0], x[1]));
}
