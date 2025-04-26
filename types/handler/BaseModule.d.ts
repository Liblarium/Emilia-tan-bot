import type { AbstractAction } from "@abstract/AbstractAction";

/** Base interface for all handler modules */
export interface IBaseModule {
  /** Unique name of the module */
  name: string;
  /** Executes the module logic */
  execute(...args: unknown[]): Promise<unknown> | unknown;
}

/** Valid module type combining AbstractAction with IBaseModule */
export type ValidModule<T = unknown> = AbstractAction<T> & IBaseModule;