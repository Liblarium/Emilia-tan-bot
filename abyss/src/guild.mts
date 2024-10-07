import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type Canvas,
  GlobalFonts,
  type Image,
  type SKRSContext2D,
  createCanvas,
  loadImage,
} from "@napi-rs/canvas";
import sharp from "sharp";
import type {
  DrawClanProfileOptions,
  DrawTextOptions,
  LoadImageResize,
  SetFontStyleOptions,
  StringNumber,
  TextFormatterOptions
} from "../types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

[
  {
    name: "v_CCWild Words Roman",
    path: "v_CCWild Words Roman_V3.02.ttf",
  },
  {
    name: "v_CCWild Words Roman Ripple",
    path: "v_CCWild Words Roman Ripple_V1.0.ttf",
  },
].forEach((val) => {
  GlobalFonts.registerFromPath(
    resolve(__dirname, "..", "fonts", val.path),
    val.name,
  );
});

const random = (min: number, max: number): number => {
  if (min >= max)
    throw new TypeError(
      `Агрумент min (${min.toString()}) не может быть больше или равно аргументу max (${max.toString()})!`,
    );
  const random = Math.floor(Math.random() * (max - min + 1)) + min;

  return random > max ? random - 1 : random;
};

const fonts = {
  size: "20px",
  font: "v_CCWild Words Roman",
};
const imgPath = "./abyss/images";
const blur = (px = 0) => `blur(${px}px)`;
async function drawClanProfile(clan: DrawClanProfileOptions) {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext("2d");

  // Фон
  ctx.fillStyle = "#2C2F33";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Логотип клана
  const img = await sharp(clan.logoUrl).toBuffer();
  const logo = await loadImage(img);
  ctx.drawImage(logo, 50, 50, 100, 100);

  // Название клана
  ctx.font = "bold 40px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(clan.name, 200, 100);

  // Девиз клана
  ctx.font = "italic 20px Arial";
  ctx.fillStyle = "#AAAAAA";
  ctx.fillText(clan.motto, 200, 150);

  // Дата создания клана
  ctx.font = "20px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(`Дата создания: ${clan.creationDate}`, 200, 200);

  // Количество участников
  ctx.fillText(`Участников: ${clan.memberCount}`, 200, 230);

  // Активность клана
  ctx.fillText(`Активность: ${clan.activityLevel}`, 200, 260);

  // Список достижений
  ctx.fillText("Достижения:", 50, 300);
  clan.achievements.forEach((achievement: unknown, index: number) => {
    ctx.fillText(`- ${achievement}`, 70, 330 + index * 30);
  });

  return canvas.toBuffer("image/png");
}

async function drawMemberList(
  members: { name: string; role: string; avatarUrl: string }[],
) {
  const canvas = createCanvas(800, 100 * members.length);
  const ctx = canvas.getContext("2d");

  // Фон
  ctx.fillStyle = "#2C2F33";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < members.length; i++) {
    const member = members[i];

    // Аватарка
    const img = await sharp(member.avatarUrl).toBuffer();
    const avatar = await loadImage(img);
    ctx.drawImage(avatar, 50, 100 * i + 10, 80, 80);

    // Имя
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(member.name, 150, 100 * i + 50);

    // Роль в клане
    ctx.font = "20px Arial";
    ctx.fillStyle = "#AAAAAA";
    ctx.fillText(member.role, 150, 100 * i + 80);
  }

  return canvas.toBuffer("image/png");
}

const numberClip = (num: StringNumber): string => {
  if (typeof num !== "string") num = `${num}`;

  const numLength = num.length;

  return numLength >= 5
    ? `${num.slice(0, 4)}k`
    : numLength >= 11
      ? `${num.slice(0, 4)}kk`
      : numLength >= 16
        ? `${num.slice(0, 4)}kk+`
        : num;
};
const parseSecond = (
  s: number,
): { hours: number; minutes: number; seconds: number } => {
  const minutes = Math.floor(s / 60);
  const hours = Math.floor(minutes / 60);
  return {
    hours,
    minutes: minutes - hours * 60,
    seconds: s % 60,
  };
};

const timeFormatter = (time: number): string => {
  if (typeof time !== "number" || time < 0)
    throw new TypeError(
      "Profile.timeFormatter: Входное значение в timeFormatter не является положительным числом!",
    );

  const parser = parseSecond(time);
  const isHour = parser.hours > 0;
  const isMinute = parser.minutes > 0;

  return isHour
    ? parser.hours >= 10
      ? `${numberClip(parser.hours)} ч`
      : `${parser.hours} ч ${parser.minutes} м`
    : isMinute
      ? `${parser.minutes} м ${parser.seconds} с`
      : `${parser.seconds} с`;
};

const whileClip = (
  ctx: SKRSContext2D,
  cache: string,
  maxWidth: number,
  elseWidth?: number,
): string => {
  let cached: string = cache;

  while (ctx.measureText(cached).width + (elseWidth ?? 0) > maxWidth) {
    if (cached.length === 0) throw new TypeError("infinite while");

    cached = cached.slice(0, -1);
  }

  return cached;
};

const textFormater = ({
  text,
  cache,
  curInd,
  linesNext,
  dynamic = false,
}: TextFormatterOptions): string => {
  const isStartEmpty = /^\s/;
  const isEndEmpty = /\s$/;

  return curInd < linesNext
    ? isStartEmpty.test(text) || isEndEmpty.test(cache)
      ? cache
      : `${cache}-`
    : dynamic && curInd === linesNext
      ? isEndEmpty.test(cache)
        ? `${cache.slice(0, -1)}...`
        : `${cache}...`
      : cache;
};

const setFontStyle = ({
  ctx,
  size,
  font,
  color,
  type = 1,
}: SetFontStyleOptions & { ctx: SKRSContext2D }) => {
  if (typeof size === "number") size = `${size}px`;
  if (size) fonts.size = size;
  if (font) fonts.font = font;
  if (size || font) ctx.font = `${size ?? fonts.size} ${font ?? fonts.font}`;
  if (color) {
    if (type === 1 || type === 3) ctx.fillStyle = color;
    if (type === 2 || type === 3) ctx.strokeStyle = color;
  }
};

const roundedRect = ({
  x,
  y,
  w,
  h,
  ctx,
  r = 11,
}: { x: number; y: number; w: number; h: number; ctx: SKRSContext2D, r?: number }) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const options: { fit: keyof sharp.FitEnum } = { fit: "cover" };
const kogasaImg = sharp(`${imgPath}/kogasa.png`);
const tenshiImg = sharp(`${imgPath}/tenshi.png`);
const bgImg = sharp(`${imgPath}/bg.png`);
const nahidaImg = sharp(`${imgPath}/nahida.png`);

const kogasaAv = kogasaImg.resize(140, 140, options);
const kogasaAvImg = await loadImage(await kogasaAv.toBuffer());

const kogasaIcon = kogasaImg.resize(40, 40, options);
const kogasaIconImg = await loadImage(await kogasaIcon.toBuffer());

const tenshiIcon = tenshiImg.resize(40, 40, options);
const tenshiIconImg = await loadImage(await tenshiIcon.toBuffer());

const bgAll = bgImg.resize(760, 410, options);
const bgAllImg = await loadImage(await bgAll.toBuffer());

const nahidaIcon = nahidaImg.resize(40, 40, options);
const nahidaIconImg = await loadImage(await nahidaIcon.toBuffer());

class DrawTextBase {
  public readonly ctx: SKRSContext2D;
  private readonly isStartEmptyRegExp: RegExp = /^\s/;

  /**
   * Creates a new instance of DrawTextBase.
   *
   * @param {SKRSContext2D} ctx - The context of the canvas.
   */
  constructor(ctx: SKRSContext2D) {
    this.ctx = ctx;
  }

  /**
   * Registers a list of fonts from the given list of paths.
   *
   * @param {Array<{name: string, path: string}>} fonts - The list of fonts to register.
   * @throws {TypeError} If the list of fonts is empty.
   */
  public registerFonts(fonts: { name: string, path: string }[]) {
    if (fonts.length < 1) throw new TypeError("Вы не указали ни одного шрифта!");

    fonts.forEach((val) => {
      GlobalFonts.registerFromPath(
        resolve(__dirname, "..", "fonts", val.path),
        val.name,
      );
    });
  }

  /**
   * Draws a text on the canvas.
   * @param {DrawTextOptions} options - The options for drawing the text.
   * @returns {Promise<void>}
   */
  public async drawText({
    x1,
    x2 = 0,
    y,
    text,
    textDirect = "normal",
    dynamicOptions,
    fontOptions,
    clipNumber = false,
    timeFormat = false,
    x_translate,
  }: DrawTextOptions): Promise<void> {
    const ctx = this.ctx;
    const {
      isClip,
      dynamic,
      dynamicCorrector,
      lineSpacing,
      lines: linesNext,
    } = {
      isClip: false,
      dynamic: false,
      dynamicCorrector: 0,
      lineSpacing: 0,
      lines: 0,
      ...dynamicOptions,
    };

    if (clipNumber || timeFormat)
      text = this.numberFormated(text, { time: timeFormat, num: clipNumber });
    if (fontOptions) setFontStyle({ ctx, ...fontOptions });

    const iText: string = text.toString();
    const leftText: boolean = textDirect === "left";
    const centerText: boolean = textDirect === "center";
    const maxWidth: number = x2 > 0 ? x2 - x1 : x1;
    const ellipsisWidth: number = ctx.measureText("...").width;
    const dashWidth: number = ctx.measureText("-").width;
    const words: string[] = iText.split(" ");
    const lines: string[] = [""]; //массив строк
    const textMetrics = ctx.measureText(iText);
    const textWidth: number = textMetrics.width;
    const textHeight: number =
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent;
    let truncatedText = iText;
    let x: number = x1;

    ctx.save();
    if (dynamic || isClip) {
      if (isClip)
        this.clipText({
          words,
          lines,
          maxWidth,
          dashWidth,
          ellipsisWidth,
          dynamic,
          linesNext,
          dynamicCorrector,
        });

      if (x_translate !== undefined) ctx.translate(x_translate, 0);

      if (textWidth > maxWidth && !isClip) {
        while (
          ctx.measureText(truncatedText).width +
          (ellipsisWidth + dynamicCorrector) >
          maxWidth
        ) {
          if (truncatedText.length === 0)
            throw new TypeError("Бесконечный while!");

          truncatedText = truncatedText.slice(0, -1);
        }

        truncatedText = truncatedText === text ? text : `${truncatedText}...`;
      }
    }

    if (leftText) ctx.textAlign = "right";
    if (centerText) (ctx.textAlign = "center"), (x = (x1 + x2) / 2);
    if (isClip) {
      lines.forEach((line, i) => {
        ctx.fillText(line, x, y + i * (textHeight + lineSpacing));
      });

      lines.length = 0;
    } else ctx.fillText(truncatedText, x, y);
    if (leftText || centerText) ctx.textAlign = "start";

    ctx.restore();
  }

  /**
   * Converts a given number to a string in the following format:
   *  - If `time` is true, the number is formatted as a time string in the format "HH:mm:ss".
   *  - If `num` is true, the number is formatted as a number string with a maximum of 3 decimal places.
   *  - If `time` and `num` are both false, the number is formatted as a string with a maximum of 3 decimal places.
   *  - If `time` and `num` are both true, an error is thrown.
   *  - If the input is a string, it is split into words and each word is parsed as a number. All numbers that are not NaN are formatted as strings and joined together with a space.
   * @param {StringNumber} text - The text to be formatted.
   * @param {{ time?: boolean; num?: boolean }} options - The options for formatting the text.
   * @returns {string} - The formatted string.
   * @throws {TypeError} - If `time` and `num` are both true.
   * @throws {TypeError} - If the input is a string and no numbers are found.
   */
  private numberFormated(
    text: StringNumber,
    { time = false, num = false }: { time?: boolean; num?: boolean },
  ): string {
    const textNum = typeof text === "number" ? text : Number.NaN;
    const textStr = typeof text === "string" ? text : "";
    let result = "";

    if (Number.isNaN(textNum) && textStr.length === 0)
      throw new TypeError("Вы ничего не указали? Или указали только NaN?");

    if (time === true && num === true)
      throw new TypeError(
        "Низя просто взять и использовать time с num! Они уже связаны в time",
      );

    if (!Number.isNaN(textNum)) {
      if (time) result = timeFormatter(textNum);
      if (num) result = numberClip(textNum);
    }

    if (textStr.length > 0) {
      const textArr = textStr.split(" ");
      const numArr: { val: number; i: number }[] = [];
      textArr.forEach((val, i) => {
        const num = Number(val);

        if (Number.isNaN(num)) return;

        numArr.push({ val: num, i });
      });

      for (const item of numArr) {
        const res = time ? timeFormatter(item.val) : numberClip(item.val);

        textArr[item.i] = res;
      }

      textArr.forEach((val) => {
        result += `${val} `;
      });

      return result.slice(0, -1);
    }

    return result;
  }

  /**
   * This function is used to clip a given text string to a specified maximum
   * width. It takes an array of words, an array of lines, the maximum width,
   * the dash width, the ellipsis width, a boolean indicating whether or not
   * to use dynamic line clipping, the number of lines to clip to, and the
   * dynamic corrector value. It then iterates through the words, adding each
   * word to the current line until the maximum width is exceeded. If the
   * maximum width is exceeded, it clips the current line to the maximum
   * width and adds the clipped line to the lines array. It also adds the
   * remaining text to the cache word. It then continues to the next line.
   * If the maximum width is not exceeded, it simply adds the word to the
   * current line. It also handles the case where a word contains a newline
   * character. If the cache word is not empty and the current line index is
   * less than the number of lines to clip to, it adds the cache word to the
   * lines array. If the cache word is empty, it simply adds an empty string
   * to the lines array.
   *
   * @param {string[]} words - The array of words to be clipped.
   * @param {string[]} lines - The array of lines to be clipped.
   * @param {number} maxWidth - The maximum width to clip to.
   * @param {number} dashWidth - The width of a dash.
   * @param {number} ellipsisWidth - The width of an ellipsis.
   * @param {boolean} dynamic - A boolean indicating whether or not to use
   * dynamic line clipping.
   * @param {number} linesNext - The number of lines to clip to.
   * @param {number} dynamicCorrector - The dynamic corrector value.
   */
  private clipText({
    words,
    lines,
    maxWidth,
    dashWidth,
    ellipsisWidth,
    dynamic,
    linesNext,
    dynamicCorrector,
  }: {
    words: string[];
    lines: string[];
    maxWidth: number;
    dashWidth: number;
    ellipsisWidth: number;
    dynamic: boolean;
    linesNext: number;
    dynamicCorrector: number;
  }) {
    const ctx = this.ctx;
    let [cacheWord, currentLineIndex, beforeNewLine] = ["", 0, ""];

    for (const word of words) {
      const buildLine =
        lines[currentLineIndex] + (lines[currentLineIndex] ? " " : "") + word;
      const testLine = buildLine.startsWith(" ")
        ? buildLine.slice(1, buildLine.length)
        : buildLine;

      if (currentLineIndex > linesNext) break;
      if (ctx.measureText(testLine).width < maxWidth) {
        const newLineIndex = word.indexOf("\n");

        if (newLineIndex === -1) {
          lines[currentLineIndex] = testLine;
        } else {
          beforeNewLine = testLine.slice(
            0,
            testLine.length - word.length + newLineIndex,
          );
          const afterNewLine = word.slice(newLineIndex + 1);

          lines[currentLineIndex++] = beforeNewLine;

          if (currentLineIndex <= linesNext)
            lines[currentLineIndex] = afterNewLine;
        }
        continue;
      }

      cacheWord = testLine;

      cacheWord = whileClip(
        ctx,
        cacheWord,
        maxWidth,
        currentLineIndex < linesNext
          ? dashWidth
          : dynamic && currentLineIndex === linesNext
            ? ellipsisWidth + dynamicCorrector
            : 0,
      );
      const cacheWordNewIndex = cacheWord.indexOf("\n");

      if (cacheWordNewIndex !== -1)
        cacheWord = cacheWord.slice(0, cacheWordNewIndex);

      const tLClip = testLine.slice(
        cacheWord.length + (cacheWordNewIndex === -1 ? 0 : 1),
      );
      const testLineClip = tLClip.startsWith("-") ? tLClip.slice(1) : tLClip;
      const textFormated = textFormater({
        text: testLineClip,
        cache: cacheWord,
        curInd: currentLineIndex,
        dynamic,
        linesNext,
      });
      lines[currentLineIndex] = textFormated.endsWith("--")
        ? textFormated.slice(0, -1)
        : textFormated;
      let cacheLine = this.isStartEmptyRegExp.test(testLineClip)
        ? testLineClip.slice(1)
        : testLineClip;

      ++currentLineIndex;

      if (currentLineIndex <= linesNext) {
        lines[currentLineIndex] = "";

        if (testLineClip.length >= cacheWord.length) {
          const lineCache: string[] = [];
          cacheWord = cacheLine;
          const nextLineNum = lines[0].length + 5;

          this.splitTextByWidth({
            lineCache,
            cacheWord,
            nextLineNum,
            currentLineIndex,
            linesNext,
            beforeNewLine,
            cacheLine,
          });

          cacheWord = "";
          cacheLine = "";

          this.applyLineFormat({
            lines,
            lineCache,
            cacheWord,
            maxWidth,
            currentLineIndex,
            linesNext,
            dashWidth,
            dynamic,
            ellipsisWidth,
            dynamicCorrector,
          });
        } else lines[currentLineIndex] = testLineClip;
      }
    }
  }

  /**
   * Applies line formatting to the given lines, by clipping them if the line exceeds
   * the maximum width, and adding an ellipsis if the line is dynamic and it is the
   * last line.
   * @param {{
   *   lines: string[];
   *   lineCache: string[];
   *   cacheWord: string;
   *   maxWidth: number;
   *   currentLineIndex: number;
   *   linesNext: number;
   *   dashWidth: number;
   *   dynamic: boolean;
   *   ellipsisWidth: number;
   *   dynamicCorrector: number;
   * }} options - The options for applying line formatting.
   */
  private applyLineFormat({
    lines,
    lineCache,
    cacheWord,
    maxWidth,
    currentLineIndex,
    linesNext,
    dashWidth,
    dynamic,
    ellipsisWidth,
    dynamicCorrector,
  }: {
    lines: string[];
    lineCache: string[];
    cacheWord: string;
    maxWidth: number;
    currentLineIndex: number;
    linesNext: number;
    dashWidth: number;
    dynamic: boolean;
    ellipsisWidth: number;
    dynamicCorrector: number;
  }) {
    for (const line of lineCache) {
      cacheWord = whileClip(
        this.ctx,
        line,
        maxWidth,
        currentLineIndex <= linesNext
          ? dashWidth
          : dynamic && currentLineIndex === linesNext
            ? ellipsisWidth + dynamicCorrector
            : 0,
      );

      const textFormated = textFormater({
        text: line,
        cache: cacheWord,
        curInd: currentLineIndex,
        dynamic,
        linesNext,
      });

      lines[currentLineIndex] =
        (textFormated.endsWith("-") &&
          lineCache[lineCache.length - 1] === line) ||
          textFormated.endsWith("--")
          ? textFormated.slice(0, -1)
          : textFormated;
      ++currentLineIndex;
    }
  }

  /**
   * Recursive function for splitting text by width of canvas
   * @param {string[]} lineCache - array of strings which will be pushed to lines array
   * @param {string} cacheWord - part of text which remains to be clipped
   * @param {number} nextLineNum - number of width of line which will be sliced from cacheWord
   * @param {number} currentLineIndex - current index of line in lines array
   * @param {number} linesNext - maximum number of lines
   * @param {string} beforeNewLine - part of text which remains from previous clipping
   * @param {string} cacheLine - part of text which will be sliced
   */
  private splitTextByWidth({
    lineCache,
    cacheWord,
    nextLineNum,
    currentLineIndex,
    linesNext,
    beforeNewLine,
    cacheLine,
  }: {
    lineCache: string[];
    cacheWord: string;
    nextLineNum: number;
    currentLineIndex: number;
    linesNext: number;
    beforeNewLine: string;
    cacheLine: string;
  }) {
    let startNum = 0;

    for (let i = 0; i <= cacheWord.length; i++) {
      if (lineCache.length + currentLineIndex >= linesNext + 1) break;

      const sliceNum = nextLineNum * (i + 1);
      let clipedWord = `${beforeNewLine ?? ""}${cacheLine.slice(startNum, sliceNum)}`;
      startNum = sliceNum;
      const newClipWordIndex = clipedWord.indexOf("\n");

      if (newClipWordIndex !== -1) {
        beforeNewLine = clipedWord;
        clipedWord = clipedWord.slice(0, newClipWordIndex);
        beforeNewLine = beforeNewLine.slice(newClipWordIndex + 1);
      } else beforeNewLine = "";

      lineCache.push(clipedWord);
      cacheWord = cacheWord.slice(clipedWord.length);
    }
  }
}

const canvas_ = createCanvas(760, 410);
const ctx_ = canvas_.getContext("2d");

class GuildProfile extends DrawTextBase {
  canvas: Canvas = canvas_;
  ctx: SKRSContext2D = ctx_;
  /** Just add brackets and you will see the description of the original function */
  sharp: typeof sharp = sharp;
  /**
   * The constructor for the GuildProfile class.
   *
   * @remarks
   * It simply calls the superclass constructor with a function that returns the
   * context of the canvas. This is done to make sure that the context is not
   * overwritten by any other code.
   */
  constructor() {
    super(ctx_);
  }

  /**
   * Loads an image from the given path and resizes it according to the options.
   * If no options are given, the image is not resized.
   *
   * @param {string} imagePath - The path to the image file.
   * @param {LoadImageResize} [resize] - The options for resizing the image.
   * @returns {Promise<Image>} A promise that resolves with the loaded image.
   */
  loadImage(imagePath: string, resize: LoadImageResize): Promise<Image>;
  loadImage(imagePath: string): Promise<Image>;
  async loadImage(imagePath: string, resize?: LoadImageResize): Promise<Image> {
    const buffer = await this.sharp(imagePath).resize(resize?.w, resize?.h, resize?.options).toBuffer();

    return await loadImage(buffer);
  }

  /**
   * Draws the background image on the canvas, with blurring and
   * a fill color applied.
   *
   * @param {Image} img - The image to draw as the background.
   * @param {number} [blurPx=3] - The amount of blur to apply to the image.
   * @param {number} [globalAlpha=0.36] - The global alpha of the image.
   * @param {string|CanvasGradient|CanvasPattern} [fillStyle="black"] - The fill color/style to use.
   * @returns {GuildProfile} The GuildProfile instance, for chaining purposes.
   */
  drawBG(img: Image, blurPx: number = 3, globalAlpha: number = 0.36, fillStyle: string | CanvasGradient | CanvasPattern = "black"): GuildProfile {
    const ctx = this.ctx;
    const { width: w, height: h } = this.canvas;

    ctx.save();
    ctx.filter = blur(blurPx);
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = globalAlpha;
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = fillStyle;
    ctx.restore();

    return this;
  }


  /**
 * Draws a clan icon on the canvas, with a circular clipping path and optional border.
 *
 * @param {Image} icon - The image to draw as the clan icon.
 * @param {Object} options - The options for drawing the icon.
 * @param {number} options.rx - The x-coordinate of the center of the circle.
 * @param {number} options.ry - The y-coordinate of the center of the circle.
 * @param {number} options.rr - The radius of the circle.
 * @param {number} options.ix - The x-coordinate of the top-left of the image.
 * @param {number} options.iy - The y-coordinate of the top-left of the image.
 * @param {string} options.strokeStyle - The color/style of the border.
 * @returns {GuildProfile}
 * @throws {Error} If invalid options are provided.
 */
  drawClanIcon(icon: Image, options: {
    rx: number,
    ry: number,
    rr: number,
    ix: number,
    iy: number,
    strokeStyle: string,
    lineWidth?: number
  }): GuildProfile {
    const { rx, ry, rr, ix, iy, strokeStyle, lineWidth } = options;

    if (!icon || Number.isNaN(rx) || Number.isNaN(ry) || Number.isNaN(rr) || Number.isNaN(ix) || Number.isNaN(iy)) {
      throw new Error("Invalid options provided");
    }

    const ctx = this.ctx;

    ctx.save();
    ctx.beginPath();
    ctx.arc(rx, ry, rr, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(icon, ix, iy);
    ctx.closePath();
    ctx.restore();

    this.drawBorder(rx, ry, rr + 1, strokeStyle, lineWidth ?? 3);

    return this;
  }

  /**
   * Draws a border around a circle on the canvas.
   *
   * @param {number} x - The x-coordinate of the center of the circle.
   * @param {number} y - The y-coordinate of the center of the circle.
   * @param {number} radius - The radius of the circle.
   * @param {string} strokeStyle - The color/style of the border.
   * @returns {void}
   */
  private drawBorder(x: number, y: number, radius: number, strokeStyle: string = "#283120", lineWidth: number): void {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Draws a description box on the canvas, with rounded corners and a gradient fill.
   * Also draws the text inside the box with the given options.
   *
   * @param {number} x - The x-coordinate of the top-left of the box.
   * @param {number} y - The y-coordinate of the top-left of the box.
   * @param {number} width - The width of the box.
   * @param {number} height - The height of the box.
   * @param {string} [outlineColor] - The color of the outline.
   * @param {string} [backgroundColor] - The color of the background.
   * @param {Object} textOptions - The options for drawing the text.
   * @param {number} lineWidth - The width of the outline.
   * @returns {GuildProfile}
   */
  drawClanDescription(
    x: number,
    y: number,
    width: number,
    height: number,
    outlineColor: string = "#283120",
    backgroundColor: string = "#090b08",
    textOptions: { x1: number; x2: number; y: number; text: string; fontOptions: { color: string; size: number }; dynamicOptions: { dynamic: boolean; isClip: boolean; lines: number; lineSpacing: number } },
    lineWidth: number = 3
  ): GuildProfile {
    const ctx = this.ctx;

    ctx.save();
    roundedRect({ ctx, x, y, w: width, h: height, r: 4 });
    ctx.filter = blur(1.1);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.filter = blur();
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    this.drawText(textOptions);
    ctx.restore();

    return this;
  }

  //пока без JSDoc, так как не дописано. Допишу чуть позже
  drawDeputu(
    x: number = 470,
    y: number = 225,
    width: number = 225,
    height: number = 150,
    r: 4,
    rx: number = 500,
    ry: number = 252,
    rr: 20,
    ix: number = 480,
    bgColor: string = "#090b08",
    borderStyle: string = "#283120",
    lineWidth: number = 2,
    blurPx: number = 1.1,
    globalAlpha: number = 0.4,
    deputu: { username: string, avatar: Image, role: string }[]) {
    const ctx = this.ctx;

    ctx.save();
    ctx.beginPath();
    roundedRect({ ctx, x, y, w: width, h: height, r });
    ctx.filter = blur(blurPx);
    ctx.globalAlpha = globalAlpha;
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.globalAlpha = globalAlpha;
    ctx.fill();
    ctx.filter = blur();
    ctx.globalAlpha = 1;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    for (const dp of deputu) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(rx, ry, rr, Math.PI * 2, 0);
      ctx.clip();
      ctx.drawImage(dp.avatar, ix, y - 20);
      ctx.closePath();
      ctx.restore();
      ctx.save();

      ctx.beginPath();
      ctx.arc(rx, ry, rr + 1, Math.PI * 2, 0);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = borderStyle;
      ctx.stroke();
      ctx.closePath();
      ctx.restore();

      //text block
      ctx.save();
      this.drawText({
        x1: rx + 30,
        x2: rx + 208,
        y,
        text: dp.username,
        fontOptions: { size: 17, color: "white" },
        dynamicOptions: { dynamic: true, isClip: true, lines: 0 },
      });
      ctx.restore();

      ctx.save();
      this.drawText({
        x1: rx + 30,
        x2: rx + 200,
        y: y + 16,
        text: dp.role,
        fontOptions: { size: 13, color: "white" },
        dynamicOptions: { dynamic: true, isClip: true, lines: 0 },
      });
      ctx.restore();

      y += 47.5;
    }

    return this;
  }

  //Пока без JSDoc, так как у меня уже голова не варит
  drawLeader() {
    const ctx = this.ctx;

    ctx.save();
    roundedRect({ ctx, x: 470, y: 165, w: 250, h: 50, r: 4 });
    ctx.filter = blur(1.1);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#090b08";
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.filter = blur();
    ctx.globalAlpha = 1;
    ctx.stroke();
    ctx.restore();

    //leader clan avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(500, 190, 20, Math.PI * 2, 0);
    ctx.clip();
    ctx.drawImage(nahidaIconImg, 480, 170);
    ctx.closePath();
    ctx.restore();

    //leader clan avatar - stroke
    ctx.save();
    ctx.beginPath();
    ctx.arc(500, 190, 21, Math.PI * 2, 0);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    //leader clan text
    ctx.save();
    this.drawText({
      x1: 530,
      x2: 708,
      y: 190,
      text: "Nahida",
      dynamicOptions: { dynamic: false, isClip: true, lines: 0 },
      fontOptions: { color: "white", size: 17 },
    });
    ctx.restore();

    ctx.save();
    this.drawText({
      x1: 530,
      x2: 700,
      y: 206,
      text: "Leader",
      fontOptions: { size: 13, color: "white" },
      dynamicOptions: { dynamic: true, isClip: true, lines: 0 },
    });
    ctx.restore();

    return this;
  }

  //Пока без JSDoc, голова не варит
  drawClanName() {
    const ctx = this.ctx;

    ctx.save();
    this.drawText({
      x1: 200,
      x2: 500,
      y: 105,
      text: "Awesome Clan",
      fontOptions: { color: "White", size: 25 },
      dynamicOptions: { isClip: true, lines: 0, dynamic: true },
    });
    ctx.restore();

    return this;
  }

  //Пока без JSDoc, голова не варит
  drawMemberCount() {
    this.drawText({
      x1: 200,
      x2: 450,
      y: 130,
      text: "Members: 50",
      dynamicOptions: { dynamic: false, isClip: true, lines: 0 },
      fontOptions: { size: 20, color: "white" },
    });

    return this;
  }

  //Голова не варит. А так тут будет created & type
  drawClanInfo() {
    const ctx = this.ctx;

    ctx.lineWidth = 2;
    let y = 50;
    const clanInfo = ["Created: 10.05.2020", "Type: Clan"];
    //clan created & type clan & both text
    for (let i = 0; i < 2; i++) {
      if (i === 1) y += 47; //37;

      ctx.save();
      roundedRect({ ctx, x: 540, y, w: 180, h: 37, r: 8 });
      ctx.filter = blur(1.1);
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#090b08"; //"#090b05";//"#00685A";
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.4;
      ctx.fill();
      ctx.filter = blur();
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.restore();

      const size = 13.5;

      ctx.save();
      this.drawText({
        x1: 540,
        x2: 720,
        y: y + 25,
        text: clanInfo[i],
        dynamicOptions: { dynamic: false, isClip: true, lines: 0 },
        textDirect: "center",
        fontOptions: { color: "white", size: i === 0 ? size : size + 3.0 },
      });
      ctx.restore();
    }

    return this;
  }

  /**
   * Returns the rendered image as a PNG buffer.
   *
   * @returns {Buffer} The rendered image as a PNG buffer.
   */
  render(): Buffer { //позже сделаю выбор между png и jpg с перегрузкой метода
    return this.canvas.toBuffer("image/png");
  }
}

async function blueprintGuildProfile() {
  const canvas = createCanvas(760, 410);
  const ctx = canvas.getContext("2d");

  const drawText = async ({
    x1,
    x2 = 0,
    y,
    text,
    textDirect = "normal",
    dynamicOptions,
    fontOptions,
    clipNumber = false,
    timeFormat = false,
    x_translate,
  }: DrawTextOptions) => {
    if (clipNumber) text = numberClip(text);
    if (timeFormat) text = timeFormatter(Number(text));

    const iText: string = `${text}`;
    const dynamic: boolean = dynamicOptions?.dynamic || false;
    const isClip: boolean = dynamicOptions?.isClip || false;
    const linesNext: number = dynamicOptions?.lines ?? 1;
    const lineSpacing: number = dynamicOptions?.lineSpacing ?? 0;
    const dynamicCorrector: number = dynamicOptions?.dynamicCorrector ?? 0;
    const leftText: boolean = textDirect === "left";
    const centerText: boolean = textDirect === "center";
    const maxWidth: number = x2 > 0 ? x2 - x1 : x1;
    const ellipsisWidth: number = ctx.measureText("...").width;
    const dashWidth: number = ctx.measureText("-").width;
    const words: string[] = iText.split(" ");
    const lines: string[] = [""]; //массив строк
    const textMetrics = ctx.measureText(iText);
    const textWidth: number = textMetrics.width;
    const textHeight: number =
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent;
    const isStartEmpty: RegExp = /^\s/;
    let truncatedText: string = iText;
    let currentLineIndex = 0;
    let cacheWord = "";
    let beforeNewLine = "";
    let startNum = 0;
    let x: number = x1;

    if (fontOptions) setFontStyle({ ctx, ...fontOptions });
    if (dynamic || isClip) {
      if (isClip) {
        for (const word of words) {
          const buildLine =
            lines[currentLineIndex] +
            (lines[currentLineIndex] ? " " : "") +
            word;
          const testLine = buildLine.startsWith(" ")
            ? buildLine.slice(1, buildLine.length)
            : buildLine;

          if (currentLineIndex > linesNext) break;
          if (ctx.measureText(testLine).width < maxWidth) {
            const newLineIndex = word.indexOf("\n");

            if (newLineIndex === -1) {
              lines[currentLineIndex] = testLine;
            } else {
              const beforeNewLine = testLine.slice(
                0,
                testLine.length - word.length + newLineIndex,
              );
              const afterNewLine = word.slice(newLineIndex + 1);

              lines[currentLineIndex++] = beforeNewLine;

              if (currentLineIndex <= linesNext)
                lines[currentLineIndex] = afterNewLine;
            }
            continue;
          }

          cacheWord = testLine;

          cacheWord = whileClip(
            ctx,
            cacheWord,
            maxWidth,
            currentLineIndex < linesNext
              ? dashWidth
              : dynamic && currentLineIndex === linesNext
                ? ellipsisWidth + dynamicCorrector
                : 0,
          );
          const cacheWordNewIndex = cacheWord.indexOf("\n");

          if (cacheWordNewIndex !== -1)
            cacheWord = cacheWord.slice(0, cacheWordNewIndex);

          const tLClip = testLine.slice(
            cacheWord.length + (cacheWordNewIndex === -1 ? 0 : 1),
          );
          const testLineClip = tLClip.startsWith("-")
            ? tLClip.slice(1)
            : tLClip;
          const textFormated = textFormater({
            text: testLineClip,
            cache: cacheWord,
            curInd: currentLineIndex,
            dynamic,
            linesNext,
          });
          lines[currentLineIndex] = textFormated.endsWith("--")
            ? textFormated.slice(0, -1)
            : textFormated;
          let cacheLine = isStartEmpty.test(testLineClip)
            ? testLineClip.slice(1)
            : testLineClip;

          ++currentLineIndex;

          if (currentLineIndex <= linesNext) {
            lines[currentLineIndex] = "";

            if (testLineClip.length >= cacheWord.length) {
              const lineCache = [];
              cacheWord = cacheLine;
              const nextLineNum = lines[0].length + 5;

              for (let i = 0; i <= cacheWord.length; i++) {
                if (lineCache.length + currentLineIndex >= linesNext + 1) break;

                const sliceNum = nextLineNum * (i + 1);
                let clipedWord = `${beforeNewLine ?? ""}${cacheLine.slice(startNum, sliceNum)}`;
                startNum = sliceNum;
                const newClipWordIndex = clipedWord.indexOf("\n");

                if (newClipWordIndex !== -1) {
                  beforeNewLine = clipedWord;
                  clipedWord = clipedWord.slice(0, newClipWordIndex);
                  beforeNewLine = beforeNewLine.slice(newClipWordIndex + 1);
                } else beforeNewLine = "";

                lineCache.push(clipedWord);
                cacheWord = cacheWord.slice(clipedWord.length);
              }

              cacheWord = "";
              cacheLine = "";

              for (const line of lineCache) {
                cacheWord = whileClip(
                  ctx,
                  line,
                  maxWidth,
                  currentLineIndex <= linesNext
                    ? dashWidth
                    : dynamic && currentLineIndex === linesNext
                      ? ellipsisWidth + dynamicCorrector
                      : 0,
                );

                const textFormated = textFormater({
                  text: line,
                  cache: cacheWord,
                  curInd: currentLineIndex,
                  dynamic,
                  linesNext,
                });

                lines[currentLineIndex] =
                  (textFormated.endsWith("-") &&
                    lineCache[lineCache.length - 1] === line) ||
                    textFormated.endsWith("--")
                    ? textFormated.slice(0, -1)
                    : textFormated;
                ++currentLineIndex;
              }
            } else lines[currentLineIndex] = testLineClip;
          }
        }
      }

      ctx.save();

      if (x_translate !== undefined) ctx.translate(x_translate, 0);

      if (textWidth > maxWidth && !isClip) {
        while (
          ctx.measureText(truncatedText).width +
          (ellipsisWidth + dynamicCorrector) >
          maxWidth
        ) {
          if (truncatedText.length === 0)
            throw new TypeError("Бесконечный while!");

          truncatedText = truncatedText.slice(0, -1);
        }

        truncatedText = truncatedText === text ? text : `${truncatedText}...`;
      }
    }

    if (leftText) ctx.textAlign = "right";
    if (centerText) (ctx.textAlign = "center"), (x = (x1 + x2) / 2);
    if (isClip) {
      lines.forEach((line, i) => {
        ctx.fillText(line, x, y + i * (textHeight + lineSpacing));
      });

      lines.length = 0;
    } else ctx.fillText(truncatedText, x, y);
    if (leftText || centerText) ctx.textAlign = "start";

    ctx.restore();
  };

  //bg
  const bg = await loadImage(bgAllImg);
  ctx.save();
  ctx.filter = blur(3);
  ctx.globalAlpha = 1;
  ctx.drawImage(bg, 0, 0);
  ctx.globalAlpha = 0.36;
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.restore();

  ctx.lineWidth = 3;

  //avatar clan
  ctx.save();
  ctx.beginPath();

  ctx.arc(115, 115, 70, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(kogasaAvImg, 45, 45);
  ctx.closePath();
  ctx.restore();

  //avatar clan - stroke
  ctx.beginPath();
  ctx.arc(115, 115, 71, 0, Math.PI * 2);
  ctx.strokeStyle = "#283120"; //"#00685A"; //"#5DD0C0";
  ctx.stroke();
  ctx.closePath();

  //description (motto) clan
  ctx.save();
  roundedRect({ ctx, x: 35, y: 225, w: 330, h: 150, r: 4 });
  ctx.filter = blur(1.1);
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#090b08"; //"#090b05";//"#00685A";
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.4;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.filter = blur();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  const drawTexts = new DrawTextBase(ctx);
  drawTexts.drawText({
    x1: 45,
    x2: 360,
    y: 246,
    text: "Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text",
    fontOptions: { color: "white", size: 12 },
    dynamicOptions: { dynamic: true, isClip: true, lines: 6, lineSpacing: 10 },
  });
  ctx.restore();

  //Deputu's bloc clan
  ctx.save();
  ctx.beginPath();
  roundedRect({ ctx, x: 470, y: 225, w: 250, h: 150, r: 4 });
  ctx.filter = blur(1.1);
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#090b08";
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.4;
  ctx.fill();
  ctx.filter = blur();
  ctx.globalAlpha = 1;
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  //Deputu's
  const username = ["Kogasa Tatara", "Tenshi Hinanawi"];
  const deputu: { name: string; avatar: Image; role: string }[] = [];
  const imgDeputu = [kogasaIconImg, tenshiIconImg];
  for (let i = 0; i < 3; i++) {
    const indexNow = random(0, 1);
    deputu.push({
      name: username[indexNow],
      avatar: imgDeputu[indexNow],
      role: "Deputu",
    });
  }

  let y = 252;

  ctx.fillStyle = "black";

  for (const dp of deputu) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(500, y, 20, Math.PI * 2, 0);
    ctx.clip();
    ctx.drawImage(dp.avatar, 480, y - 20);
    ctx.closePath();
    ctx.restore();
    ctx.save();

    ctx.beginPath();
    ctx.arc(500, y, 21, Math.PI * 2, 0);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    //text block
    ctx.save();
    drawText({
      x1: 530,
      x2: 708,
      y,
      text: dp.name,
      fontOptions: { size: 17, color: "white" },
      dynamicOptions: { dynamic: true, isClip: true, lines: 0 },
    });
    ctx.restore();

    ctx.save();
    drawText({
      x1: 530,
      x2: 700,
      y: y + 16,
      text: dp.role,
      fontOptions: { size: 13, color: "white" },
      dynamicOptions: { dynamic: true, isClip: true, lines: 0 },
    });
    ctx.restore();

    y += 47.5;
  }

  //ctx.fillStyle = "#00685A"; //"#1E786C";
  ctx.lineWidth = 2;
  y = 50;
  const clanInfo = ["Created: 10.05.2020", "Type: Clan"];
  //clan created & type clan & both text
  for (let i = 0; i < 2; i++) {
    if (i === 1) y += 47; //37;

    ctx.save();
    roundedRect({ ctx, x: 540, y, w: 180, h: 37, r: 8 });
    ctx.filter = blur(1.1);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#090b08"; //"#090b05";//"#00685A";
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.filter = blur();
    ctx.globalAlpha = 1;
    ctx.stroke();
    ctx.restore();

    const size = 13.5;

    ctx.save();
    drawText({
      x1: 540,
      x2: 720,
      y: y + 25,
      text: clanInfo[i],
      dynamicOptions: { dynamic: false, isClip: true, lines: 0 },
      textDirect: "center",
      fontOptions: { color: "white", size: i === 0 ? size : size + 3.0 },
    });
    ctx.restore();
  }

  //clan name's
  ctx.save();
  drawText({
    x1: 200,
    x2: 500,
    y: 105,
    text: "Awesome Clan",
    fontOptions: { color: "White", size: 25 },
    dynamicOptions: { isClip: true, lines: 0, dynamic: true },
  });

  //clan member's count
  drawText({
    x1: 200,
    x2: 450,
    y: 130,
    text: "Members: 50",
    dynamicOptions: { dynamic: false, isClip: true, lines: 0 },
    fontOptions: { size: 20 },
  });

  //leader clan block
  ctx.save();
  roundedRect({ ctx, x: 470, y: 165, w: 250, h: 50, r: 4 });
  ctx.filter = blur(1.1);
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#090b08";
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.4;
  ctx.fill();
  ctx.filter = blur();
  ctx.globalAlpha = 1;
  ctx.stroke();
  ctx.restore();

  //leader clan avatar
  ctx.save();
  ctx.beginPath();
  ctx.arc(500, 190, 20, Math.PI * 2, 0);
  ctx.clip();
  ctx.drawImage(nahidaIconImg, 480, 170);
  ctx.closePath();
  ctx.restore();

  //leader clan avatar - stroke
  ctx.save();
  ctx.beginPath();
  ctx.arc(500, 190, 21, Math.PI * 2, 0);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  //leader clan text
  ctx.save();
  drawText({
    x1: 530,
    x2: 708,
    y: 190,
    text: "Nahida",
    dynamicOptions: { dynamic: false, isClip: true, lines: 0 },
    fontOptions: { color: "white", size: 17 },
  });
  ctx.restore();

  ctx.save();
  drawText({
    x1: 530,
    x2: 700,
    y: 206,
    text: "Leader",
    fontOptions: { size: 13, color: "white" },
    dynamicOptions: { dynamic: true, isClip: true, lines: 0 },
  });
  ctx.restore();

  //get result
  return canvas.toBuffer("image/png");
}

const clan = {
  name: "Awesome Clan",
  motto: "Together we stand!",
  logoUrl: "./abyss/images/kogasa.png",
  creationDate: "01.01.2020",
  memberCount: 50,
  activityLevel: "Высокая",
  achievements: ["Победа в турнире", "1000 побед", "Лучший клан месяца"],
};
const members = [
  { name: "Kogasa", role: "Leader", avatarUrl: "./abyss/images/kogasa.png" },
  { name: "Kogasa", role: "Leader", avatarUrl: "./abyss/images/kogasa.png" },
  { name: "Kogasa", role: "Leader", avatarUrl: "./abyss/images/kogasa.png" },
  { name: "Kogasa", role: "Leader", avatarUrl: "./abyss/images/kogasa.png" },
  { name: "Kogasa", role: "Leader", avatarUrl: "./abyss/images/kogasa.png" },
];

//const draw = await drawClanProfile(clan);
//const member = await drawMemberList(members);
//const blueprint = await blueprintGuildProfile();
const guildProfile = new GuildProfile();

guildProfile
  .drawBG(bgAllImg)
  .drawClanIcon(kogasaAvImg, { rx: 115, ry: 115, rr: 70, ix: 45, iy: 45, strokeStyle: "#283120" })
  .drawClanInfo()
  .drawClanName()
  .drawMemberCount()
  .drawDeputu(undefined, undefined, undefined, undefined, 4, undefined, undefined, 20, undefined, undefined, undefined, undefined, undefined, undefined, [{ username: "Kogasa", role: "Deputu", avatar: kogasaIconImg }, { username: "Kogasa", role: "Deputu", avatar: kogasaIconImg }, { username: "Kogasa", role: "Deputu", avatar: kogasaIconImg }])
  .drawClanDescription(35, 225, 330, 150, "#283120", "#090b08", {
    x1: 45,
    x2: 360,
    y: 246,
    text: "Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text Some text",
    fontOptions: { color: "white", size: 12 },
    dynamicOptions: { dynamic: true, isClip: true, lines: 6, lineSpacing: 10 }
  });

await sharp(guildProfile.render()).toFile("./abyss/res.tests.png");

const drawText = async ({
  x1,
  x2 = 0,
  y,
  text,
  textDirect = "normal",
  dynamicOptions,
  fontOptions,
  clipNumber = false,
  timeFormat = false,
  x_translate,
}: DrawTextOptions) => {
  if (clipNumber) text = numberClip(text);
  if (timeFormat) text = timeFormatter(Number(text));
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const ctx: any = {};
  const iText: string = `${text}`;
  const dynamic: boolean = dynamicOptions?.dynamic || false;
  const isClip: boolean = dynamicOptions?.isClip || false;
  const linesNext: number = dynamicOptions?.lines ?? 1;
  const lineSpacing: number = dynamicOptions?.lineSpacing ?? 0;
  const dynamicCorrector: number = dynamicOptions?.dynamicCorrector ?? 0;
  const leftText: boolean = textDirect === "left";
  const centerText: boolean = textDirect === "center";
  const maxWidth: number = x2 > 0 ? x2 - x1 : x1;
  const ellipsisWidth: number = ctx.measureText("...").width;
  const dashWidth: number = ctx.measureText("-").width;
  const words: string[] = iText.split(" ");
  const lines: string[] = [""]; //массив строк
  const textMetrics = ctx.measureText(iText);
  const textWidth: number = textMetrics.width;
  const textHeight: number =
    textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
  const isStartEmpty: RegExp = /^\s/;
  let truncatedText: string = iText;
  let currentLineIndex = 0;
  let cacheWord = "";
  let beforeNewLine = "";
  let startNum = 0;
  let x: number = x1;

  if (fontOptions) setFontStyle({ ctx, ...fontOptions });
  if (dynamic || isClip) {
    if (isClip) {
      for (const word of words) {
        const buildLine =
          lines[currentLineIndex] + (lines[currentLineIndex] ? " " : "") + word;
        const testLine = buildLine.startsWith(" ")
          ? buildLine.slice(1, buildLine.length)
          : buildLine;

        if (currentLineIndex > linesNext) break;
        if (ctx.measureText(testLine).width < maxWidth) {
          const newLineIndex = word.indexOf("\n");

          if (newLineIndex === -1) {
            lines[currentLineIndex] = testLine;
          } else {
            const beforeNewLine = testLine.slice(
              0,
              testLine.length - word.length + newLineIndex,
            );
            const afterNewLine = word.slice(newLineIndex + 1);

            lines[currentLineIndex++] = beforeNewLine;

            if (currentLineIndex <= linesNext)
              lines[currentLineIndex] = afterNewLine;
          }
          continue;
        }

        cacheWord = testLine;

        cacheWord = whileClip(
          ctx,
          cacheWord,
          maxWidth,
          currentLineIndex < linesNext
            ? dashWidth
            : dynamic && currentLineIndex === linesNext
              ? ellipsisWidth + dynamicCorrector
              : 0,
        );
        const cacheWordNewIndex = cacheWord.indexOf("\n");

        if (cacheWordNewIndex !== -1)
          cacheWord = cacheWord.slice(0, cacheWordNewIndex);

        const tLClip = testLine.slice(
          cacheWord.length + (cacheWordNewIndex === -1 ? 0 : 1),
        );
        const testLineClip = tLClip.startsWith("-") ? tLClip.slice(1) : tLClip;
        const textFormated = textFormater({
          text: testLineClip,
          cache: cacheWord,
          curInd: currentLineIndex,
          dynamic,
          linesNext,
        });
        lines[currentLineIndex] = textFormated.endsWith("--")
          ? textFormated.slice(0, -1)
          : textFormated;
        let cacheLine = isStartEmpty.test(testLineClip)
          ? testLineClip.slice(1)
          : testLineClip;

        ++currentLineIndex;

        if (currentLineIndex <= linesNext) {
          lines[currentLineIndex] = "";

          if (testLineClip.length >= cacheWord.length) {
            const lineCache = [];
            cacheWord = cacheLine;
            const nextLineNum = lines[0].length + 5;

            for (let i = 0; i <= cacheWord.length; i++) {
              if (lineCache.length + currentLineIndex >= linesNext + 1) break;

              const sliceNum = nextLineNum * (i + 1);
              let clipedWord = `${beforeNewLine ?? ""}${cacheLine.slice(startNum, sliceNum)}`;
              startNum = sliceNum;
              const newClipWordIndex = clipedWord.indexOf("\n");

              if (newClipWordIndex !== -1) {
                beforeNewLine = clipedWord;
                clipedWord = clipedWord.slice(0, newClipWordIndex);
                beforeNewLine = beforeNewLine.slice(newClipWordIndex + 1);
              } else beforeNewLine = "";

              lineCache.push(clipedWord);
              cacheWord = cacheWord.slice(clipedWord.length);
            }

            cacheWord = "";
            cacheLine = "";

            for (const line of lineCache) {
              cacheWord = whileClip(
                ctx,
                line,
                maxWidth,
                currentLineIndex <= linesNext
                  ? dashWidth
                  : dynamic && currentLineIndex === linesNext
                    ? ellipsisWidth + dynamicCorrector
                    : 0,
              );

              const textFormated = textFormater({
                text: line,
                cache: cacheWord,
                curInd: currentLineIndex,
                dynamic,
                linesNext,
              });

              lines[currentLineIndex] =
                (textFormated.endsWith("-") &&
                  lineCache[lineCache.length - 1] === line) ||
                  textFormated.endsWith("--")
                  ? textFormated.slice(0, -1)
                  : textFormated;
              ++currentLineIndex;
            }
          } else lines[currentLineIndex] = testLineClip;
        }
      }
    }

    ctx.save();

    if (x_translate !== undefined) ctx.translate(x_translate, 0);

    if (textWidth > maxWidth && !isClip) {
      while (
        ctx.measureText(truncatedText).width +
        (ellipsisWidth + dynamicCorrector) >
        maxWidth
      ) {
        if (truncatedText.length === 0)
          throw new TypeError("Бесконечный while!");

        truncatedText = truncatedText.slice(0, -1);
      }

      truncatedText = truncatedText === text ? text : `${truncatedText}...`;
    }
  }

  if (leftText) ctx.textAlign = "right";
  if (centerText) (ctx.textAlign = "center"), (x = (x1 + x2) / 2);
  if (isClip) {
    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + i * (textHeight + lineSpacing));
    });

    lines.length = 0;
  } else ctx.fillText(truncatedText, x, y);
  if (leftText || centerText) ctx.textAlign = "start";

  ctx.restore();
};
