export function pascalCase(input: string): string {
  if (!input) return '';
  return input
    .replace(/[\s_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

export function createSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

export function uniqueMergeBy<T extends Record<string, any>, K extends keyof T = keyof T>(key: K, items: T[]): T[] {
  const dedupe = (a: any[]) => [...new Set(a)];
  return Array.from(items.flat().reduce((map, item) => {
      const id = item[key];
      const data = map.get(id);
      if (!data) {
        const copy = { ...item };
        Object.keys(copy).forEach(p => Array.isArray(copy[p]) && (copy[p] = dedupe(copy[p])));
        return map.set(id, copy);
      }
      Object.keys(item).forEach(p => {
        const incoming = item[p];
        (data as any)[p] = Array.isArray(incoming) ? dedupe([...(Array.isArray(data[p]) ? data[p] : []), ...incoming]): (data[p] ?? incoming);
      });
      return map;
    }, new Map<T[K], T>())
    .values())
}