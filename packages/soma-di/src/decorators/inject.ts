import type { InjectionToken, InterceptorContext } from "../types";

export function Inject<T>(_token: InjectionToken<T>): ParameterDecorator {
  return (target: any, _propertyKey: string | symbol | undefined, _parameterIndex: number) =>
    target;
}
export function Optional(): ParameterDecorator {
  return (target: any, _propertyKey: string | symbol | undefined, _parameterIndex: number) =>
    target;
}
export function Lazy(): ParameterDecorator {
  return (target: any, _propertyKey: string | symbol | undefined, _parameterIndex: number) =>
    target;
}
export function SkipSelf(): ParameterDecorator {
  return (target: any, _propertyKey: string | symbol | undefined, _parameterIndex: number) =>
    target;
}
export function Self(): ParameterDecorator {
  return (target: any, _propertyKey: string | symbol | undefined, _parameterIndex: number) =>
    target;
}
export function Tag(_tag: string | symbol, _value?: unknown): ParameterDecorator {
  return (target: any, _propertyKey: string | symbol | undefined, _parameterIndex: number) =>
    target;
}
export function Named(_name: string): ParameterDecorator {
  return (target: any, _propertyKey: string | symbol | undefined, _parameterIndex: number) =>
    target;
}
export function Before(
  _method: string,
  _handler: (...args: unknown[]) => unknown
): MethodDecorator {
  return (..._args: any[]) => {
    return {} as any;
  };
}
export function After(_method: string, _handler: (...args: unknown[]) => unknown): MethodDecorator {
  return (..._args: any[]) => {
    return {} as any;
  };
}
export function Intercept(_interceptor: (context: InterceptorContext) => unknown): MethodDecorator {
  return (..._args: any[]) => {
    return {} as any;
  };
}
// export function InterceptAsync(
//   interceptor: (context: InterceptorContext) => Promise<any>
// ): MethodDecorator;
// export function On(event: string, handler: (...args: any[]) => any): MethodDecorator;
// export function OnAsync(event: string, handler: (...args: any[]) => Promise<any>): MethodDecorator;
