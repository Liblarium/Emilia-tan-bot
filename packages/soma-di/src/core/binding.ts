import type {
  Constructor,
  CustomProvider,
  CustomScope,
  InjectionToken,
  Provider,
  ResolutionContext,
} from "../types";
import type { Container } from "./container";
import type { Scope } from "./scope";

export class Binding<T> {
  private config: {
    provider?: Provider<T>;
    scope?: Scope | CustomScope;
    tags: Map<string | symbol, any>;
    conditions: ((context: ResolutionContext) => boolean)[];
  } = {
    tags: new Map(),
    conditions: [],
  };

  constructor(token: InjectionToken<T>, container: Container) {}

  toClass(classType: Constructor<T>): this {
    const config = this.config;
    if ("provider" in config) config.provider = { useClass: classType, provide: classType };

    return this;
  }
  toFactory(factory: (context: ResolutionContext) => T): this {
    return this;
  }
  toAsyncFactory(factory: (context: ResolutionContext) => Promise<T>): this {
    return this;
  }
  toValue(value: T): this {
    return this;
  }
  toProvider(provider: CustomProvider<T>): this {
    return this;
  }

  inScope(scope: Scope | CustomScope): this {
    return this;
  }
  withTag(tag: string | symbol, value: any): this {
    return this;
  }
  withName(name: string): this {
    return this;
  }
  asPrimary(): this {
    return this;
  }
  asMulti(): this {
    return this;
  }
  asAutoBind(): this {
    return this;
  }
  whenTargetTagged(tag: string, value: any): this {
    return this;
  }
  whenTargetNamed(name: string): this {
    return this;
  }
  when(condition: (context: ResolutionContext) => boolean): this {
    return this;
  }
}
