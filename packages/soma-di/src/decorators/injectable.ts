import type { Scope } from "../core/scope";
import type { InjectionToken } from "../types";

export function Injectable(_options?: {
  scope?: Scope;
  token?: InjectionToken<unknown>;
}): ClassDecorator {
  return (target: any) => {
    return target;
  };
}

export function AutoBind(_options?: {
  scope?: Scope;
  token?: InjectionToken<unknown>;
}): ClassDecorator {
  return (_target: unknown) => {};
}
export function AutoBindFactory(_options?: {
  scope?: Scope;
  token?: InjectionToken<unknown>;
}): ClassDecorator {
  return (_target: unknown) => {};
}
export function postConstruct(): MethodDecorator {
  return (..._args: unknown[]) => {
    return {} as any;
  };
}
export function preDestroy(): MethodDecorator {
  return (..._args: unknown[]) => {
    return {} as any;
  };
}
