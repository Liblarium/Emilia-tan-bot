import type { InjectionToken, Provider } from "../types";

export interface ContainerMiddleware {
  onBind?<T, P = T>(token: InjectionToken<T>, provider: Provider<P>): void;
  beforeResolve?<T>(token: InjectionToken<T>): void | Promise<void>;
  afterResolve?<T, R = unknown>(token: InjectionToken<T>, result: R): void | Promise<void>;
  onInit?<T, R = unknown>(token: InjectionToken<T>, instance: R): void | Promise<void>;
  onActivated?<T, R = unknown>(token: InjectionToken<T>, instance: R): void;
  onDestroy?<T, R = unknown>(token: InjectionToken<T>, instance: R): void | Promise<void>;
  onError?(error: Error): void;
}
