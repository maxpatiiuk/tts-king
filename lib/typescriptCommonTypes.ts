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

/*
 * Execute the function if none of the dependencies are undefined
 *
 * I tried to make this function accept an arbitrary number of arguments as a
 * Tuple and assert each tuple's element as Exclude<T, undefined>
 * (https://stackoverflow.com/a/58986589/8584605), but that
 * didn't work.
 */
export const ensure = <RETURN, A, B = undefined, C = undefined, D = undefined>(
  callback: (...arguments_: readonly [A, B, C, D]) => RETURN,
  dependencies:
    | readonly [A | undefined, B | undefined, C | undefined, D | undefined]
    | readonly [A | undefined, B | undefined, C | undefined]
    | readonly [A | undefined, B | undefined]
    | readonly [A | undefined],
  extraDependencies: RA<unknown> = []
): [(() => void) | (() => RETURN), RA<unknown>] => [
  dependencies.some((dependency) => typeof dependency === 'undefined')
    ? (): void => undefined
    : (): RETURN => callback(...(dependencies as [A, B, C, D])),
  [...dependencies, ...extraDependencies],
];
