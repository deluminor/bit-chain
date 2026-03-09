export const QueryOptimizer = {
  debounce: <T extends (...args: unknown[]) => unknown>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  },

  memoize: <T extends (...args: unknown[]) => unknown>(func: T): T => {
    const cache = new Map<string, ReturnType<T>>();
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args) as ReturnType<T>;
      cache.set(key, result);
      return result;
    }) as T;
  },

  paginate: <T>(items: T[], page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return {
      items: items.slice(startIndex, endIndex),
      totalPages: Math.ceil(items.length / limit),
      currentPage: page,
      totalItems: items.length,
    };
  },
};
