export abstract class AbstractAction {
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
   * @throws {Error} - If the action is not implemented.
   * @example
   * class MyAction extends AbstractAction {
   *   execute(arg1: string, arg2: string): string {
   *     return `${arg1} ${arg2}`;
   *   }
   * }
   * 
   * const action = new MyAction("myActionName");
   * console.log(action.execute("arg", "arg3")) // "arg arg3";
   */
  public abstract execute(...args: unknown[]): unknown;
}