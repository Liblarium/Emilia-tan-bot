import type { CustomScope, InjectionToken, Provider } from "../types";
import type { Scope } from "./scope";

export class ProviderMap<T = unknown> extends Map<InjectionToken<T>, Provider<T>[]> {
  private multiProviders = new Set<InjectionToken<unknown>>();

  constructor(entries?: Iterable<[InjectionToken<T>, Provider<T>[]]>) {
    super(entries);
  }

  // Реєстрація
  register<T>(token: InjectionToken<T>, provider: Provider<T>, multi?: boolean): this {
    if (multi) this.multiProviders.add(token);
    // ... решта логіки ...
    return this;
  }
  registerWithName<T>(
    name: string,
    token: InjectionToken<T>,
    provider: Provider<T>,
    multi?: boolean
  ): this {
    return this;
  }
  registerCustomScope<T>(token: InjectionToken<T>, scope: CustomScope): this {
    return this;
  }

  private isMulti<T>(token: InjectionToken<T>): boolean {
    return this.multiProviders.has(token);
  }

  // Пошук
  getProvider(token: InjectionToken<T>): Provider<T>[] | undefined {
    const providers = super.get(token) || [];
    // Для мульти-провайдерів повертаємо масив
    return this.isMulti<T>(token) ? providers : providers.slice(0, 1);
  }

  getWithName<T>(name: string, token: InjectionToken<T>): Provider<T>[] | undefined {
    return;
  }
  getAllByScope(scope: Scope): Provider<any>[] {
    return [];
  }
  getByTag(tag: string | symbol, value: unknown): Provider<unknown>[] {
    return [];
  }
  findByCondition<T>(predicate: (provider: Provider<T>) => boolean): Provider<unknown>[] {
    return [];
  }

  // Перевірка
  hasProvider<T>(token: InjectionToken<T>): boolean {
    return false;
  }
  hasTag(tag: string | symbol, value?: unknown): boolean {
    return false;
  }
  hasName<T>(name: string, token?: InjectionToken<T>): boolean {
    return false;
  }

  // Видалення
  remove<T>(token: InjectionToken<T>): this {
    return this;
  }
  removeByScope(scope: Scope): this {
    return this;
  }
  removeByTag(tag: string | symbol, value?: unknown): this {
    return this;
  }
  removeWithName<T>(name: string, token?: InjectionToken<T>): this {
    return this;
  }

  // Утиліти
  getTokens<T>(): InjectionToken<T>[] {
    return [];
  }
  getScopes(): string[] {
    return [];
  }
  getDependencyGraph<T, R = T>(): {
    nodes: InjectionToken<T>[];
    edges: { from: InjectionToken<T>; to: InjectionToken<R> }[];
  } {
    return {
      nodes: [],
      edges: [],
    };
  }
  merge(other: ProviderMap<T>): this {
    return this;
  }
  clear(): this {
    return this;
  }
}
