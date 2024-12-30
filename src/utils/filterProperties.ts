export default function filterProperties<T>(data: T, filter: string[]): T extends Array<infer U> ? Array<U> : Partial<T> {
  if (Array.isArray(data)) {
    const filtered = [...data].filter(prop => !filter.includes(prop));

    return filtered as T extends Array<infer U> ? Array<U> : never;
  } else {
    const filtered = { ...data };
    filter.forEach(prop => delete filtered[prop]);

    return filtered as T extends Array<infer U> ? never : Partial<T>;
  }
}
