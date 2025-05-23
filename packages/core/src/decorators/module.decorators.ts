import { type InjectionToken, container } from "tsyringe";
import type { Constructor } from "../types";

export interface ModuleOptions {
  imports?: InjectionToken<unknown>[];
  services?: {
    service: {
      token?: InjectionToken<unknown>;
      provider: Constructor<unknown>;
    };
    scope?: "singleton" | "transient";
  }[];
  debug?: boolean;
}

export function Module(options: ModuleOptions) {
  return (target: Constructor<unknown>) => {
    options.imports?.forEach((module) => {
      try {
        if (!container.isRegistered(module)) {
          container.registerSingleton(module);
          if (options.debug)
            console.debug(`Зарегистрирован модуль: ${module.toString()}`);
        }
        container.resolve(module);
      } catch (e) {
        console.error(`Не удалось разрешить модуль: ${module.toString()}`, e);
        throw new Error(`Не удалось разрешить модуль: ${module.toString()}`);
      }
    });

    options.services?.forEach(({ service, scope }) => {
      const serviceToken = service.token ?? service.provider;
      try {
        if (scope === "transient") {
          container.register(serviceToken, { useClass: service.provider });
        } else {
          container.registerSingleton(serviceToken, service.provider);
        }
        if (options.debug)
          console.debug(`Зарегистрирован сервис: ${serviceToken.toString()}`);
      } catch (e) {
        console.error(
          `Не удалось зарегистрировать сервис: ${serviceToken.toString()}`,
          e
        );
        throw new Error(
          `Не удалось зарегистрировать сервис: ${serviceToken.toString()}`
        );
      }
    });

    container.registerSingleton(target);
  };
}

// import { type InjectionToken, container } from "tsyringe";
// import type { Constructor } from "../types";

// /**
//  * Decorator for modules. A module is a class that exports a set of services,
//  * which can be injected into other components. The module itself is a
//  * singleton, meaning that only one instance of it will be created by the
//  * container.
//  *
//  * @param {Object} options - An object with the following properties:
//  *   - {Array<InjectionToken<unknown>>} imports (optional): An array of
//  *     module tokens to import. The services exported by these modules
//  *     will be available to the services of the current module.
//  *   - {Array<{ service: Constructor<unknown>, scope?: "singleton" | "transient" }>} services (optional): An
//  *     array of service classes to register. The services will be registered
//  *     as singletons in the container.
//  *
//  * @example
//  * ```ts
//  * \@Module({
//  *   imports: [MyModule],
//  *   services: [{ service: MyService, scope: "transient" }],
//  * })
//  * class MyModule {}
//  * ```
//  */
// export function Module<T extends Constructor<T>>(options: ModuleOptions) {
//   return (target: Constructor<T>) => {
//     options.imports?.forEach((module) => {
//       try {
//         container.resolve(module);

//         debugOn(options.debug, `Module resolved: ${module.toString()}`);
//       } catch (e) {
//         console.error(`Failed to resolve module: ${module.toString()}`, e);
//       }
//     });

//     options.services?.forEach(({ service, scope }) => {
//       const serviceToken = service.token ?? service.provider;
//       try {
//         if (scope === "transient")
//           container.register(serviceToken, {
//             useClass: service.provider,
//           });
//         else container.registerSingleton(serviceToken, service.provider);

//         debugOn(
//           options.debug,
//           `Registering service: (token: ${serviceToken.toString()}, provider: ${service.provider.toString()})`
//         );
//       } catch (e) {
//         console.error(
//           `Failed to register service: (token: ${serviceToken.toString()}, provider: ${service.provider.toString()})`,
//           e
//         );
//       }
//     });

//     container.registerSingleton(target);
//   };
// }

// function debugOn(is: boolean | undefined, message: string) {
//   if (is) console.log(message);
// }

// /**
//  * Type for the options object passed to the Module decorator
//  */
// type ModuleServices = {
//   /**
//    * The service class to register
//    */
//   service: ServiceRegistration;
//   /**
//    * The scope of the service
//    *
//    * - "singleton": The service will be registered as a singleton in the container
//    * - "transient": The service will be registered as a transient in the container
//    *
//    * @default "singleton"
//    */
//   scope?: "singleton" | "transient";
// };

// /**
//  * Type for the service registration
//  */
// type ServiceRegistration = {
//   /**
//    * The token representing the service
//    *
//    * If not provided, decorator use provider class as token
//    */
//   token?: InjectionToken<string>;
//   /**
//    * The service class
//    */
//   provider: Constructor<unknown>;
// };

// /**
//  * Type for the options object passed to the Module decorator
//  */
// type ModuleOptions = {
//   /**
//    * The modules to import
//    */
//   imports?: InjectionToken<unknown>[];
//   /**
//    * The services to register
//    *
//    * Each service is an object with the following properties:
//    * - {Constructor<unknown>} service: The service class to register
//    * - {"singleton" | "transient"} scope (optional): The scope of the service
//    */
//   services?: ModuleServices[];
//   /**
//    * Enable debug mode
//    *
//    * If true, the decorator will print logs (only) to the console
//    *
//    * @default false
//    */
//   debug?: boolean;
// };
