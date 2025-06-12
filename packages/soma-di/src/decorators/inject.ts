import type { InjectionToken, InterceptorContext } from "../types";

export function Inject<T>(token: InjectionToken<T>): ParameterDecorator {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => target;
}
export function Optional(): ParameterDecorator {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => target;
}
export function Lazy(): ParameterDecorator {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => target;
}
export function SkipSelf(): ParameterDecorator {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => target;
}
export function Self(): ParameterDecorator {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => target;
}
function Tag(tag: string | symbol, value?: unknown): ParameterDecorator {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => target;
}
export function Named(name: string): ParameterDecorator {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => target;
}
export function Before(method: string, handler: (...args: unknown[]) => unknown): MethodDecorator {
  return (...args: any[]) => {
    return {} as any;
  };
}
export function After(method: string, handler: (...args: unknown[]) => unknown): MethodDecorator {
  return (...args: any[]) => {
    return {} as any;
  };
}
export function Intercept(interceptor: (context: InterceptorContext) => unknown): MethodDecorator {
  return (...args: any[]) => {
    return {} as any;
  };
}
// export function InterceptAsync(
//   interceptor: (context: InterceptorContext) => Promise<any>
// ): MethodDecorator;
// export function On(event: string, handler: (...args: any[]) => any): MethodDecorator;
// export function OnAsync(event: string, handler: (...args: any[]) => Promise<any>): MethodDecorator;
