export abstract class AbstractAction<T extends unknown[], R> {
  /**
   * The name of the action (command or event).
   */
  public readonly name: string;

  /**
   * Creates a new action with the given name.
   * @param name - The name of the action.
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Executes the action with the given arguments.
   * @param args - The arguments to pass to the action.
   * @returns The result of the action.
   * @example
   * class MyCommand extends AbstractAction<[string, string], string> {
   *   execute(arg1: string, arg2: string): string {
   *     return `${arg1} ${arg2}`;
   *   }
   * }
   * const command = new MyCommand("myCommand");
   * console.log(command.execute("hello", "world")); // "hello world"
   */
  public abstract execute(...args: T): R;
}