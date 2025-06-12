import type { Constructor, ModuleDescriptor } from "../types";

export function Module(metadata: ModuleDescriptor): ClassDecorator {
  return (target: any) => {};
}

export function lazyRef<T>(fn: () => Constructor<T>): Constructor<T> {
  return fn();
}
