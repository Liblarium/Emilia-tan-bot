import type { Scope } from "../core/scope";
import type { InjectionToken } from "../types";

export function Injectable(options?: {
  scope?: Scope;
  token?: InjectionToken<unknown>;
}): ClassDecorator {
  return (target: any) => {
    return target;
  };
}

export function AutoBind(options?: {
  scope?: Scope;
  token?: InjectionToken<unknown>;
}): ClassDecorator {
  return (target: unknown) => {};
}
export function AutoBindFactory(options?: {
  scope?: Scope;
  token?: InjectionToken<unknown>;
}): ClassDecorator {
  return (target: unknown) => {};
}
export function postConstruct(): MethodDecorator {
  return (...args: unknown[]) => {
    return {} as any;
  };
}
export function preDestroy(): MethodDecorator {
  return (...args: unknown[]) => {
    return {} as any;
  };
}
