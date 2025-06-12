import type { Container } from "../core/container";
import type { Scope } from "../core/scope";

export type InjectionToken<T> = string | symbol | Constructor<T>;
/**
 * Represents a class constructor
 */
export type Constructor<T = unknown, Args extends any[] = any[]> = new (...args: Args) => T;

/**
 * Represents the arguments of a class constructor
 */
export type ConstructorArgs<T extends Constructor> = T extends Constructor<T, infer P> ? P : never;

export interface Provider<T> {
  provide: InjectionToken<T>;
  useClass?: Constructor<T>;
  useFactory?: (context: ResolutionContext) => T;
  useAsyncFactory?: (context: ResolutionContext) => Promise<T>;
  useValue?: T;
  useProvider?: CustomProvider<T>;
  scope?: Scope | CustomScope;
  tags?: Record<string | symbol, unknown>;
  isPrimary?: boolean;
  isMulti?: boolean;
  isAutoBind?: boolean;
}

export interface CustomProvider<T> {
  get(context: ResolutionContext): T | Promise<T>;
}

export interface ResolutionContext {
  container: Container;
  requestId?: string;
  traceId?: string;
  customId?: string;
  resolutionStack: Set<InjectionToken>;
  resolving?: InjectionToken<unknown>;
  metadata?: Record<string, unknown>;
  getTag<T>(token: InjectionToken<T>): unknown;
  log<T extends any[] = any[]>(message: string, ...args: T): void;
}

export interface OnInit {
  onInit(): void | Promise<void>;
}

export interface OnDestroy {
  onDestroy(): void | Promise<void>;
}

export interface Lazy<T> {
  get(): T;
  has(): boolean;
  exists(): boolean;
}

export interface ContainerConfig<T> {
  providers?: Array<{
    token: InjectionToken<T>;
    provider:
      | Provider<T>
      | {
          useAsyncFactory?: (context: ResolutionContext) => Promise<unknown>;
          useProvider?: CustomProvider<T>;
        };
  }>;
  modules?: Constructor<T>[];
}

export function forwardRef<T>(fn: () => Constructor<T>): Constructor<T>;

export interface ResolveOptions {
  name?: string;
  optional?: boolean;
  skipSelf?: boolean;
  self?: boolean;
  context?: ResolutionContext;
}

export interface ProfileMetrics {
  resolveTime: number;
  bindTime: number;
  lifecycleEvents: Record<ContainerEvent, number>;
}

export interface DependencyGraph<T> {
  nodes: { token: InjectionToken<T>; provider: Provider<T> }[];
  edges: { from: InjectionToken<T>; to: InjectionToken<T> }[];
}

export type ContainerEvent =
  | "bind"
  | "beforeResolve"
  | "afterResolve"
  | "init"
  | "activated"
  | "destroy"
  | "error";

export interface Plugin {
  initialize(container: Container): void | Promise<void>;
  destroy?(container: Container): void | Promise<void>;
}

export interface InterceptorContext {
  method: string;
  args: unknown[];
  instance: unknown;
  proceed(): unknown;
}

export interface CustomScope {
  resolve<T>(provider: Provider<T>, context: ResolutionContext): T;
  release<T>(instance: T): void;
}

declare const disposeSymbol: unique symbol;

export interface Disposable {
  [disposeSymbol](): void | Promise<void>;
}

export interface Scoped {
  dispose?(): void | Promise<void>;
}

export interface InjectOptions {
  optional?: boolean;
  lazy?: boolean;
  name?: string;
  tag?: string;
  self?: boolean;
  skipSelf?: boolean;
}

export type LifecycleHook = "onInit" | "onDestroy" | "activated";

export interface ModuleDescriptor {
  providers?: Provider<any>[];
  imports?: Constructor<any>[];
  exports?: InjectionToken<any>[];
}

export interface ContainerEventContext<T> {
  token: InjectionToken<T>;
  instance?: T;
  error?: Error;
  scope?: Scope;
}
