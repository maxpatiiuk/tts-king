// Record
export type R<V> = Record<string, V>;

// Immutable record
// eslint-disable-next-line @typescript-eslint/naming-convention
export type IR<V> = Readonly<Record<string, V>>;

// Generic Immutable record
// eslint-disable-next-line @typescript-eslint/naming-convention
export type RR<K extends string | number | symbol, V> = Readonly<Record<K, V>>;

// Immutable Array
// eslint-disable-next-line @typescript-eslint/naming-convention
export type RA<V> = readonly V[];

// Make sure a value is not undefined
export function safe<T>(value: T | undefined): T {
  if (typeof value === 'undefined') throw new Error('Value is not defined');
  else return value;
}

// Convert all nullable types to undefined
export const nullSafe = <T>(
  value: T | undefined | null | false | '' | typeof Number.NaN
): T | undefined => (Boolean(value) ? (value as T) : undefined);
