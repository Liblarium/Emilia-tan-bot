import type { ArrayNotEmpty } from "@type";
import type { LogOptions } from "@type/log";

export interface LogCallerErrorLogicArgs {
  target: ClassWithLogCategories;
  propertyKey: string | symbol;
  error: any;
}

export type ClassWithLogCategories = { logCategories: ArrayNotEmpty<string> };

/**
 * Options for the `@logCaller` decorator.
 */
export interface LogCallerOptions {
  /**
   * Whether to log the arguments that were passed to the method.
   * @default false
   */
  viewArgs?: boolean;
  /**
   * Whether to log the success of the method call.
   * @default false
   */
  logSuccess?: boolean;
  /**
   * Additional categories to write to the log. Added to other categories on Log categories
   * @default []
   */
  categories?: Array<string>;
}
