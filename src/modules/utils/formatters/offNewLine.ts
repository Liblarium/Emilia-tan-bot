/**
 * Remove newline from text
 * @param {string} text - text to remove newline from
 * @returns {string} - text without newline
 */
export const offNewLine = (text: string): string => {
  const newLinePattern = /\r?\n$/;
  const line = text.toString();

  if (line.endsWith("\n") || newLinePattern.test(line))
    return line.slice(0, -2);

  return line;
};