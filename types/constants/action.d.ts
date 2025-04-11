export interface IAbstractAction {
  /**
   * Action (command/event) name
   */
  name: unknown;

  execute: (...args: unknown[]) => unknown | Promise<void>;
}