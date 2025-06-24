import type { InjectionToken, Lazy } from "../types";
import type { Container } from "./container";

export class LazyProvider<T> implements Lazy<T> {
  constructor(_token: InjectionToken<T>, _container: Container) {}
  get(): T {
    return {} as T;
  }
  has(): boolean {
    return false;
  }
  exists(): boolean {
    return false;
  }
}
