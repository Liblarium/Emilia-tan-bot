import "reflect-metadata";
import type {
  Constructor,
  ContainerConfig,
  ContainerEvent,
  CustomProvider,
  CustomScope,
  DependencyGraph,
  InjectionToken,
  Plugin,
  ProfileMetrics,
  Provider,
  ResolutionContext,
  ResolveOptions,
} from "../types";
import { Binding } from "./binding";
import type { ContainerMiddleware } from "./events";
import { ProviderMap } from "./providerMap";
import type { Scope } from "./scope";

export class Container {
  private readonly providers: ProviderMap = new ProviderMap();
  private readonly cache = new Map<InjectionToken<unknown>, unknown>();
  private readonly debug: boolean = false;

  constructor(parent?: Container) {}

  // Статичне створення та конфігурація
  static create(modules?: Constructor<any>[]): Container {
    const container = new Container();
    container.configure({ modules });
    return container;
  }
  configure<T>(config: ContainerConfig<T>): this {
    return this;
  }

  // Реєстрація
  bind<T>(token: InjectionToken<T>): Binding<T> {
    return new Binding(token, this);
  }
  bindClass<T>(token: InjectionToken<T>, classType: Constructor<T>): Binding<T> {
    return new Binding(token, this).toClass(classType);
  }
  bindFactory<T>(token: InjectionToken<T>, factory: (context: ResolutionContext) => T): Binding<T> {
    return new Binding(token, this).toFactory(factory);
  }
  bindValue<T>(token: InjectionToken<T>, value: T): Binding<T> {
    return new Binding(token, this).toValue(value);
  }
  bindProvider<T>(token: InjectionToken<T>, provider: CustomProvider<T>): Binding<T> {
    return new Binding(token, this).toProvider(provider);
  }
  quickBind<T>(token: InjectionToken<T>, value: T | Constructor<T> | (() => T)): this {
    return this;
  }

  // Асинхронна реєстрація
  async bindAsync<T>(
    token: InjectionToken<T>,
    provider: Promise<Provider<T>>
  ): Promise<Binding<T>> {
    return Promise.resolve(new Binding(token, this));
  }
  async bindFactoryAsync<T>(
    token: InjectionToken<T>,
    factory: (context: ResolutionContext) => Promise<T>
  ): Promise<Binding<T>> {
    return Promise.resolve(new Binding(token, this).toAsyncFactory(factory));
  }

  // Резолв
  resolve<T>(token: InjectionToken<T>, options?: ResolveOptions): T {
    /*if (context.resolutionStack.has(token)) {
      throw new CyclicDependencyError(token);
    }*/

    return {} as T;
  }
  async resolveAsync<T>(token: InjectionToken<T>, options?: ResolveOptions): Promise<T> {
    return Promise.resolve({} as T);
  }
  resolveAll<T, Opt extends boolean = false>(
    token: InjectionToken<T>,
    options?: ResolveOptions
  ): T[] {
    return [];
  }
  get<T>(type: Constructor<T>): T {
    return {} as T;
  }
  getAll<T>(type: Constructor<T>): T[] {
    return [];
  }

  // Скоупи
  setDefaultScope(scope: Scope): this {
    return this;
  }
  registerCustomScope(name: string, scope: CustomScope): this {
    return this;
  }
  createChildScope(name?: string, context?: ResolutionContext): this {
    return this;
  }
  dispose(scope?: string): Promise<void> {
    return Promise.resolve();
  }

  // Модулі
  importModule(module: Constructor<any>, async?: boolean): this {
    return this;
  }
  async importModuleAsync(module: Constructor<any>): Promise<this> {
    return Promise.resolve(this);
  }

  // Перевірка та управління
  has(token: InjectionToken<any>): boolean {
    return false;
  }
  getProvider<T>(token: InjectionToken<T>): Provider<T>[] | undefined {}
  remove(token: InjectionToken<any>): this {
    return this;
  }
  clear(): this {
    return this;
  }
  async destroy(): Promise<void> {
    return Promise.resolve();
  }

  // Теги
  addTag(token: InjectionToken<any>, tag: string | symbol, value: any): this {
    return this;
  }
  getByTag(tag: string | symbol, value: any): InjectionToken<any>[] {
    return [];
  }

  // Події, middleware, плагіни
  on(event: ContainerEvent, listener: (...args: any[]) => void): this {
    return this;
  }
  useMiddleware(middleware: ContainerMiddleware): this {
    return this;
  }
  usePlugin(plugin: Plugin): this {
    return this;
  }

  // Дебаг, профілювання, інспекція
  enableDebug(): this {
    return this;
  }
  enableStrictInject(): this {
    return this;
  }
  describe(token: InjectionToken<any>, options?: { verbose?: boolean }): Provider<any>[] {
    return [];
  }
  getBindings(): Map<InjectionToken<any>, Provider<any>[]> {
    return new Map();
  }
  getScopes(): string[] {
    return [];
  }
  debugLog(): string {
    return "";
  }
  profile(): ProfileMetrics {
    return {
      resolveTime: 0,
      bindTime: 0,
      lifecycleEvents: {
        bind: 0,
        beforeResolve: 0,
        afterResolve: 0,
        init: 0,
        activated: 0,
        destroy: 0,
        error: 0,
      },
    };
  }
  visualizeGraph<T>(): DependencyGraph<T> {
    return {
      nodes: [],
      edges: [],
    };
  }

  // Конфігурація
  configureFromJson<T>(config: ContainerConfig<T>): this {
    return this;
  }
}

// Додамо спеціальні помилки
export class CyclicDependencyError<T = any> extends Error {
  constructor(public token: InjectionToken<T>) {
    super(`Cyclic dependency detected for ${token.toString()}`);
  }
}
