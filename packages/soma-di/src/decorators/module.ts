import type { Constructor, ModuleDescriptor } from "../types";

export function Module(_metadata: ModuleDescriptor): ClassDecorator {
  return (_target: any) => {};
}

export function lazyRef<T>(fn: () => Constructor<T>): Constructor<T> {
  return fn();
}
