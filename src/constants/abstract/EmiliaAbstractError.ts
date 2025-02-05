export abstract class EmiliaAbstractError extends Error {
  /**
   * Type of error
   * @type {string | undefined}
   * @default "Error"
   */
  protected errorType?: string = "Error";

  /**
   * Constructor for EmiliaAbstractError class
   * @param {string} message - Text of error
   * @param {() => string} [getTime] - Function for getting current time
   * @example
   * const error = new EmiliaAbstractError("Something went wrong", () => "2022-09-07 12:00:00");
   * console.log(error.name);
   * // [2022-09-07 12:00:00][Emilia | Error]
   */
  constructor(message: string, getTime: () => string) {
    super(message);

    if (!this.errorType) this.errorType = "Error";

    this.name = `[${getTime ? `${getTime()}][` : ""}Emilia | ${this.errorType}]`;
  }
}
