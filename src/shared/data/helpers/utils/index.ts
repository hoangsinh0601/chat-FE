export function isFunction(value: unknown): value is Function {
  return typeof value === 'function' && value instanceof Function;
}
