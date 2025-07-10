import { Container, type ServiceIdentifier } from "inversify";
import { container } from "../index";
import type { Constructor, ModuleOptions, ModuleProvider } from "../types";
import {
  bindUseClass,
  bindUseFactory,
  bindUseValue,
  debugLog,
  getAllMetadata,
} from "./metadata.utils";

/**
 * Decorator to mark a class as a module, optionally configuring its providers and controllers.
 *
 * @template T - The type of the module.
 * @param options - Configuration options for the module.
 * @param options.providers - Providers to register in the module's container.
 * @param options.controllers - Controllers to register in the module's container.
 * @param options.exports - Tokens to export from the module's container.
 * @param options.debug - Enables debugging logs if set to true.
 * @param options.restrictExports - If true, restricts export of controllers and providers to only the tokens specified in options.exports.
 *
 * @throws {Error} If duplicate providers or controllers are found.
 *
 * To use the module, you must call the `initModule` function on an instance of this class.
 *
 * @example
 * ```ts
 * \@Module({ providers: [MyService], controllers: [MyController] })
 * class MyModule {}
 *
 * await initModule(MyModule);
 * ```
 *
 * **Note**: This decorator should be applied to a class that has been decorated with the `Injectable` decorator.
 * **P.S.** The `Injectable` decorator is automatically applied when using the `Module` decorator.
 */
export function Module<T>(options: ModuleOptions = {}) {
  return (constructor: Constructor<T>): void => {
    validateOptions(options);

    Reflect.defineMetadata("moduleOptions", options, constructor);

    debugLog(options.debug, `Module ${constructor.name} defined`);
  };
}

function validateOptions(options: ModuleOptions): void {
  const seenTokens = new Set<ServiceIdentifier>();
  const checkDuplicates = (items: ModuleProvider[] | undefined, type: string) => {
    items?.forEach((item) => {
      const token = typeof item === "function" ? getAllMetadata(item)?.token || item : item.provide;

      if (seenTokens.has(token)) throw new Error(`Duplicate ${type}: ${String(token)}`);

      seenTokens.add(token);
    });
  };

  checkDuplicates(options.providers, "provider");
  checkDuplicates(options.controllers, "controller");
}

export async function initModule<T>(constructor: Constructor<T>): Promise<void> {
  const options: ModuleOptions | undefined = Reflect.getMetadata("moduleOptions", constructor);

  if (!options) throw new Error(`Module options not found for ${constructor.name}`);

  const moduleContainer = new Container();
  const errors: Error[] = [];

  const registerItems = async (items?: ModuleProvider[]) => {
    if (!items) return;

    await Promise.all(
      items.map((provider) =>
        register(provider, Boolean(options.debug), moduleContainer).catch((e) => {
          errors.push(e as Error);
        })
      )
    );
  };

  await Promise.all([
    registerItems(options.imports),
    registerItems(options.providers),
    registerItems(options.controllers),
  ]);

  if (options.exports) {
    options.exports.forEach((token) => {
      if (!moduleContainer.isBound(token))
        errors.push(new Error(`Export ${String(token)} not registered`));

      if (!options.restrictExports) {
        const instance = moduleContainer.get(token);
        container.bind(token).toConstantValue(instance);
      }
    });
  }

  Reflect.defineMetadata("moduleContainer", moduleContainer, constructor);
  if (options.debug) console.debug(`Module ${constructor.name} initialized`);
  if (errors.length > 0)
    throw new AggregateError(errors, `Module ${constructor.name} initialization failed`);
}

// Реєстрація одного провайдера
async function register(
  provider: ModuleProvider,
  debug: boolean,
  moduleContainer: Container
): Promise<void> {
  try {
    // Constructor handling (of a class, possibly with @Service)
    if (typeof provider === "function") {
      const metadata = getAllMetadata(provider);

      // check if global metadata
      if (metadata?.globals) return;

      bindUseClass(moduleContainer, {
        token: metadata?.token || provider,
        debug,
        useClass: provider,
        scope: metadata?.scope,
      });

      return;
    }

    const token = provider.provide;

    // Re-registration check
    if (moduleContainer.isBound(token))
      return debugLog(debug, `Already registered: ${String(token)}`);

    // Registration depending on the type of provider
    if ("useClass" in provider)
      bindUseClass(moduleContainer, {
        scope: provider.scope,
        token,
        useClass: provider.useClass,
        debug,
      });
    else if ("useValue" in provider)
      bindUseValue(moduleContainer, {
        token,
        useValue: provider.useValue,
        debug,
      });
    else if ("useFactory" in provider)
      await bindUseFactory(moduleContainer, {
        scope: provider.scope,
        token,
        useFactory: provider.useFactory,
        debug,
      });
  } catch (e) {
    console.error(
      `Registration failed: ${String("provide" in provider ? provider.provide : provider)}`,
      e
    );

    if (debug) throw e;
  }
}
