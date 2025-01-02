import type { SKRSContext2D } from "@napi-rs/canvas";

/**
* @description
* Splits a given text string into multiple lines, while accounting for a given maximum
* number of characters and lines. The text is also adjusted to fit within a given maximum
* width of the canvas.
* @param {WrapTextOptions | WrapTextCanvasOptions} options - options for splitting the text
* @returns {WrapTextResult} the result of splitting the text
*/
function textWrap(options: WrapTextCanvasOptions): WrapTextResult;
function textWrap(option: WrapTextOptions): WrapTextResult;
function textWrap(
  options: WrapTextOptions | WrapTextCanvasOptions,
): WrapTextResult {
  if (typeof options.text !== "string" || options.text.trim() === "")
    return { error: "text must be a non-empty string", lines: [] };

  const {
    text,
    lineBreak = "\n",
    customEllipsis = "...",
    maxChars = 50,
    charsAdjuster = 0,
    maxLines = 5,
    lineProcessor,
    sliceOverflow = true
  } = options;

  if (maxLines <= 0 || maxChars <= 0)
    return {
      error: `${maxChars <= 0 && maxLines <= 0 ? "MaxChars and MaxLines" : maxLines <= 0 ? "MaxLines" : "MaxChars"} must be more than 0!`,
      lines: [],
    };

  if (typeof charsAdjuster !== "number")
    return { error: "CharsAdjuster must be a number!", lines: [] };

  const ellipsis = validateEllipsis(customEllipsis);

  //Canvas block
  if ("ctx" in options) {
    const { ctx, maxWidth = 25, widthAdjuster = 0 } = options;

    const lines = sliceCanvasText({
      ctx,
      maxWidth,
      widthAdjuster,
      text,
      maxChars,
      maxLines,
      lineBreak,
      customEllipsis: ellipsis,
      charsAdjuster,
      lineProcessor,
      sliceOverflow
    });

    return { error: null, lines };
  }
  const lines = sliceText({
    text,
    maxChars,
    maxLines,
    lineBreak,
    customEllipsis: ellipsis,
    charsAdjuster,
    lineProcessor,
    sliceOverflow
  });

  return { error: null, lines };
}

class WrapText {
  private ctx?: SKRSContext2D;
  private maxChars = 50;
  private maxLines = 5;
  private lineBreak = "\n";
  private customEllipsis = "...";
  private charsAdjuster = 0;
  private lineProcessor = (line: string) => line;
  private sliceOverflow = true;

  constructor(options: WrapTextOptions | WrapTextCanvasOptions) {
    if ("ctx" in options) this.ctx = options.ctx;

    sliceText({
      text: options.text,
      maxChars: options.maxChars ?? this.maxChars,
      maxLines: options.maxLines ?? this.maxLines,
      lineBreak: options.lineBreak ?? this.lineBreak,
      customEllipsis: this.validateEllipsis(options.customEllipsis ?? this.customEllipsis),
      charsAdjuster: options.charsAdjuster ?? this.charsAdjuster,
      lineProcessor: options.lineProcessor ?? this.lineProcessor,
      sliceOverflow: options.sliceOverflow ?? this.sliceOverflow
    });
  }

  /**
   * Slice given text to specified maximum characters count and maximum lines count.
   * @param {SliceTextOptions} options - There are the following options.
   * @returns {string[]} - Sliced text lines.
   */
  sliceText({
    text,
    maxChars = 50,
    maxLines = 2,
    lineBreak = "\n",
    customEllipsis = this.customEllipsis,
    charsAdjuster = 0,
    lineProcessor = (line: string) => line,
    sliceOverflow
  }: SliceTextOptions): string[] {
    maxChars += charsAdjuster; // Корекція максимальної кількості символів
    const lineBreakIndex = (txt: string) => txt.indexOf(lineBreak);
    customEllipsis = this.validateEllipsis(customEllipsis);
    const lines: string[] = [];
    let cacheLine = text;
    let currentLine = 0;
    let isCacheLineChanged = false; // Флаг, що вказує на зміни
    let unchangedCount = 0; // Лічильник незмінних циклів

    while (cacheLine.length > 0 && (sliceOverflow || currentLine < maxLines)) {
      // Перевірка на нескінченний цикл
      if (unchangedCount >= 3) {
        console.warn("SliceText Warning: Possible infinite loop detected.");
        break;
      }

      const cacheLineBreakIndex = lineBreakIndex(cacheLine);

      if (cacheLineBreakIndex !== -1 && cacheLineBreakIndex < maxChars) {
        let line = cacheLine.slice(0, cacheLineBreakIndex);

        if (lineProcessor) line = lineProcessor(line);

        lines.push(line);
        cacheLine = this.removeFirstDash(cacheLine.slice(cacheLineBreakIndex + 1)); // Рухаємося до наступного рядка
        currentLine++;
        isCacheLineChanged = true; // Встановлюємо флаг про зміну
      } else if (!sliceOverflow && currentLine >= maxLines - 1) {
        let line = cacheLine.slice(0, maxChars);
        const slicedCacheLine = cacheLine.slice(maxChars);

        if (sliceOverflow === false && slicedCacheLine.length > 0 && currentLine >= maxLines - 1) line = line.slice(0, -customEllipsis.length) + customEllipsis;
        if (lineProcessor) line = lineProcessor(line);

        line = line.trimStart(); //обрізаю перші пробіли
        lines.push(line);
        break; // Завершуємо цикл, бо досягли ліміту рядків
      } else {
        let line = cacheLine.slice(0, maxChars);

        // Якщо слово не вміщується, додаємо дефіс
        if (cacheLine.length > maxChars) {
          const wordEndIndex = cacheLine.lastIndexOf(" ", maxChars);
          const isCommaOrDot = [",", "."].includes(cacheLine.slice(maxChars)[0]);
          const editedMaxChars = isCommaOrDot ? maxChars + 1 : maxChars;

          // Перевіряємо, чи слово з дефісом вміщується у рядок
          if (wordEndIndex === -1 || cacheLine.slice(wordEndIndex).length > editedMaxChars) {
            // Якщо слово не вміщується, додаємо дефіс
            const sliceIndex = editedMaxChars - 1;
            const lastChar = cacheLine[sliceIndex];
            const nextLastCharIsSpace = cacheLine[sliceIndex + 1] === " ";

            // Уникаємо зайвих дефісів. Та додаємо дефіс тільки якщо слово не вміщується, но не має крапку, кому, дефіс або пробіл
            line = (this.endsWithArray(lastChar, [".", ",", "-", " "]) || nextLastCharIsSpace ? cacheLine.slice(0, editedMaxChars) : `${cacheLine.slice(0, sliceIndex)}${cacheLine[sliceIndex - 1] === " " ? "" : "-"}`).trimEnd();
          } else {
            // Якщо слово вміщується, додаємо його без змін
            line = cacheLine.slice(0, wordEndIndex);
          }
        }

        if (lineProcessor) line = lineProcessor(line);

        const isDashEnd = line.endsWith("-"); // Перевірка на дефіс в кінці рядка
        line = this.removeFirstDash(line);
        cacheLine = this.removeFirstDash(cacheLine);
        lines.push(line);
        cacheLine = cacheLine.slice(isDashEnd ? line.length - 1 : line.length).trimStart(); // Я обрізаю перші пробіли
        currentLine++;
        isCacheLineChanged = true; // Встановлюємо флаг про зміну
      }

      // Якщо cacheLine не змінився - пропускаємо порівняння
      if (isCacheLineChanged) {
        unchangedCount = 0;
        isCacheLineChanged = false; // Скидаємо флаг
      } else {
        unchangedCount++;
      }
    }

    return lines;
  }

  sliceTextCanvas() {
    return;
  }

  /**
   * Checks if a given string ends with any of the strings in the given array.
   * Returns true if the string ends with any of the strings, false otherwise.
   * @param {string} text - The string to check.
   * @param {string[]} find - The array of strings to search for.
   * @param {boolean} [caseInsensitive=false] - Whether to perform a case-insensitive search.
   * @returns {boolean} - true if the string ends with any of the strings, false otherwise.
   */
  private endsWithArray(text: string, find: string[], caseInsensitive: boolean = false): boolean {
    const target = caseInsensitive ? text.toLowerCase() : text;

    return find.some(txt => target.endsWith(caseInsensitive ? txt.toLowerCase() : txt));
  }


  /**
   * Removes the first dash from a string if it is not separated by a space.
   * 
   * @param {string} text - The input string from which the first dash should be removed.
   * @returns {string} - The modified string with the first dash removed if applicable, and leading spaces trimmed.
   */
  private removeFirstDash(text: string): string {
    // Видаляємо дефіс тільки якщо він не відокремлений пробілом
    if (text.startsWith("-") && !text.startsWith("- ")) {
      return text.slice(1).trimStart(); // Видаляємо дефіс і зайвий пробіл на початку
    }

    return text.trimStart();
  }

  /**
   * Validates and truncates the given ellipsis string if it exceeds the specified maximum length.
   *
   * @param {string} ellipsis - The ellipsis string to validate.
   * @param {number} [maxLength=5] - The maximum allowed length for the ellipsis. Defaults to 5.
   * @returns {string} - The validated ellipsis string, truncated if necessary.
   */
  private validateEllipsis(ellipsis: string, maxLength: number = 5): string {
    if (ellipsis.trim().length === 0) return "..."; // Значення за замовчуванням

    return ellipsis.length > maxLength ? ellipsis.slice(0, maxLength) : ellipsis;
  }

}

























/**
 * Slice given text to specified maximum characters count and maximum lines count.
 * @param {SliceTextOptions} options - Options object.
 * @param {string} options.text - Text to be sliced.
 * @param {number} options.maxChars - Maximum characters count.
 * @param {number} options.maxLines - Maximum lines count.
 * @param {string} options.lineBreak - Line break character.
 * @param {string} options.customEllipsis - Custom ellipsis character.
 * @param {number} options.charsAdjuster - Adjustment value for maximum characters count.
 * @param {Function} options.lineProcessor - Function to process each line.
 * @returns {string[]} - Sliced text lines.
 */
function sliceText({
  text,
  maxChars = 50,
  maxLines = 2,
  lineBreak = "\n",
  customEllipsis = "...",
  charsAdjuster = 0,
  lineProcessor = (line: string) => line,
  sliceOverflow = false,
}: SliceTextOptions): string[] {
  maxChars += charsAdjuster; // Корекція максимальної кількості символів
  const lineBreakIndex = (txt: string) => txt.indexOf(lineBreak);

  const lines: string[] = [];
  let cacheLine = text.trimStart(); // Обрізаємо початкові пробіли
  let currentLine = 0;

  while (cacheLine.length > 0 && (sliceOverflow || currentLine < maxLines)) {
    const cacheLineBreakIndex = lineBreakIndex(cacheLine);

    if (cacheLineBreakIndex !== -1 && cacheLineBreakIndex < maxChars) {
      // Перенос за lineBreak
      let line = cacheLine.slice(0, cacheLineBreakIndex);
      if (lineProcessor) line = lineProcessor(line);
      lines.push(line);

      cacheLine = cacheLine.slice(cacheLineBreakIndex + 1).trimStart(); // Переходимо до наступного рядка
    } else if (!sliceOverflow && currentLine >= maxLines - 1) {
      // Останній рядок з еліпсисом
      let line = cacheLine.slice(0, maxChars);
      const slicedCacheLine = cacheLine.slice(maxChars);

      if (slicedCacheLine.length > 0) {
        line = line.slice(0, -customEllipsis.length) + customEllipsis;
      }

      if (lineProcessor) line = lineProcessor(line);
      lines.push(line);
      break;
    } else {
      // Обробка довгих слів
      let line = cacheLine.slice(0, maxChars);
      if (cacheLine.length > maxChars) {
        const wordEndIndex = cacheLine.lastIndexOf(" ", maxChars);

        if (wordEndIndex === -1 || cacheLine.slice(wordEndIndex).length > maxChars) {
          // Якщо слово не вміщується, переносимо його частинами
          line = `${cacheLine.slice(0, maxChars - 1)}-`;
        } else {
          // Якщо є пробіл, переносимо слово повністю
          line = cacheLine.slice(0, wordEndIndex);
        }
      }

      if (lineProcessor) line = lineProcessor(line);
      lines.push(line);

      // Забезпечення коректного переносу після дефіса
      const isDashEnd = line.endsWith("-");
      cacheLine = cacheLine.slice(isDashEnd ? line.length - 1 : line.length).trimStart();

      if (isDashEnd && cacheLine.length > 0 && !cacheLine.startsWith(" ")) {
        // Якщо рядок закінчується дефісом, додаємо залишок слова
        const nextChunk = cacheLine.slice(0, maxChars - 1);
        cacheLine = `${nextChunk}-${cacheLine.slice(nextChunk.length).trimStart()}`;
      }
    }

    currentLine++;
  }

  return lines;
}

/**
 * Validates and truncates the given ellipsis string if it exceeds the specified maximum length.
 *
 * @param {string} ellipsis - The ellipsis string to validate.
 * @param {number} [maxLength=5] - The maximum allowed length for the ellipsis. Defaults to 5.
 * @returns {string} - The validated ellipsis string, truncated if necessary.
 */
function validateEllipsis(ellipsis: string, maxLength: number = 5): string {
  if (ellipsis.trim().length === 0) return "..."; // Значення за замовчуванням

  return ellipsis.length > maxLength ? ellipsis.slice(0, maxLength) : ellipsis;
}

/**
 * Slices given text to specified maximum characters count and maximum lines count, while
 * accounting for the width of the canvas and the given maximum width.
 * @param {SliceCanvasTextOptions} options - Options object.
 * @param {SKRSContext2D} options.ctx - Canvas context.
 * @param {string} options.text - Text to be sliced.
 * @param {number} options.maxChars - Maximum characters count.
 * @param {number} options.maxLines - Maximum lines count.
 * @param {string} options.lineBreak - Line break character.
 * @param {string} options.customEllipsis - Custom ellipsis character.
 * @param {number} options.charsAdjuster - Adjustment value for maximum characters count.
 * @param {number} options.maxWidth - Maximum width of the canvas.
 * @param {number} options.widthAdjuster - Adjustment value for maximum width.
 * @returns {string[]} - Sliced text lines.
 */
function sliceCanvasText({
  ctx,
  text,
  maxChars,
  maxLines,
  lineBreak,
  customEllipsis,
  charsAdjuster,
  maxWidth,
  widthAdjuster,
  lineProcessor
}: SliceCanvasTextOptions): string[] {
  const initialLines = sliceText({
    text,
    maxChars,
    maxLines,
    lineBreak,
    customEllipsis,
    charsAdjuster,
    lineProcessor,
  });

  const canvasLines: string[] = [];
  let totalLoopCount = 0;

  initialLines.forEach((line) => {
    while (ctx.measureText(line).width > maxWidth + widthAdjuster) {
      if (totalLoopCount > initialLines.length * 50)
        throw new TypeError(`Infinite loop detected: Cannot wrap text "${text}" for maxWidth ${maxWidth}.`);

      // Бінарний пошук для визначення оптимального індексу для розриву
      let low = 0;
      let high = line.length;

      while (low < high) {
        const mid = Math.floor((low + high) / 2);
        const width = ctx.measureText(line.slice(0, mid)).width;

        if (width <= maxWidth + widthAdjuster) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }

      let splitIndex = high > 0 ? high - 1 : 0;

      // Перевірка на довгі слова
      const word = line.slice(0, splitIndex);
      if (word.length >= 100) {
        // Обробляємо довгі слова окремо за допомогою sliceText
        const longWordLines = sliceText({
          text: word,
          maxChars,
          maxLines: 1, // ми розбиваємо одне слово
          lineBreak,
          customEllipsis,
          charsAdjuster,
          lineProcessor,
        });

        // Додаємо розбите слово в результат
        canvasLines.push(longWordLines[0]);
        line = line.slice(splitIndex); // Оновлюємо решту рядка
      } else {
        // Пошук останнього пробілу для розриву перед splitIndex
        const lastSpace = line.lastIndexOf(" ", splitIndex);
        if (lastSpace > 0) {
          splitIndex = lastSpace;
        }
        console.log(ctx.measureText(line.slice(0, splitIndex)).width);
        // Додаємо розбиту частину рядка до результатів
        canvasLines.push(line.slice(0, splitIndex));

        // Оновлюємо рядок
        line = line.slice(splitIndex).trim(); // trim() для видалення зайвих пробілів
      }

      totalLoopCount++;
    }

    if (line) canvasLines.push(line);
  });

  return canvasLines.slice(0, maxLines); // Повертаємо результат з урахуванням maxLines
}




export default RenameLater;

function clipToWidth({
  text,
  ctx,
  maxWidth,
  addHyphen = false,
}: {
  text: string;
  ctx: SKRSContext2D;
  maxWidth: number;
  addHyphen?: boolean;
}): { clipped: string; remaining: string } {
  let clippedText = "";
  for (let i = 0; i < text.length; i++) {
    const testText = clippedText + text[i];
    if (ctx.measureText(testText).width > maxWidth) {
      if (addHyphen && i > 0) {
        return {
          clipped: `${clippedText}-`,
          remaining: text.slice(i),
        };
      }
      return {
        clipped: clippedText,
        remaining: text.slice(i),
      };
    }
    clippedText = testText;
  }
  return {
    clipped: clippedText,
    remaining: "",
  };
}

function RenameLater({
  text,
  ctx,
  maxChars = 50,
  maxLines = 5,
  maxWidth = 50,
  addHyphen = false
}: {
  text: string;
  ctx: SKRSContext2D;
  maxChars?: number;
  maxLines?: number;
  maxWidth?: number;
  addHyphen?: boolean;
}) {
  if (maxLines <= 0 || maxChars <= 0) return { error: "Invalid maxLines or maxChars", lines: [] };
  if (typeof text !== "string" || text.trim() === "") return { error: "Invalid text", lines: [] };

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const potentialLine = currentLine ? `${currentLine} ${word}` : word;

    if (ctx.measureText(potentialLine).width > maxWidth) {
      if (ctx.measureText(word).width > maxWidth) {
        // Обробка довгого слова
        let remainingWord = word;
        while (ctx.measureText(remainingWord).width > maxWidth) {
          const { clipped, remaining } = clipToWidth({
            text: remainingWord,
            ctx,
            maxWidth,
            addHyphen,
          });
          lines.push(clipped);
          remainingWord = remaining;
        }
        currentLine = remainingWord;
      } else {
        // Завершуємо рядок і переносимо слово
        lines.push(currentLine);
        currentLine = word;
      }
    } else {
      currentLine = potentialLine;
      console.log(ctx.measureText(currentLine).width, currentLine);
    }

    if (lines.length >= maxLines) break; // Ліміт рядків
  }

  // Додаємо залишковий рядок
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  return { error: null, lines };
}





























































// пока будет тут. Позже в types закину

/**
 * Options for slicing text.
 */
interface SliceTextOptions {
  /**
   * The text to be sliced.
   */
  text: string;

  /**
   * The maximum number of characters per line.
   * @default 50
   */
  maxChars?: number;

  /**
   * The maximum number of lines.
   * @default 2
   */
  maxLines?: number;

  /**
   * The line break character.
   */
  lineBreak?: string;

  /**
   * The custom ellipsis character.
   */
  customEllipsis?: string;

  /**
   * The adjustment value for maximum characters count.
   */
  charsAdjuster?: number;

  /**
   * If true, trim the text, if false, wrap it.
   * @default true
   */
  sliceOverflow?: boolean;

  /**
  * Function to process each line before returning it.
  * @param line - The line to process.
  * @returns Processed line string.
  */
  lineProcessor?: (line: string) => string;
}

/**
 * Options for slicing text. Canvas verison
 */
interface SliceCanvasTextOptions extends SliceTextOptions, BaseCanvasTextOptions { }

/**
 * Options for base canvas text
 */
interface BaseCanvasTextOptions {
  /**
  * The canvas context.
  */
  ctx: SKRSContext2D;

  /**
   * The maximum width of the canvas.
   */
  maxWidth: number;

  /**
   * The adjustment value for maximum width.
   */
  widthAdjuster: number;
}

/**
 * Options for wrapping text. Canvas verison
 */
interface WrapTextCanvasOptions extends WrapTextOptions, PartialOptions<BaseCanvasTextOptions, "widthAdjuster"> { }

/**
 * Makes specific keys in an interface required
 */
type RequiredOptions<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Makes specific keys in an interface optional
 */
type PartialOptions<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Options for wrapping text
 */
interface WrapTextOptions extends RequiredOptions<Partial<SliceTextOptions>, "text"> { }

/**
 * Result of wrapping text
 */
interface WrapTextResult {
  /**
   * The error message.
   */
  error: null | string; // Якщо сталася помилка, повертає текст помилки

  /**
   * The sliced text lines.
   */
  lines: string[]; // Рядки тексту після переносу
}
