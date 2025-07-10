import type { CustomScope, InjectionToken, Provider } from "../types";
import type { Scope } from "./scope";

export class ProviderMap extends Map<InjectionToken<any>, Provider<any>[]> {
  private readonly multiProviders = new Set<InjectionToken<unknown>>();

  constructor(entries?: Iterable<[InjectionToken<any>, Provider<any>[]]>) {
    super(entries);
  }

  get<T>(token: InjectionToken<T>): Provider<T>[] {
    return super.get(token) ?? [];
  }

  getAll(): Record<string, Provider<any>[]> {
    const out: Record<string, Provider<any>[]> = {};

    for (const [token, providers] of this.entries()) out[String(token)] = providers;

    return out;
  }

  set(key: InjectionToken<any>, value: Provider<any>[]): this {
    return super.set(key, value);
  }

  addProvider<T>(token: InjectionToken<T>, provider: Provider<T>): this {
    const current = this.get<T>(token).slice();
    current.push(provider);

    return super.set(token, current);
  }

  has<T>(token: InjectionToken<T>): boolean {
    return super.has(token);
  }

  // Реєстрація
  register<T>(token: InjectionToken<T>, _provider: Provider<T>, multi?: boolean): this {
    if (multi) this.multiProviders.add(token);
    // ... решта логіки ...
    return this;
  }
  registerWithName<T>(
    _name: string,
    _token: InjectionToken<T>,
    _provider: Provider<T>,
    _multi?: boolean
  ): this {
    return this;
  }
  registerCustomScope<T>(_token: InjectionToken<T>, _scope: CustomScope): this {
    return this;
  }

  private isMulti<T>(token: InjectionToken<T>): boolean {
    return this.multiProviders.has(token);
  }

  // Пошук
  getProvider<T>(token: InjectionToken<T>): Provider<T>[] | undefined {
    const providers = super.get(token) || [];
    // Для мульти-провайдерів повертаємо масив
    return this.isMulti<T>(token) ? providers : providers.slice(0, 1);
  }

  getWithName<T>(_name: string, _token: InjectionToken<T>): Provider<T>[] | undefined {}
  getAllByScope(_scope: Scope): Provider<any>[] {
    return [];
  }
  getByTag(_tag: string | symbol, _value: unknown): Provider<unknown>[] {
    return [];
  }
  findByCondition<T>(_predicate: (provider: Provider<T>) => boolean): Provider<unknown>[] {
    return [];
  }

  // Перевірка
  hasProvider<T>(token: InjectionToken<T>, predicate?: (p: Provider<T>) => boolean): boolean {
    const all = this.get(token);
    return predicate ? all.some(predicate) : all.length > 0;
  }

  hasTag(_tag: string | symbol, _value?: unknown): boolean {
    return false;
  }
  hasName<T>(_name: string, _token?: InjectionToken<T>): boolean {
    return false;
  }

  // Видалення
  remove<T>(token: InjectionToken<T>): this {
    super.delete(token);

    return this;
  }
  removeByScope(_scope: Scope): this {
    return this;
  }
  removeByTag(_tag: string | symbol, _value?: unknown): this {
    return this;
  }
  removeWithName<T>(_name: string, _token?: InjectionToken<T>): this {
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
  merge(_other: ProviderMap): this {
    return this;
  }
  clear(): this {
    return this;
  }
}
