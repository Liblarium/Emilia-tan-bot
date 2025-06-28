import { LogType } from "@emilia-tan/config";
import type { LoggerData, LoggerType } from "@emilia-tan/types";
import type {
  // type CanvasTextAlign,
  // createCanvas,
  // GlobalFonts,
  SKRSContext2D,
} from "@napi-rs/canvas";

//import sharp from "sharp";

// W.I.P
// --- Типи ---

interface FontOptions {
  family: string;
  size: number;
  weight?: "normal" | "bold" | "lighter" | "bolder" | number;
  style?: "normal" | "italic" | "oblique";
}

interface DrawTextOptions {
  x1: number;
  x2?: number;
  y: number;
  x_translate?: number;
  text: string | number;
  textDirect?: "normal" | "center" | "left";
  fontOptions?: FontOptions;
  clipNumber?: boolean;
  timeFormat?: boolean;
  dynamicOptions?: DrawDynamicOptions;
}

interface DrawDynamicOptions {
  dynamic?: boolean;
  isClip?: boolean;
  lines?: number;
  lineSpacing?: number;
  dynamicCorrector?: number;
}

interface DrawTextsOption {
  update?: Partial<DrawTextOptions>;
  start?: number;
  end?: number;
  dynamicOptions?: DynamicOptionDrawsText[];
}

interface DynamicOptionDrawsText {
  update: Partial<DrawTextOptions>;
  start?: number;
  end?: number;
  cache?: boolean;
}

// --- BaseDraw ---

class BaseDraw {
  //private readonly textService: TextDrawingService;

  constructor(public readonly ctx: SKRSContext2D) {
    //this.textService = new TextDrawingService(ctx);
  }

  public get font(): string {
    return this.ctx.font;
  }

  /**
   * Sets the font for all drawing operations.
   *
   * @param {FontOptions} font - Font options to set.
   * @throws {TypeError} If the font options are invalid.
   * @remarks
   * The font options must contain both the size and family properties.
   * The size property must be a number and the family property must be a string.
   * The font options will be validated when set.
   */
  public set font(font: FontOptions) {
    if (typeof font?.size !== "number" || typeof font?.family !== "string")
      throw new TypeError(
        "[font]: Invalid font options! 'size' must be a number, 'family' must be a string."
      );

    const weightMask = /(normal|bold|lighter|bolder|[1-9]00)/i;
    const styleMask = /(normal|italic|oblique)/i;

    if (font.weight && !weightMask.test(font.weight.toString()))
      throw new TypeError(`[font]: Invalid font weight: ${font.weight}`);

    if (font.style && !styleMask.test(font.style.toString()))
      throw new TypeError(`[font]: Invalid font style: ${font.style}`);

    const fontParts = [font.weight ?? "", font.style ?? "", `${font.size}px ${font.family}`]
      .filter(Boolean)
      .join(" ");

    this.ctx.font = fontParts;
  }

  public drawText(options: DrawTextOptions, debug = false) {
    //this.textService.drawText(options, debug);
    return this;
  }

  public drawTexts(args: DrawTextOptions[], options?: DrawTextOptions) {
    //this.textService.drawTexts(args, options);
    return this;
  }
}

class TextLayout {
  constructor(private readonly ctx: SKRSContext2D) {}

  public layoutText(text: string, maxWidth: number, options: DrawDynamicOptions = {}): string[] {
    const clip = options.isClip === true;
    const dynamic = options.dynamic === true;

    if (!clip && dynamic) {
    }
    return [];
  }
}

interface WrapChunk {
  text: string;
  width?: number;
  isBreakable?: boolean;
  forceBreakAfter?: boolean;
  metadata?: Record<string, unknown>;
}

interface WrapLine {
  chunks: WrapChunk[];
  totalWidth: number;
}

interface WrapResult {
  lines: WrapLine[];
  totalHeight: number;
}

interface WrapOptions {
  maxWidth: number;
  lineHeight: number;
  /** Hyphen char on line-breaks for long unbreakable chunks. Default: `-` */
  hyphenChar?: string;
  symbols?: WrapSymbols;
  measure(chunk: string): number;
  shouldBreak?(chunk: string): boolean;
  onLineBreak?(line: WrapLine): void;
}

interface WrapSymbols {
  hyphen?: string; // зазвичай | usually "-"
  ellipsis?: string; // зазвичай | usually "…"
  nonBreakSpace?: string; // напр. "\u00A0"
}

class WrapEngine {
  private readonly measureCache = new Map<string, number>();

  constructor(
    private readonly options: WrapOptions,
    private readonly logger?: LoggerType
  ) {}

  public async debug(message: LoggerData) {
    await this.log(message, LogType.Debug);
  }

  // Основний метод для обгортання тексту | Basic method for wrapping text
  public wrapText(chunks: WrapChunk[]): WrapResult {
    const lines: WrapLine[] = [];
    const currentLine: WrapLine = { chunks: [], totalWidth: 0 };

    for (const chunk of chunks) {
      const chunkWidth = this.getChunkWidth(chunk);

      const chunksToAdd =
        chunkWidth > this.options.maxWidth && !chunk.isBreakable ? this.breakChunk(chunk) : [chunk];

      for (const c of chunksToAdd) {
        this.addChunkToLine(c, lines, currentLine);
      }
    }

    if (currentLine.chunks.length > 0) {
      this.options.onLineBreak?.(currentLine);
      lines.push(currentLine);
    }

    return {
      lines,
      totalHeight: lines.length * this.options.lineHeight,
    };
  }

  // Розбиваємо довгий chunk по символах з fallback-гіфенізацією | Breaking down a long chunk by characters with fallback hyphenation
  public breakChunk(chunk: WrapChunk): WrapChunk[] {
    if (chunk.text === "") return [];

    const result: WrapChunk[] = [];
    const hyphen = this.options.hyphenChar ?? "-";
    const { maxWidth } = this.options;

    let currentText = "";
    let currentWidth = 0;

    for (let i = 0; i < chunk.text.length; i++) {
      const char = chunk.text[i];
      const charWidth = this.getChunkWidth({ text: char });

      if (currentWidth + charWidth > maxWidth) {
        // пушимо накопичене + гіфен
        result.push({
          text: currentText + hyphen,
          width: currentWidth,
          isBreakable: true,
        });
        // !!! повторюємо цей символ заново
        currentText = "";
        currentWidth = 0;
        i--; // retry current char
        continue;
      }

      currentText += char;
      currentWidth += charWidth;
    }

    // фінальний шматок без гіфена
    if (currentText.length > 0) {
      result.push({
        text: currentText,
        width: currentWidth,
        isBreakable: true,
      });
    }

    return result;
  }

  private async log(message: LoggerData, type: LogType = LogType.Info) {
    switch (type) {
      case LogType.Info:
        (await this.logger?.info(message)) ?? console.info(message);
        break;
      case LogType.Error:
        (await this.logger?.error(message)) ?? console.error(message);
        break;
      case LogType.Debug:
        (await this.logger?.debug(message)) ?? console.debug(message);
        break;
      case LogType.Warning:
        (await this.logger?.warning(message)) ?? console.warn(message);
        break;
      default:
        console.log(message);
    }
  }

  private addChunkToLine(chunk: WrapChunk, lines: WrapLine[], currentLine: WrapLine): void {
    const cWidth = this.getChunkWidth(chunk);

    if (currentLine.totalWidth + cWidth > this.options.maxWidth)
      this.finalizeLine(lines, currentLine);

    currentLine.chunks.push(chunk);
    currentLine.totalWidth += cWidth;

    if (chunk.forceBreakAfter) this.finalizeLine(lines, currentLine);
  }

  private finalizeLine(lines: WrapLine[], currentLine: WrapLine): void {
    this.options.onLineBreak?.(currentLine);

    lines.push({ ...currentLine });
    currentLine.chunks.length = 0;
    currentLine.totalWidth = 0;
  }

  // Отримуємо ширину з кешем | Getting the width with the cache
  private getChunkWidth(chunk: Omit<WrapChunk, "width"> & { width?: number }): number {
    if (chunk.width !== undefined) return chunk.width;

    if (this.measureCache.has(chunk.text)) return this.measureCache.get(chunk.text) ?? -1;

    const width = this.options.measure(chunk.text);
    this.measureCache.set(chunk.text, width);

    return width;
  }
}

// грубий тест без канвасу, чисто wrap

const engine = new WrapEngine({
  maxWidth: 50,
  lineHeight: 20,
  measure: (str) => str.length * 8, // наприклад 8px на символ
  hyphenChar: "~",
  onLineBreak: (line) => console.log("Line break:", line),
});

const text = "Це_дуже_велике_слово_що_я_не_буду_розбивати_на_пробели_чи_коми";

const chunks: WrapChunk[] = [
  {
    text,
    width: undefined,
    isBreakable: false,
  },
];

const result = engine.wrapText(chunks);

console.log("== WRAP RESULT ==");

for (const line of result.lines) {
  console.log(line.chunks.map((c) => c.text).join(""), "| width:", line.totalWidth);
}

//

// --- TextLayout ---

// class TextLayout {
//   constructor(private ctx: SKRSContext2D) {}

//   public layoutText(text: string, maxWidth: number, options: DrawDynamicOptions = {}): string[] {
//     const shouldWrap = options.dynamic === true;

//     if (!shouldWrap) return [text];

//     const corrector = options.dynamicCorrector ?? 0;
//     const maxAllowedWidth = maxWidth - corrector;

//     const words = text.split(" ");
//     const lines: string[] = [""];
//     let current = 0;

//     for (const word of words) {
//       const test = lines[current] + (lines[current] ? " " : "") + word;
//       const isOverflow = this.ctx.measureText(test).width > maxAllowedWidth;

//       if (isOverflow) {
//         if (options.lines !== undefined && lines.length >= options.lines) break;
//         lines[++current] = word;
//       } else {
//         lines[current] = test;
//       }
//     }

//     return lines;
//   }

/*public layoutText(text: string, maxWidth: number, options: DrawDynamicOptions = {}): string[] {
    const words = text.split(" ");
    const lines: string[] = [""];
    let current = 0;

    for (const word of words) {
      const testLine = lines[current] + (lines[current] ? " " : "") + word;

      if (this.ctx.measureText(testLine).width < maxWidth) {
        lines[current] = testLine;
      } else {
        current++;
        if (options.lines !== undefined && current > options.lines) break;
        lines[current] = word;
      }
    }

    return lines;
  }*/
//}

// --- TextRenderer ---

// class TextRenderer {
//   constructor(private ctx: SKRSContext2D) {}

//   public draw(
//     lines: string[],
//     x: number,
//     y: number,
//     textHeight: number,
//     lineSpacing: number,
//     align: CanvasTextAlign = "start",
//     debug: boolean = false
//   ): void {
//     const originalAlign = this.ctx.textAlign;
//     this.ctx.textAlign = align;

//     lines.forEach((line, i) => {
//       const yOffset = y + i * (textHeight + lineSpacing);
//       this.ctx.fillText(line, x, yOffset);

//       if (debug) {
//         const width = this.ctx.measureText(line).width;
//         this.ctx.strokeStyle = "red";
//         this.ctx.strokeRect(x, yOffset - textHeight, width, textHeight);
//       }
//     });

//     this.ctx.textAlign = originalAlign;
//   }
// }

// --- DynamicUpdater ---

// class DynamicUpdater {
//   constructor(
//     private layout: TextLayout,
//     private ctx: SKRSContext2D
//   ) {}

//   public processText(options: DrawTextOptions): string[] {
//     const maxWidth = options.x2 ? options.x2 - options.x1 : options.x1;

//     if (options.fontOptions) {
//       const font = options.fontOptions;
//       this.ctx.font =
//         `${font.weight ?? ""} ${font.style ?? ""} ${font.size}px ${font.family}`.trim();
//     }

//     const text = `${options.text}`;
//     const dynamic = options.dynamicOptions;

//     if (dynamic?.isClip || dynamic?.dynamic) {
//       return this.layout.layoutText(text, maxWidth, dynamic);
//     }

//     return [text];
//   }
// }

// --- TextDrawingService ---

// class TextDrawingService {
//   private layout: TextLayout;
//   private renderer: TextRenderer;
//   private updater: DynamicUpdater;

//   constructor(private ctx: SKRSContext2D) {
//     this.layout = new TextLayout(ctx);
//     this.renderer = new TextRenderer(ctx);
//     this.updater = new DynamicUpdater(this.layout, ctx);
//   }

//   public drawText(options: DrawTextOptions, debug: boolean = false): void {
//     const lines = this.updater.processText(options);
//     const textMetrics = this.ctx.measureText(lines[0]);
//     const height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

//     let x = options.x1;
//     let align: CanvasTextAlign = "start";

//     if (options.textDirect === "center") {
//       x = (options.x1 + (options.x2 ?? options.x1)) / 2;
//       align = "center";
//     } else if (options.textDirect === "left") {
//       align = "right";
//     }

//     this.renderer.draw(
//       lines,
//       x,
//       options.y,
//       height,
//       options.dynamicOptions?.lineSpacing ?? 0,
//       align,
//       debug
//     );
//   }

//   public drawTexts(args: DrawTextOptions[], options?: DrawTextsOption): void {
//     let index = 0;
//     let cache: Partial<DrawTextOptions> = {};

//     for (let i = 0; i < args.length; i++) {
//       let data = args[i];

//       if (options) {
//         const dynamic = options.dynamicOptions;
//         const forDynamic = dynamic ? dynamic[index] : options;
//         const start = forDynamic?.start ?? 0;
//         const end = forDynamic?.end ?? args.length - 1;
//         const update = forDynamic?.update ?? {};
//         const isCache = dynamic ? dynamic[index]?.cache || false : false;

//         if (!cache) cache = update;
//         if (isCache) cache = { ...cache, ...update };
//         if (i >= start && i <= end) data = { ...data, ...cache };
//         if (i === end && dynamic) index++;
//       }

//       this.drawText(data);
//     }
//   }
// }

// --- test ---

/*const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");

const baseDraw = new BaseDraw(ctx);

baseDraw.font = { size: 12, family: "Arial" };
baseDraw.text.drawText({
  x1: 10,
  x2: 190,
  y: 100,
  dynamicOptions: { isClip: true, lines: 5, dynamic: true, dynamicCorrector: -20 },
  text: "Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!Helloworld!",
});

sharp(baseDraw.ctx.canvas.toBuffer("image/png")).toFile("./res.png");
console.log("done");*/

//

//

//

//

//

//

//

//

//

// class BaseDraw {
//   public readonly ctx: SKRSContext2D;

//   protected readonly registeredFonts: Map<string, FontRegistry> = new Map();
//   protected readonly registeredImages: Map<string, ImageBitmap> = new Map();
//   protected readonly registeredPatterns: Map<string, CanvasPattern> = new Map();
//   protected readonly registeredGradients: Map<string, CanvasGradient> = new Map();
//   protected readonly registeredPaths: Map<string, Path2D> = new Map();

//   protected debug: boolean;
//   protected _strictMode: boolean;

//   constructor({ width, height, strictMode = false, debug = false }: BaseDrawConfig) {
//     this.ctx = createCanvas(width, height).getContext("2d");
//     this._strictMode = strictMode;
//     this.debug = debug;

//     Object.freeze(this.ctx);

//     if (this._strictMode) this.freezeStrictMode();
//   }

//   /**
//    * Whether debug mode is enabled
//    * @type {boolean}
//    */
//   public get debugMode() {
//     return this.debug;
//   }

//   /**
//    * Sets the debug mode.
//    * @param value A boolean indicating whether to enable or disable debug mode.
//    */
//   public set debugMode(value: boolean) {
//     this.debug = value;
//   }

//   /**
//    * Indicates if strict mode is enabled.
//    *
//    * In strict mode, certain operations will be enforced to ensure consistency and reliability.
//    *
//    * **By default, strict mode is disabled.**
//    *
//    * This mode can only be enabled during instantiation and cannot be disabled afterwards.
//    *
//    * @returns {boolean} True if strict mode is enabled, false otherwise.
//    */
//   public get strictMode(): boolean {
//     return this._strictMode;
//   }

//   /**
//    * Set strict mode
//    *
//    * **Warning**: This is not recommended if you don't know what you are doing
//    *
//    * Once enabled, strict mode cannot be disabled. Use with caution
//    */
//   public set strictMode(value: boolean) {
//     if (value !== true) {
//       console.warn("[BaseDraw] strictMode може бути лише true. Вимкнення не підтримується.");

//       return;
//     }

//     console.info("[BaseDraw] strictMode активовано. Всі параметри будуть жорстко перевірятись.");

//     this.freezeStrictMode();
//   }

//   /**
//    * Freeze strict mode in place to prevent accidental disabling.
//    *
//    * @private
//    * @remarks
//    * This method is called automatically when enabling strict mode.
//    *
//    * You should not call this method directly as it is not part of the public API.
//    */
//   private freezeStrictMode() {
//     Object.defineProperty(this, "_strictMode", { value: true, writable: false });
//   }

//   registerFont({ family, path, uid, _private = false }: RegisterFont) {
//     const familyName = family ?? path.slice(0, path.lastIndexOf("/"));

//     if (!this.registeredFonts.has(familyName))
//       this.registeredFonts.set(familyName, {
//         path,
//         family: familyName,
//         uid,
//         private: _private,
//       });

//     GlobalFonts.registerFromPath(path, familyName);
//   }

//   /**
//    * Sets the font for all drawing operations.
//    *
//    * @param {FontOptions} font - Font options to set.
//    * @throws {TypeError} If the font options are invalid.
//    * @remarks
//    * The font options must contain both the size and family properties.
//    * The size property must be a number and the family property must be a string.
//    * The font options will be validated when set.
//    */
//   public set font(font: FontOptions) {
//     if (typeof font?.size !== "number" || typeof font?.family !== "string")
//       throw new TypeError(
//         "[font]: Invalid font options! 'size' must be a number, 'family' must be a string."
//       );

//     const weightMask = /(normal|bold|lighter|bolder|[1-9]00)/i;
//     const styleMask = /(normal|italic|oblique)/i;

//     if (font.weight && !weightMask.test(font.weight.toString()))
//       throw new TypeError(`[font]: Invalid font weight: ${font.weight}`);

//     if (font.style && !styleMask.test(font.style.toString()))
//       throw new TypeError(`[font]: Invalid font style: ${font.style}`);

//     const fontParts = [font.weight ?? "", font.style ?? "", `${font.size}px ${font.family}`]
//       .filter(Boolean)
//       .join(" ");

//     this.ctx.font = fontParts;
//   }

//   /**
//    * Get the current font.
//    *
//    * @returns The current font string.
//    * @remarks
//    * The format of the font string is: `${size}px ${family}`.
//    * The size is a number and the family is a string.
//    */
//   public get font(): string {
//     return this.ctx.font;
//   }

//   drawText({
//     text,
//     position,
//     globalAlpha,
//     style = FontStyle.FILL,
//     shadow,
//     rotation,
//     restorePrevious = false,
//   }: {
//     text: string;
//     position: Position;
//     style?: FontStyle;
//     globalAlpha?: number;
//     shadow?: ShadowOptions;
//     rotation?: number;
//     restorePrevious?: boolean;
//   }) {
//     const ctx = this.ctx;
//     const prevState: PreviousState | null = restorePrevious
//       ? {
//           globalAlpha: ctx.globalAlpha,
//           shadowColor: ctx.shadowColor,
//           shadowBlur: ctx.shadowBlur,
//           shadowOffsetX: ctx.shadowOffsetX,
//           shadowOffsetY: ctx.shadowOffsetY,
//         }
//       : null;

//     if (shadow) {
//       ctx.shadowColor = shadow.color ?? "#000000";
//       ctx.shadowBlur = shadow.blur ?? 0;
//       ctx.shadowOffsetX = shadow.offsetX ?? 0;
//       ctx.shadowOffsetY = shadow.offsetY ?? 0;
//     }

//     if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;
//     if (rotation && rotation !== 0) ctx.rotate(rotation);
//     if (style) this.drawStyle(style);

//     ctx.fillText(text, position.x, position.y);

//     if (restorePrevious && prevState) Object.assign(ctx, prevState);
//   }

//   drawWrappedText(options: DrawTextOptions) {
//     const ctx = this.ctx;

//     // Визначаємо стартовий розмір шрифту
//     let fontSize = options.font.size;

//     // Якщо autoShrinkStep є, шукаємо кращий розмір
//     if (options.autoShrinkStep) {
//       fontSize = findBestFontSize(
//         ctx,
//         options.text,
//         options.font.family,
//         fontSize,
//         options.maxWidth ?? Number.POSITIVE_INFINITY,
//         options.maxHeight,
//         options.autoShrinkStep
//       );
//     }

//     // Встановлюємо шрифт
//     this.font = { ...options.font, size: fontSize };

//     // Робимо wrap
//     const lines = wrapText(ctx, options.text, {
//       maxWidth: options.maxWidth ?? Number.POSITIVE_INFINITY,
//       breakOn: options.breakOn,
//     });

//     let y = options.y;
//     const lineHeight = fontSize * 1.2;

//     for (let line of lines) {
//       // Якщо увімкнено обрізання і ширина лінії перевищує maxWidth
//       if (options.clipOverflow && options.maxWidth !== undefined) {
//         line = clipText(ctx, line, options.maxWidth, options.ellipsis);
//       }

//       this.drawText({
//         text: line,
//         position: { x: options.x, y },
//         style: options.style,
//         globalAlpha: options.globalAlpha,
//         shadow: options.shadow,
//         rotation: options.rotation,
//       });

//       y += lineHeight;

//       if (options.maxHeight && y > options.y + options.maxHeight) break;
//     }
//   }

//   private drawStyle(style: FontStyle) {
//     if ([FontStyle.FILL, FontStyle.BOTH].includes(style)) this.ctx.fill();
//     if ([FontStyle.STROKE, FontStyle.BOTH].includes(style)) this.ctx.stroke();
//   }
// }

// function clipText(ctx: SKRSContext2D, text: string, maxWidth: number, ellipsis = "..."): string {
//   if (ctx.measureText(text).width <= maxWidth) return text;

//   let clipped = text;

//   while (ctx.measureText(clipped + ellipsis).width > maxWidth && clipped.length > 0) {
//     clipped = clipped.slice(0, -1);

//     if (clipped.length === 0) throw new TypeError("Infinite while in clipText!");
//   }

//   return clipped + ellipsis;
// }

// function findBestFontSize(
//   ctx: SKRSContext2D,
//   text: string,
//   fontFamily: string,
//   initialSize: number,
//   maxWidth: number,
//   maxHeight: number | undefined,
//   autoShrinkStep: number,
//   minSizeOffset: number = 15
// ): number {
//   let size = initialSize;
//   const minSize = initialSize - minSizeOffset;

//   ctx.font = `${size}px ${fontFamily}`;
//   let metrics = ctx.measureText(text);

//   while ((metrics.width > maxWidth || (maxHeight && size * 1.2 > maxHeight)) && size > minSize) {
//     size -= autoShrinkStep;
//     ctx.font = `${size}px ${fontFamily}`;
//     metrics = ctx.measureText(text);
//   }

//   return size;
// }

// function normalizeAndValidateTextOptions(
//   options: DrawTextOptions,
//   registeredFonts?: Map<string, FontRegistry>,
//   strict: boolean = false
// ): DrawTextOptions {
//   const errors: string[] = [];

//   // ellipsis
//   if (options.ellipsis !== undefined) {
//     const len = options.ellipsis.length;
//     if (len < 1 || len > 5) {
//       const msg = `'ellipsis' має бути від 1 до 5 символів. Зараз: ${len}`;
//       if (strict) errors.push(msg);
//       else console.warn(`[drawText] ${msg}`);
//     }
//   }

//   // breakOn
//   if (options.breakOn !== undefined) {
//     const breakStr = typeof options.breakOn === "string" ? options.breakOn : options.breakOn.source;
//     const len = breakStr.length;
//     if (len < 1 || len > 5) {
//       const msg = `'breakOn' має бути від 1 до 5 символів. Зараз: ${len}`;
//       if (strict) errors.push(msg);
//       else console.warn(`[drawText] ${msg}`);
//     }
//   }

//   // font
//   if (registeredFonts && !registeredFonts.has(options.font.family)) {
//     const msg = `Шрифт "${options.font.family}" не зареєстрований.`;
//     if (strict) errors.push(msg);
//     else console.warn(`[drawText] ${msg}`);
//   }

//   if (errors.length > 0) {
//     throw new Error(`[drawText] Некоректні параметри:\n• ${errors.join("\n• ")}`);
//   }

//   return options;
// }

// function validateTextOptions(options: DrawTextOptions) {
//   const ellipsisActive = typeof options.ellipsis === "string";
//   const overflowControl = options.wrap || options.clipOverflow;

//   if (ellipsisActive && !overflowControl && process.env.NODE_ENV === "development")
//     console.warn(
//       `[drawText] 'ellipsis' задано, але wrap та clipOverflow вимкнені — текст не буде обрізатись, і 'ellipsis' не застосується.`
//     );

//   return options;
// }

// function truncateText(
//   ctx: SKRSContext2D,
//   text: string,
//   maxWidth: number,
//   ellipsis = "..."
// ): string {
//   if (ctx.measureText(text).width <= maxWidth) return text;

//   // Розбиваємо на речення (крапка, !, ? + пробіл)
//   const sentences = text.split(/(?<=[.!?])\s+/);
//   let result = "";
//   let currentWidth = 0;

//   for (const sentence of sentences) {
//     const sentenceWidth = ctx.measureText(sentence).width;

//     if (currentWidth + sentenceWidth <= maxWidth) {
//       result += (result ? " " : "") + sentence;
//       currentWidth += sentenceWidth + ctx.measureText(" ").width; // враховуємо пробіл
//     } else {
//       // Останнє речення, що не влазить повністю
//       let partial = "";

//       for (const char of sentence) {
//         const testStr = partial + char;
//         const testWidth = ctx.measureText(testStr + ellipsis).width;

//         if (currentWidth + testWidth <= maxWidth * 0.5) {
//           // Нарощуємо, поки ширина не перевищить половину maxWidth
//           partial = testStr;
//         } else {
//           break;
//         }
//       }

//       // Якщо нічого не вмістилось, то обрізаємо з ellipsis просто до maxWidth
//       if (!partial) {
//         let truncated = "";

//         for (const textCharacter of sentence) {
//           const testStr = truncated + textCharacter;

//           if (ctx.measureText(testStr + ellipsis).width <= maxWidth) truncated = testStr;
//           else break;
//         }

//         return result + (result ? " " : "") + truncated + ellipsis;
//       }

//       return result + (result ? " " : "") + partial + ellipsis;
//     }
//   }

//   return result; // якщо весь текст влазить
// }

// function wrapText(ctx: SKRSContext2D, text: string, options: WrapOptions): string[] {
//   const { maxWidth, breakOn = " " } = options;

//   const lines: string[] = [];
//   const paragraphs = text.split(/\n/); // спочатку розбиваємо по рядках

//   for (const paragraph of paragraphs) {
//     const words = paragraph.split(breakOn);
//     let line = "";

//     for (const word of words) {
//       const testLine = line ? line + breakOn + word : word;
//       const metrics = ctx.measureText(testLine);

//       if (metrics.width > maxWidth && line) {
//         lines.push(line);
//         line = word;
//       } else {
//         line = testLine;
//       }
//     }

//     if (line) lines.push(line);
//   }

//   return lines;
// }

// type Position = { x: number; y: number };

// enum FontStyle {
//   FILL = "fill",
//   STROKE = "stroke",
//   BOTH = "both",
// }

// interface BaseDrawConfig {
//   width: number;
//   height: number;
//   strictMode?: boolean;
//   debug?: boolean;
// }

// interface WrapOptions {
//   maxWidth: number;
//   breakOn?: string | RegExp; // роздільник для переносу (за замовчуванням — /n)
// }

// interface RegisterFont {
//   path: string;
//   uid: string;
//   family?: string;
//   _private?: boolean;
// }

// interface FontRegistry {
//   path: string;
//   family: string;
//   uid: string; // той, хто завантажив
//   private?: boolean; // чи дозволяти іншим використовувати його
// }

// interface FontOptions {
//   family: string;
//   size: number;
//   weight?: "normal" | "bold" | "lighter" | "bolder" | number;
//   style?: "normal" | "italic" | "oblique";
//   [key: string]: string | number | undefined;
// }

// interface ShadowOptions {
//   blur?: number;
//   color?: string;
//   offsetX?: number;
//   offsetY?: number;
// }

// export interface PositionOptions {
//   x: number;
//   y: number;
//   maxWidth?: number;
//   maxHeight?: number;
// }

// export interface VisualOptions {
//   font: FontOptions;
//   color?: string;
//   style?: FontStyle;
// }

// export interface WrappingOptions {
//   wrap?: boolean;
//   breakOn?: string | RegExp;
// }

// export interface ClippingOptions {
//   ellipsis?: string;
//   clipOverflow?: boolean;
// }

// export interface DynamicOptions {
//   autoShrinkStep?: number;
// }

// export interface EffectOptions {
//   shadow?: ShadowOptions;
//   globalAlpha?: number;
//   rotation?: number;
// }

// export interface DrawTextOptions
//   extends PositionOptions,
//     VisualOptions,
//     WrappingOptions,
//     ClippingOptions,
//     DynamicOptions,
//     EffectOptions {
//   text: string;
//   cacheKey?: string;
// }

// interface PreviousState {
//   globalAlpha: number;
//   shadowColor: string;
//   shadowBlur: number;
//   shadowOffsetX: number;
//   shadowOffsetY: number;
// }
