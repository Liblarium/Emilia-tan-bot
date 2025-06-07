import type { Container } from "inversify";
import type {
  BindUseClass,
  BindUseFactory,
  BindUseValue,
  CommandOptions,
  Constructor,
  EventOptions,
  InjectableOptions,
} from "../types";
import { getCommandMetadata } from "./command.decorator";
import { getEventMetadata } from "./event.decorator";
import { getInjectableMetadata } from "./injectable.decorator";

export function getAllMetadata<T>(
  target: Constructor<T>
): InjectableOptions<T> | CommandOptions<T> | EventOptions<T> | undefined {
  return getInjectableMetadata(target) || getCommandMetadata(target) || getEventMetadata(target);
}

/**
 * Prints debug message to console if debug flag is set.
 * @param debug Debug flag
 * @param args Debug message
 */
export function debugLog(debug?: boolean, ...args: unknown[]) {
  if (debug) console.debug(...args);
}

/**
 * Binds a factory to a token within the container, allowing it to be injected globally.
 *
 * @template T - The type of the value to bind.
 * @param {Container} container - The container to bind to.
 * @param {Object} param - The parameters for binding.
 * @param {ServiceIdentifier<T>} param.token - The token to associate with the value.
 * @param {(container: Container) => T | Promise<T>} param.useFactory - The factory to bind to the token.
 * @param {ModuleScope} [pa
  ram.scope] - The scop
 e of the binding, either 'transient' or 'singleton'.

 * @param {boolean} [param.debug] - If true, enables debug logging.
 *
 * @throws Will throw an error if no factory is provided for the binding.
 *
 * This function registers the specified factory in the container, associating it
 * with the given token. The binding can either be scoped as transient or singleton,
 * depending on the provided parameters.
 */
export async function bindUseFactory<T>(
  container: Container,
  { scope, token, useFactory, debug }: BindUseFactory<T>
) {
  if (container.isBound(token)) return debugLog(debug, `Token ${String(token)} is already bound`);

  if (scope === "transient") {
    container.bind<T>(token).toDynamicValue(() => {
      const result = useFactory(container);

      if (result instanceof Promise)
        throw new Error(`Transient scope does not support async factories for ${String(token)}`);

      return result;
    });

    return debugLog(debug, `Registered injectable factory: ${String(token)} as transient`);
  }

  const result = await useFactory(container);
  container.bind<T>(token).toConstantValue(result);

  debugLog(debug, `Registered injectable factory: ${String(token)} as singleton`);
}

/**
 * Binds a value to a token within the container, allowing it to be injected globally.
 *
 * @template T - The type of the value to bind.
 * @param {Container} container - The container to bind to.
 * @param {Object} param - The parameters for binding.
 * @param {ServiceIdentifier<T>} param.token - The token to associate with the value.
 * @param {T} param.useValue - The value to bind to the token.
 * @param {boolean} [param.debug] - If true, enables debug logging.
 *
 * @throws Will throw an error if no value is provided for the binding.
 *
 * This function registers the specified value in the container, associating it
 * with the given token. The binding is always scoped as singleton.
 */
export function bindUseValue<T>(container: Container, { token, useValue, debug }: BindUseValue<T>) {
  if (container.isBound(token)) return debugLog(debug, `Token ${String(token)} is already bound`);

  container.bind<T>(token).toConstantValue(useValue);

  debugLog(debug, `Registered global injectable value: ${String(token)}`);
}

/**
 * Binds a class to a token within the container, allowing it to be injected globally.
 *
 * @template T - The type of the class to bind.
 * @param {Container} container - The container to bind to.
 * @param {Object} param - The parameters for binding.
 * @param {ServiceIdentifier<T>} param.token - The token to associate with the class.
 * @param {Constructor<T>} param.useClass - The class to bind to the token.
 * @param {ModuleScope} [param.scope] - The scope of the binding, either 'transient' or 'singleton'.
 * @param {boolean} [param.debug] - If true, enables debug logging.
 *
 * @throws Will throw an error if no class is provided for the binding.
 *
 * This function registers the specified class in the container, associating it
 * with the given token. The binding can either be scoped as transient or singleton,
 * depending on the provided parameters.
 *
 * **Note:** When the scope is `singleton` and the factory returns a `Promise`,
 * the binding is resolved asynchronously. The service instance may not be immediately
 * available in the container until the `Promise` resolves.
 */
export function bindUseClass<T>(
  container: Container,
  { token, useClass, scope, debug }: BindUseClass<T>
) {
  if (!useClass) throw new Error(`No class provided for global injectable: ${String(token)}`);

  if (container.isBound(token)) return debugLog(debug, `Token ${String(token)} is already bound`);

  const binding = container.bind<T>(token).to(useClass);

  if (scope === "transient") binding.inTransientScope();
  else binding.inSingletonScope();

  debugLog(debug, `Registered global injectable class: ${String(token)}`, {
    scope: scope || "singleton",
  });
}
