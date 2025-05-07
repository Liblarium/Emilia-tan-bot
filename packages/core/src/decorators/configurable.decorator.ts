import { container } from "tsyringe";
import type { Constructor } from "../types";

export function Configurable<T>(envPrefix: string, defaultValue = "UNDEFINED") {
  return (target: Constructor<T>) => {
    const envConfig: Record<string, string> = {};

    // Receive all environment variables with the required prefix
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith(envPrefix)) {
        envConfig[key.replace(`${envPrefix}_`, "")] =
          process.env[key] ?? defaultValue;
      }
    });

    Reflect.defineMetadata("configurable", envConfig, target);
    //container.register<T>(target, { useClass: target }); // Register as Module
  };
}
