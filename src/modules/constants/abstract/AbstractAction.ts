import type { IAbstractAction } from "@type";

export abstract class AbstractAction<T> implements IAbstractAction {
  /**
   * Creates a new action with the given name.
   * @param name - The name of the action (command or event).
   */
  constructor(public readonly name: T) { }

  /**
   * Executes the action with the given arguments.
   * @param args - The arguments to pass to the action.
   * @returns The result of the action.
   * @example
   * ```ts
   * class MyCommand extends AbstractAction<[string, string], string> {
   *   execute(arg1: string, arg2: string): string {
   *     return `${arg1} ${arg2}`;
   *   }
   * }
   * const command = new MyCommand("myCommand");
   * console.log(command.execute("hello", "world")); // "hello world"
   * ```
   */
  public abstract execute(...args: unknown[]): unknown | Promise<unknown>;
}
