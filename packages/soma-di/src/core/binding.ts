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
  private readonly config: {
    provider?: Provider<T>;
    scope?: Scope | CustomScope;
    tags: Map<string | symbol, any>;
    conditions: ((context: ResolutionContext) => boolean)[];
  } = {
    tags: new Map(),
    conditions: [],
  };

  constructor(_token: InjectionToken<T>, _container: Container) {}

  toClass(classType: Constructor<T>): this {
    const { config } = this;
    if ("provider" in config) config.provider = { useClass: classType, provide: classType };

    return this;
  }
  toFactory(_factory: (context: ResolutionContext) => T): this {
    return this;
  }
  toAsyncFactory(_factory: (context: ResolutionContext) => Promise<T>): this {
    return this;
  }
  toValue(_value: T): this {
    return this;
  }
  toProvider(_provider: CustomProvider<T>): this {
    return this;
  }

  inScope(_scope: Scope | CustomScope): this {
    return this;
  }
  withTag(_tag: string | symbol, _value: any): this {
    return this;
  }
  withName(_name: string): this {
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
  whenTargetTagged(_tag: string, _value: any): this {
    return this;
  }
  whenTargetNamed(_name: string): this {
    return this;
  }
  when(_condition: (context: ResolutionContext) => boolean): this {
    return this;
  }
}
