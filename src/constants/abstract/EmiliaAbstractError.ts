import type { Enums } from "@constants";

export abstract class EmiliaAbstractError extends Error {
  /**
   * Type of error
   * @type {string | undefined}
   * @default "Error"
   */
  protected errorType?: string = "Error";
  /**
   * Errorcode 'ErrorCode' Errorcode Error Code.
   */
  protected code: Enums.ErrorCode;
  /**
   * Constructor for EmiliaAbstractError class
   * @param {string} message - Text of error
   * @param {() => string} [getTime] - Function for getting current time
   * @example
   * const error = new EmiliaAbstractError("Something went wrong", () => "2022-09-07 12:00:00");
   * console.log(error.name);
   * // [2022-09-07 12:00:00][Emilia | Error]
   */
  constructor(message: string, code: Enums.ErrorCode, getTime: () => string) {
    super(message);

    if (!this.errorType) this.errorType = "Error";

    this.code = code;
    this.name = `[${getTime ? `${getTime()}][` : ""}Emilia | ${this.errorType}]`;
  }
}
