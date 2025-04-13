/**
 * Get time in format "HH:MM:SS"
 * @returns {string}
 */
export const time = (): string => {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  return `${hour}:${minute}:${second}`;
};

/**
 * Get time in format "HH:MM:SS:MMM"
 * @returns {string}
 */
export const logTime = (): string => {
  const date = new Date();
  const millisecond = date.getMilliseconds().toString().padStart(3, "0");
  return `${time()}:${millisecond}`;
};

/**
 * Get date in format "DD.MM.YYYY"
 * @returns {string}
 */
export const date = (): string => {
  const date = new Date();
  const data = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${data}.${month}.${year}`;
};

/**
 * Get date and time in format "[DD.MM.YYYY][HH:MM:SS]"
 * @returns {string}
 */
export const dateAndTime = (): string => `[${date()}][${logTime()}]`;