import type { SKRSContext2D } from "@napi-rs/canvas";

/**
 * @description
 * Splits a given text string into multiple lines, while accounting for a given maximum
 * number of characters and lines. The text is also adjusted to fit within a given maximum
 * width of the canvas.
 * @param {WrapTextOptions | WrapTextCanvasOptions} options - options for splitting the text
 * @returns {WrapTextResult} the result of splitting the text
 * @see {@link https://github.com/EmiliaAPI/Emilia/blob/master/docs/modules/util/textWrap.md | docs} lol, i don't know where this page. //TODO: Delete this comment later
 */
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
  maxChars,
  maxLines,
  lineBreak,
  customEllipsis,
  charsAdjuster,
  lineProcessor,
  sliceOverflow
}: SliceTextOptions): string[] {
  maxChars += charsAdjuster; // Корекція максимальної кількості символів
  const lineBreakIndex = (txt: string) => txt.indexOf(lineBreak);

  if (maxLines === 1 || sliceOverflow === true) {
    let res = text.slice(0, maxChars);
    const resBreakIndex = lineBreakIndex(res);

    if (resBreakIndex !== -1) res = res.slice(0, resBreakIndex);
    if (lineProcessor) res = lineProcessor(res);

    return [res.slice(0, res.length - customEllipsis.length) + customEllipsis];
  }

  const lines: string[] = [];
  let cacheLine = text;

  for (let i = 0; i < maxLines; i++) {
    if (cacheLine.length === 0) break; // У нас закінчився текст раніше, чим максимальна кількість рядків

    const cacheLineBreakIndex = lineBreakIndex(cacheLine);

    if (cacheLineBreakIndex !== -1) {
      let line = cacheLine.slice(0, cacheLineBreakIndex);

      if (lineProcessor) line = lineProcessor(line);

      lines.push(line);
      // Використовуємо line, бо тут працюємо із змінною рядка, а не cacheLine
      cacheLine = cacheLine.slice(lineBreakIndex(line) + 1);
      continue; // переходимо до іншого рядку. Це не для виходу з циклу
    }

    if (lines.length >= maxLines) {
      let line =
        cacheLine.slice(0, maxChars - customEllipsis.length) + customEllipsis;

      if (lineProcessor) line = lineProcessor(line);

      lines.push(line);
      cacheLine = "";
      break; // вихід з циклу
    }

    let line = cacheLine.slice(0, maxChars);

    if (lineProcessor) line = lineProcessor(line);

    lines.push(line);
    cacheLine = line.slice(maxChars);
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

      // Використання бінарного пошуку для пошуку splitIndex
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

      const splitIndex = high > 0 ? high - 1 : 0;

      canvasLines.push(line.slice(0, splitIndex));
      line = line.slice(splitIndex);

      totalLoopCount++;
    }

    if (line) canvasLines.push(line);
  });

  return canvasLines.slice(0, maxLines); // З урахуванням кількості maxLines
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
   */
  maxChars: number;

  /**
   * The maximum number of lines.
   */
  maxLines: number;

  /**
   * The line break character.
   */
  lineBreak: string;

  /**
   * The custom ellipsis character.
   */
  customEllipsis: string;

  /**
   * The adjustment value for maximum characters count.
   */
  charsAdjuster: number;

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
interface WrapTextOptions extends RequiredOptions<SliceTextOptions, "text"> { }

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
