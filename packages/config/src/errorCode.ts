/**
 * Enum for error codes
 * @readonly
 * @enum {string}
 */
export enum ErrorCode {
  /**
   * The file was not found.
   */
  FILE_NOT_FOUND = "FILE_NOT_FOUND",
  /**
   * The file is not writable.
   */
  FILE_NOT_WRITABLE = "FILE_NOT_WRITABLE",
  /**
   * The file is not readable.
   */
  FILE_NOT_READABLE = "FILE_NOT_READABLE",
  /**
   * The file already exists.
   */
  FILE_ALREADY_EXISTS = "FILE_ALREADY_EXISTS",
  /**
   * The data was not found.
   */
  DATA_NOT_FOUND = "DATA_NOT_FOUND",
  /**
   * The data is not a valid JSON file.
   */
  INVALID_JSON = "INVALID_JSON",
  /**
   * Failed to append data to file.
   */
  APPEND_FILE_ERROR = "APPEND_FILE_ERROR",
  /**
   * Failed to create folder.
   */
  CREATE_FOLDER_ERROR = "CREATE_FOLDER_ERROR",
  /**
   * Folder does not exist, is not writable or have other name!
   *
   * Please check the folder path and permissions.
   */
  FOLDER_INVALID = "FOLDER_INVALID",
  /**
   * Invalid path or folder name! Or you use black list extension on path.
   */
  INVALID_PATH = "INVALID_PATH",
  /**
   * Invalid parameter! Please check the parameter.
   */
  INVALID_PARAMETER = "INVALID_PARAMETER",
  /**
   * You cannot use extension who not allowed. See `Config.ALLOWED_EXTENSIONS` and `Config.FORBIDDEN_EXTENSIONS`.
   */
  FILE_FORMAT_ERROR = "FILE_FORMAT_ERROR",
  /**
   * Failed to read file.
   */
  FILE_READ_ERROR = "FILE_READ_ERROR",
  /**
   * Why you use delimiter on .json file? Use JSONWriter.writeFile method for .json files.
   */
  WRONG_DELIMITER = "WRONG_DELIMITER",
  /**
   * Your array is not valid!
   *
   * Please check the array.
   */
  INVALID_ARRAY = "INVALID_ARRAY",
  /**
   * Your array length have more or less min/max elements!
   *
   * Please check the array.
   */
  INVALID_ARRAY_LENGTH = "INVALID_ARRAY_LENGTH",
  /**
   * Invalid log type. Please use a valid log type from the LogType enum.
   */
  INVALID_LOG_TYPE = "INVALID_LOG_TYPE",
  /**
   * Failed to stringify data. Invalid or empty input!
   *
   * Please check the input data.
   */
  INVALID_OBJECT = "INVALID_OBJECT",
  /**
   * Invalid input data!
   *
   * Please check the input data.
   */
  INVALID_DATA = "INVALID_DATA",
  /**
   * Invalid input type!
   *
   * Please check the input type.
   */
  INVALID_TYPE = "INVALID_TYPE",
  /**
   * Error formatting data. Invalid or empty input!
   *
   * Please check the input data.
   */
  FORMATTING_ERROR = "FORMATTING_ERROR",
  /**
   * Error parsing JSON string! Invalid input data
   *
   * Please check the input data.
   */
  JSON_PARSE_ERROR = "JSON_PARSE_ERROR",
  /**
   * Error to missed required arguments
   *
   * Please check the arguments method/function.
   */
  ARGS_REQUIRED = "ARGS_REQUIRED",
  /**
   * Error to missed required options
   *
   * Please check the options method/function/class.
   */
  MISSING_OPTION = "MISSING_OPTION",
  /**
   * Error to missed process.env.ENV_NAME
   *
   * Please check .env file.
   */
  ENV_REQUIRED = "ENV_REQUIRED",
  /**
   * Error to missed client (is null).
   *
   * Please check the client.
   */
  CLIENT_NOT_FOUND = "CLIENT_NOT_FOUND",
  /**
   * Error to missed guild (is null).
   *
   * Please check the guild id. Or fetch it.
   */
  GUILD_NOT_FOUND = "GUILD_NOT_FOUND",
  /**
   * Error to missed channel (is null).
   *
   * Please check the channel id. Or fetch it.
   */
  CHANNEL_NOT_FOUND = "CHANNEL_NOT_FOUND",
  /**
   * Error to missed message (is null).
   *
   * Please check the message id. Or fetch it.
   */
  MESSAGE_NOT_FOUND = "MESSAGE_NOT_FOUND",
  /**
   * Missing dependencies.
   *
   * Please check the dependencies.
   */
  MISSING_DEPENDENCIES = "MISSING_DEPENDENCIES",
  /**
   * Unknown error
   */
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  /**
   * It's fine, there not have error
   */
  OK = "OK",
  /**
   * Command not found
   */
  COMMAND_NOT_FOUND = "COMMAND_NOT_FOUND",
  /**
   * Max or min value is out of range
   *
   * Please check the value.
   */
  OUT_OF_RANGE = "OUT_OF_RANGE",
  /**
   * Missing interaction
   *
   * Please check the interaction.
   */
  MISSING_INTERACTION = "MISSING_INTERACTION",
  /**
   * Description or short description is too long!
   *
   * Please check the description or short description.
   */
  DESCRIPTION_TOO_LONG = "DESCRIPTION_TOO_LONG",
}
