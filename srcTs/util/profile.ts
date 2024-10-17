import {
  type Canvas,
  Image,
  type SKRSContext2D,
  createCanvas,
} from "@napi-rs/canvas";
import type { ProfileTypes } from "@type/util/profile";
import { EmiliaTypeError } from "@util/s";
import sharp from "sharp";
// TODO: Реализовать поддержку большого количества картинок
// TODO: Реализовать настройку профиля через JSON
export class Profile {
  canvas: Canvas;
  ctx: SKRSContext2D;
  fonts = {
    size: "20px",
    font: "Arial",
  };
  /**
   * Для более подробной информации - гляди на основную sharp функцию ;D (просто добавь скобки)
   *
   * Или на саму документацию библиотеки `sharp.js` (это библиотека для работы с изображениями)
   */
  _sharp = sharp;

  constructor() {
    this.canvas = createCanvas(1000, 700);
    this.ctx = this.canvas.getContext("2d");
  }

  drawBG(): Profile;
  drawBG(options: ProfileTypes.DrawBGTypeAllOne): Profile;
  drawBG(options: ProfileTypes.DrawBGTypeFull): Profile;
  drawBG(options: ProfileTypes.DrawBGDrawTypeColor): Profile;
  drawBG(option?: ProfileTypes.DrawOption): Profile {
    const ctx = this.ctx;
    const canvas = this.canvas;

    const isObject = typeof option === "object" && "draw" in option;
    const isDrawBGColor =
      isObject &&
      option.draw === "color" &&
      !("image" in option) &&
      !("imagePosition" in option) &&
      !("images" in option);

    const isDrawBGOneImage =
      isObject &&
      option.draw === "image" &&
      "image" in option &&
      ("imagePosition" in option
        ? "imagePosition" in option
        : ((option.imagePosition = "banner"), true)) &&
      !("images" in option) &&
      option.image instanceof Image;

    const isDrawBGTwoImage =
      isObject &&
      option.draw === "image" &&
      "images" in option &&
      !("image" in option);

    if (!option) (ctx.fillStyle = "#313338"), ctx.fillRect(0, 0, canvas.width, canvas.height);
    else if (isDrawBGColor !== false) this.#drawBGColor(option);
    else if (isDrawBGOneImage !== false) this.#drawBGOneImage(option);
    else if (isDrawBGTwoImage !== false) this.#drawBGTwoImage(option);
    else
      throw new EmiliaTypeError(`Invalid DrawBG options! ${JSON.stringify(option)}`);

    this._sharp;
    return this;
  }

  //Пока без изменений высоты. Просто отрисовка как есть. Чуть позже модифицирую это
  drawInline(color?: string, lineWidth?: number, setBlur?: number): Profile {
    const ctx = this.ctx;

    if (color) ctx.strokeStyle = color;

    ctx.save();
    ctx.beginPath();
    ctx.filter = `blur(${setBlur ?? 1.1}px)`;
    ctx.moveTo(0, 200);
    ctx.lineTo(this.canvas.width, 200);
    ctx.lineWidth = lineWidth ?? 2;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    return this;
  }

  drawAvatar(options: ProfileTypes.DrawColorAvatarOptions): Profile;
  drawAvatar(options: ProfileTypes.DrawImageAvatarOptions): Profile;
  drawAvatar({
    avatar,
    xp,
    avatarBorder,
    avatarPosition,
    blurOptions,
    lineBorder,
  }: ProfileTypes.DrawColorAvatarOptions | ProfileTypes.DrawImageAvatarOptions): Profile {
    const ctx = this.ctx;

    //фон аватарки
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      avatarPosition.x ?? 150,
      avatarPosition.y ?? 200,
      avatarPosition.radius ?? 98,
      0,
      Math.PI * 2,
    );

    const avatarBorderColor = avatarBorder?.color;
    const avatarBorderBackground = avatarBorder?.backgroundColor;

    const setStyle = (
      args: string | ProfileTypes.GradientOptions | undefined,
      types: "fill" | "stroke",
      defaultColor: string,
    ) => {
      if (typeof args === "string")
        ctx[`${types}Style`] = args; //`#124124`;
      else if (
        avatarBorder !== undefined &&
        args !== undefined &&
        "type" in args
      ) {
        if (args.colorType !== types)
          throw new EmiliaTypeError(
            `Profile.drawAvatar: Sorry, but "${args.colorType} in "avatarBorder.color.colorType" not supported. Please use "${types}" instead.`,
          );

        this.#setGradient(args);
      } else ctx[`${types}Style`] = defaultColor;
    };

    setStyle(avatarBorderColor, "fill", "#123123");

    const avatarLineWidth = avatarBorder?.lineWidth ?? 5;

    ctx.fill();
    ctx.closePath();
    ctx.restore();

    // Опыт
    const startAngle = -Math.PI / 2;
    const endAngle = Math.PI * 2 * (xp.now / xp.max) - Math.PI / 2;

    ctx.beginPath();
    ctx.arc(
      avatarPosition.x ?? 150,
      avatarPosition.y ?? 200,
      (avatarPosition.radius ?? 86.5) + avatarLineWidth,
      startAngle,
      endAngle,
      false,
    );

    if (blurOptions?.xp !== undefined)
      ctx.filter = `blur(${blurOptions.xp ?? 0}px)`;

    setStyle(xp.color, "stroke", "lightgreen");
    ctx.lineWidth = xp.lineWidth ?? 7.5;
    ctx.globalAlpha = xp.globalAlpha ?? 0.8;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.closePath();

    ctx.filter = `blur(${blurOptions?.border !== undefined && blurOptions.border?.out !== undefined ? blurOptions.border?.out : 0}px)`;

    //внешняя обводка
    ctx.beginPath();
    ctx.arc(
      avatarPosition.x ?? 150,
      avatarPosition.y ?? 200,
      avatarPosition.radius ?? 98,
      0,
      Math.PI * 2,
    );
    setStyle(avatarBorderBackground, "stroke", "#124124");
    ctx.lineWidth = avatarLineWidth;
    ctx.stroke();
    ctx.closePath();

    ctx.filter = `blur(${blurOptions?.border !== undefined && blurOptions.border.in !== undefined ? blurOptions.border.in : 0}px)`;

    //внутренняя рамка аватарки
    ctx.beginPath();
    ctx.arc(
      avatarPosition.x ?? 150,
      avatarPosition.y ?? 200,
      (avatarPosition.radius ?? 98) - (avatarLineWidth + (xp.lineWidth ?? 8)),
      0,
      Math.PI * 2,
    ); //82.4
    setStyle(avatarBorderBackground, "stroke", "#124124");
    ctx.lineWidth = avatarLineWidth;
    ctx.stroke();
    ctx.closePath();

    if (blurOptions?.border !== undefined) ctx.filter = "blur(0px)";

    //аватарка
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      avatarPosition.x ?? 150,
      avatarPosition.y ?? 200,
      avatarPosition.image?.radius ?? 82,
      0,
      Math.PI * 2,
    );
    if (blurOptions?.avatar !== undefined)
      ctx.filter = `blur(${blurOptions.avatar ?? 0}px)`;

    if (avatar instanceof Image) {
      ctx.clip();
      ctx.drawImage(
        avatar,
        avatarPosition.image?.x ?? 70,
        avatarPosition.image?.y ?? 120,
      );
    } else if (typeof avatar === "string") {
      ctx.fillStyle = avatar;
      ctx.fill();
    } else if (avatar !== undefined && "type" in avatar)
      this.#setGradient(avatar);

    ctx.closePath();
    ctx.restore();

    const lineBorderBlur = lineBorder?.blurOption;

    //Блок обводки (аватарка) вокруг всех
    if (lineBorder?.off !== true) {
      setStyle(lineBorder?.color, "stroke", "black");
      ctx.lineWidth = lineBorder?.lineWidth ?? 2;
      ctx.globalAlpha = lineBorder?.globalAlpha ?? 1;

      if (
        lineBorderBlur?.both !== undefined ||
        lineBorderBlur?.top !== undefined
      )
        ctx.filter = `blur(${lineBorderBlur.both ?? lineBorderBlur.top ?? 0.8}px)`;

      ctx.beginPath();
      ctx.arc(
        lineBorder?.x ?? 150,
        lineBorder?.y ?? 200,
        lineBorder?.radius ?? 101,
        0,
        Math.PI,
        true,
      );
      ctx.stroke();
      ctx.closePath();

      if (
        lineBorderBlur?.both === undefined &&
        lineBorderBlur?.bottom !== undefined
      )
        ctx.filter = `blur(${lineBorderBlur.bottom ?? 1.1}px)`;

      ctx.beginPath();
      ctx.arc(
        lineBorder?.x ?? 150,
        lineBorder?.y ?? 200,
        lineBorder?.radius ?? 101,
        0,
        Math.PI,
        false,
      );
      ctx.stroke();
      ctx.closePath();
      ctx.filter = "blur(0px)";
      ctx.globalAlpha = 1;
    }

    return this;
  }

  drawGuildIcon(options: ProfileTypes.DrawGuildIconOptions): Profile {
    const ctx = this.ctx;
    const {
      x1,
      x2,
      y1,
      y2,
      r,
      borderLineWidth = 5,
      borderColor = "#124124",
      icon,
      globalAlpha,
      offBorder = false,
      w,
      h,
    } = options;
    const isImage = icon instanceof Image;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x1, y1, r, 0, Math.PI * 2);
    ctx.clip();

    ctx.globalAlpha = globalAlpha
      ? typeof globalAlpha === "number"
        ? globalAlpha
        : "icon" in globalAlpha
          ? globalAlpha.icon ?? 1
          : 1
      : 1;

    if (isImage) {
      ctx.drawImage(icon, x2, y2, w, h);
    } else {
      if (typeof icon === "string") ctx.fillStyle = icon;
      else this.#setGradient(icon);

      ctx.fill();
    }
    ctx.closePath();
    ctx.restore();
    ctx.beginPath();
    ctx.lineWidth = borderLineWidth;

    if (
      typeof globalAlpha !== "number" &&
      globalAlpha !== undefined &&
      "border" in globalAlpha
    )
      ctx.globalAlpha = globalAlpha.border ?? 1;

    if (typeof borderColor === "string") ctx.strokeStyle = borderColor;
    else if (borderColor !== undefined) this.#setGradient(borderColor);

    if (offBorder !== true) {
      ctx.arc(x1, y1, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.closePath();

    return this;
  }

  drawBadge(args: ProfileTypes.DrawBadgeOptions, options: ProfileTypes.DrawBadgeOptionalOptions): Profile;
  drawBadge(
    args: ProfileTypes.DrawBadgeOptions[],
    options: ProfileTypes.DrawBadgeOptionalOptions,
  ): Profile;
  drawBadge(
    args: ProfileTypes.DrawBadgeOptions | ProfileTypes.DrawBadgeOptions[],
    options: ProfileTypes.DrawBadgeOptionalOptions,
  ): Profile {
    if (Array.isArray(args) && args.length > 0) {
      if (args.length === 1) {
        this.#badgeDraw(args[0], options);
        return this;
      }

      const sortBadges = args.sort(
        (a, b) => (a?.priority ?? 1) - (b?.priority ?? 0),
      );
      const badges: typeof sortBadges = [];

      let x = 0;
      let y = 0;
      for (let i = 0; i < args.length; i++) {
        sortBadges[i].priority = undefined;
        const bg = sortBadges[i];
        const prevBG = sortBadges[i - 1];

        if (i === 0) {
          x = bg.x ?? 0;
          y = bg.y ?? 0;

          badges.push({ x, y, ...bg });

          continue;
        }

        x += (prevBG.x ?? 0) - (bg.space ?? 10) - (bg.w ?? 20) - (bg.x ?? 0);
        y = (prevBG.y ?? 0) + (bg.y ?? 0);

        const result = { x, y };
        badges.push({ ...bg, ...result });
      }

      badges.forEach((val, i) =>
        this.#badgeDraw(val, options, i, badges.length, badges)
      );
    } else if (!Array.isArray(args)) this.#badgeDraw(args, options);

    return this;
  }

  #badgeDraw(
    args: ProfileTypes.DrawBadgeOptions,
    options: ProfileTypes.DrawBadgeOptionalOptions,
    ind = 0,
    length = 0,
    arr?: ProfileTypes.DrawBadgeOptions[],
  ) {
    const ctx = this.ctx;
    const {
      x,
      y,
      bgR = 11,
      bgH = 34,
      bgW = 28,
      bgColor = "#10271d",
      offStroke = false,
      bgLineWidth = 2,
      globalAlpha = { fill: 0.8, stroke: 0.7 },
      blur,
      bgFill = "full",
    } = options;

    const { w = 20, h = 20, badge, space = 9 } = args;

    const BGw =
      ind === 0 && bgFill === "full" && length > 0
        ? arr !== undefined && arr.length > 0
          ? Math.abs(arr[length - 1].x ?? bgW) + bgW
          : bgW
        : bgW;

    const BGx =
      bgFill === "unique" && arr !== undefined
        ? (arr[ind].x ?? x) - BGw + space
        : x;

    if ((ind === 0 && bgFill === "full") || bgFill === "unique")
      this.drawBlocks({
        x: BGx,
        y,
        w: BGw,
        h: bgH,
        r: bgR,
        color: bgColor,
        strokeLineWidth: bgLineWidth,
        drawType: offStroke ? "fill" : "both",
        globalAlpha,
        blurOptions: blur,
        x_position: "right",
      });

    ctx.save();
    ctx.beginPath();

    ctx.translate(955, 160);

    if (args.blur !== undefined) ctx.filter = `blur(${args.blur}px)`;
    if (args.globalAlpha !== undefined) ctx.globalAlpha = args.globalAlpha;

    ctx.drawImage(badge, args.x ?? 0, args.y ?? 0, w, h);
    ctx.closePath();
    ctx.restore();
  }

  drawBlocks(options: ProfileTypes.DrawBlocksOptions): Profile;
  drawBlocks(options: ProfileTypes.DrawBlocksOptions[]): Profile;
  drawBlocks(options: ProfileTypes.DrawBlocksOptions | ProfileTypes.DrawBlocksOptions[]): Profile {
    if (Array.isArray(options) && options.length > 0) {
      options.forEach((val: ProfileTypes.DrawBlocksOptions) => this.#drawBlock(val));
    } else if (typeof options === "object" && !Array.isArray(options))
      this.#drawBlock(options);
    else
      throw new EmiliaTypeError(
        `Profile.drawBlocks: Why options is not array or object? Options type: ${typeof options} (${options?.toString()})`,
      );

    return this;
  }

  drawTemplateBlock(options: ProfileTypes.TemplateBlocksOptions): Profile {
    const defaultBioY = 370;
    const defaultR = 11;
    const templateBlock: { [key: string]: ProfileTypes.DrawRoundedRectOptions } = {
      username: { x: 290, y: 140, w: 380, h: 50, r: defaultR },
      level: { x: -30, y: 234, w: 200, h: 40, r: defaultR },
      title: { x: 290, y: 230, w: 380, h: 45, r: defaultR },
      bio: { x: 20, y: defaultBioY, w: 710, h: 310, r: defaultR },
      bioFull: { x: 20, y: defaultBioY, w: 960, h: 310, r: defaultR },
      bioCenter: { x: 0, y: defaultBioY, w: 600, h: 310, r: defaultR },
      badge: { x: -20, y: 155, w: 40, h: 34, r: defaultR },
      guild: { x: 750, y: 370, w: 230, h: 310, r: defaultR },
    };

    const defaultBioOptions: ProfileTypes.BaseDrawBlocksOptions = {
      color: {
        fill: "white",
        stroke: "#124124",
      },
      globalAlpha: {
        fill: 0.5,
      },
      drawType: "both",
      strokeLineWidth: 5,
    };

    const templateOptions: {
      [key: string]: ProfileTypes.BaseDrawBlocksOptions & { x_position?: ProfileTypes.XTemplatePosition };
    } = {
      username: {
        globalAlpha: 0.5,
        color: "black",
        drawType: "both",
        strokeLineWidth: 2,
      },
      level: {
        globalAlpha: 0.5,
        color: "black",
        x_position: "right",
        drawType: "both",
        strokeLineWidth: 2,
      },
      title: {
        color: { fill: "#b89e14", stroke: "orange" },
        globalAlpha: { fill: 0.8, stroke: 0.5 },
        drawType: "both",
        strokeLineWidth: 2,
      },
      bio: defaultBioOptions,
      bioFull: defaultBioOptions,
      bioCenter: { x_position: "center", ...defaultBioOptions },
      badge: {
        x_position: "right",
        color: { fill: "#091711", stroke: "black" },
        globalAlpha: { fill: 0.7, stroke: 0.5 },
        drawType: "both",
        strokeLineWidth: 2,
      },
      guild: {
        drawType: "both",
        globalAlpha: { fill: 0.5 },
        color: { fill: "white", stroke: "#124124" },
        strokeLineWidth: 5,
      },
    };
    const templateNames: string[] = [];
    const templates: ProfileTypes.TemplateBlocksOptions[] = Object.entries(options)
      .map(([key, value], i) => ({
        name: key,
        priority: value?.priority ?? i,
        ...value,
      }))
      .sort((a, b) => a.priority - b.priority)
      .map((v, i) => {
        const n: { [key: string]: object } = {};
        const name = v.name;
        templateNames.push(name);

        n[name] = v;

        return n;
      });

    const applyTemplate = (
      option: ProfileTypes.TemplateBlocksOptions,
      templateType: string,
    ) => {
      const defaultBlock = templateBlock[templateType];
      const defaultOptions = templateOptions[templateType];
      const opt = option[templateType];

      const mergedOptions: ProfileTypes.DrawBlocksOptions = {
        ...defaultBlock,
        ...defaultOptions,
        ...opt,
      };

      this.#drawBlock(mergedOptions);
    };

    templates.forEach((val, i) => applyTemplate(val, templateNames[i]));
    templateNames.length = 0;

    return this;
  }

  async drawText({
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
  }: ProfileTypes.DrawTextOptions): Promise<Profile> {
    const ctx = this.ctx;

    if (clipNumber) text = this.numberClip(text);
    if (timeFormat) text = this.timeFormatter(Number(text));

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

    if (fontOptions) this.setFontStyle(fontOptions);
    if (dynamic || isClip) {
      if (isClip) {
        for (const word of words) {
          const testLine =
            lines[currentLineIndex] +
            (lines[currentLineIndex] ? " " : "") +
            word;

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

          cacheWord = this.#whileClip(
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

          const textFormatted = this.#textFormatter({
            text: testLineClip,
            cache: cacheWord,
            curInd: currentLineIndex,
            dynamic,
            linesNext,
          });

          lines[currentLineIndex] = textFormatted.endsWith("--")
            ? textFormatted.slice(0, -1)
            : textFormatted;

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
                let clippedWord = `${beforeNewLine ?? ""}${cacheLine.slice(startNum, sliceNum)}`;
                startNum = sliceNum;
                const newClipWordIndex = clippedWord.indexOf("\n");

                if (newClipWordIndex !== -1) {
                  beforeNewLine = clippedWord;
                  clippedWord = clippedWord.slice(0, newClipWordIndex);
                  beforeNewLine = beforeNewLine.slice(newClipWordIndex + 1);
                } else beforeNewLine = "";

                lineCache.push(clippedWord);
                cacheWord = cacheWord.slice(clippedWord.length);
              }

              cacheWord = "";
              cacheLine = "";

              for (const line of lineCache) {
                cacheWord = this.#whileClip(
                  line,
                  maxWidth,
                  currentLineIndex <= linesNext
                    ? dashWidth
                    : dynamic && currentLineIndex === linesNext
                      ? ellipsisWidth + dynamicCorrector
                      : 0,
                );

                const textFormatted = this.#textFormatter({
                  text: line,
                  cache: cacheWord,
                  curInd: currentLineIndex,
                  dynamic,
                  linesNext,
                });

                lines[currentLineIndex] =
                  (textFormatted.endsWith("-") &&
                    lineCache[lineCache.length - 1] === line) ||
                    textFormatted.endsWith("--")
                    ? textFormatted.slice(0, -1)
                    : textFormatted;
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
            throw new EmiliaTypeError("Бесконечный while!");

          truncatedText = truncatedText.slice(0, -1);
        }

        truncatedText = truncatedText === text ? text : `${truncatedText}...`;
      }
    }

    if (leftText) ctx.textAlign = "right";

    if (centerText) (ctx.textAlign = "center"), (x = (x1 + x2) / 2);
    if (isClip)

      lines.forEach((line, i) =>
        ctx.fillText(line, x, y + i * (textHeight + lineSpacing)),
      ),
        (lines.length = 0);
    else ctx.fillText(truncatedText, x, y);
    if (leftText || centerText) ctx.textAlign = "start";

    ctx.restore();

    return this;
  }

  drawTexts(args: ProfileTypes.DrawTextOptions[], options: ProfileTypes.DrawTextsOption): Profile;
  drawTexts(args: ProfileTypes.DrawTextOptions[]): Profile;
  drawTexts(args: ProfileTypes.DrawTextOptions[], option?: ProfileTypes.DrawTextsOption): Profile {
    let index = 0;
    let cache: Partial<ProfileTypes.DrawTextOptions>;

    args.forEach(async (data, i) => {
      if (option) {
        const dynamic = option?.dynamicOptions;
        const forDynamic = dynamic ? dynamic[index] : option;
        const start = forDynamic?.start ?? 0;
        const end = forDynamic?.end ?? args.length - 1;
        const update = forDynamic?.update ?? {};
        const isCache = dynamic ? dynamic[index]?.cache || false : false;

        if (!cache) cache = update;
        if (isCache) cache = { ...cache, ...update };
        if (i >= start && i <= end) data = { ...data, ...cache };
        if (i === end && dynamic) index++;
      }

      await this.drawText(data);
    });

    return this;
  }

  drawTemplateText(args: ProfileTypes.TemplateTextOptions): Profile {
    const text = "";
    const iconShift = 40;
    const defaultBio = {
      dynamicOptions: {
        dynamic: true,
        dynamicCorrector: 1,
        isClip: true,
        lineSpacing: 12,
        lines: 10,
      },
      fontOptions: { size: 25, color: "black" },
    };
    const templateText: ProfileTypes.TemplateTextOptions = {
      username: {
        x1: 294,
        x2: 670,
        y: 178,
        dynamicOptions: { dynamic: true },
        fontOptions: { color: "white", size: 35 },
        text,
      },
      level: {
        x1: 772,
        x2: 970,
        y: 258,
        textDirect: "center",
        dynamicOptions: { dynamic: true, dynamicCorrector: -2, lines: 0 },
        fontOptions: { size: 15, color: "white" },
        text,
      },
      title: {
        x1: 294,
        x2: 668,
        y: 260,
        textDirect: "center",
        dynamicOptions: { dynamic: true, lines: 0, dynamicCorrector: -11 },
        fontOptions: { color: "black", size: 27 },
        text,
      },
      bio: { x1: 30, x2: 710, y: 400, text, ...defaultBio },
      bioFull: { x1: 30, x2: 970, y: 400, text, ...defaultBio },
      bioCenter: { x1: 210, x2: 787, y: 400, text, ...defaultBio },
      guild: {
        guildName: {
          x1: 762.5,
          x2: 970,
          y: 400,
          dynamicOptions: {
            dynamic: true,
            isClip: true,
            lines: 1,
            lineSpacing: 2,
          },
          fontOptions: { size: 25 },
          text,
          iconShift,
        },
        guildType: {
          x1: 763,
          x2: 965,
          y: 480,
          dynamicOptions: { dynamic: true },
          fontOptions: { size: 20 },
          text,
          iconShift,
        },
        members: {
          x1: 763,
          x2: 965,
          y: 535,
          dynamicOptions: { dynamic: true },
          fontOptions: { size: 20 },
          text,
          iconShift,
        },
        perms: {
          x1: 763,
          x2: 965,
          y: 590,
          dynamicOptions: { dynamic: true },
          fontOptions: { size: 20 },
          text,
          iconShift,
        },
        guildIcon: args?.guild?.guildIcon || false,
      },
    };

    const templateNames: string[] = [];
    const templates: ProfileTypes.TemplateTextOptions[] = Object.entries(args)
      .map(([key, value], i) => ({
        name: key,
        priority: (value as ProfileTypes.TemplateText)?.priority ?? i,
        ...value,
      }))
      .sort((a, b) => a.priority - b.priority)
      .map((v, i) => {
        const n: { [key: string]: any } = {};
        const name = v.name;
        templateNames.push(name);

        n[name] = v;

        return n;
      });

    const applyTemplate = (
      option: ProfileTypes.TemplateTextOptions,
      templateType: string,
    ) => {
      const defaultBlock = templateText[templateType];
      const opt = option[templateType];

      if (templateType === "guild") {
        if (defaultBlock === undefined)
          throw new EmiliaTypeError(
            "Profile.drawTemplateText().applyTemplate: why guild (in args) object undefined?",
          );

        const res: ProfileTypes.IconGuildTextShift[] = [];

        Object.entries(defaultBlock).forEach(
          ([key, value]: [string, ProfileTypes.IconGuildTextShift]) => {
            if (key === "guildIcon") return;

            const opts = (opt as { [key: string]: ProfileTypes.IconGuildTextShift })[key];
            const guild =
              opt !== undefined && "guildIcon" in opt ? opt : undefined;
            const item = {
              ...value,
              ...opts,
            };

            if (guild?.guildIcon === true)
              item.y = (item.y ?? 0) + (item.iconShift ?? 0);

            res.push(item);
          },
        );

        res.forEach((item) => this.drawText(item as ProfileTypes.DrawTextOptions));
      } else {
        const mergedOptions = {
          ...defaultBlock,
          ...opt,
        };

        this.drawText(mergedOptions as ProfileTypes.DrawTextOptions);
      }
    };

    templates.forEach((val, i) => applyTemplate(val, templateNames[i]));
    templateNames.length = 0;

    return this;
  }

  setFontStyle({ size, font, color, type = 1 }: ProfileTypes.SetFontStyleOptions) {
    const ctx = this.ctx;
    const fonts = this.fonts;

    if (typeof size === "number") size = `${size}px`;
    if (size) fonts.size = size;
    if (font) fonts.font = font;
    if (size || font) ctx.font = `${size ?? fonts.size} ${font ?? fonts.font}`;
    if (color) {
      if (type === 1 || type === 3) ctx.fillStyle = color;
      if (type === 2 || type === 3) ctx.strokeStyle = color;
    }
  }

  numberClip(num: ProfileTypes.StringNumber): string {
    if (typeof num !== "string") num = `${num}`;

    const numLength = num.length;

    return numLength >= 5
      ? `${num.slice(0, 4)}k`
      : numLength >= 11
        ? `${num.slice(0, 4)}kk`
        : numLength >= 16
          ? `${num.slice(0, 4)}kk+`
          : num;
  }

  parseSecond(s: number): { hours: number; minutes: number; seconds: number } {
    const minutes = Math.floor(s / 60);
    const hours = Math.floor(minutes / 60);
    return {
      hours,
      minutes: minutes - hours * 60,
      seconds: s % 60,
    };
  }

  timeFormatter(time: number): string {
    if (typeof time !== "number" || time < 0)
      throw new EmiliaTypeError(
        "Profile.timeFormatter: Входное значение в timeFormatter не является положительным числом!",
      );

    const parser = this.parseSecond(time);
    const isHour = parser.hours > 0;
    const isMinute = parser.minutes > 0;

    return isHour
      ? parser.hours >= 10
        ? `${this.numberClip(parser.hours)} ч`
        : `${parser.hours} ч ${parser.minutes} м`
      : isMinute
        ? `${parser.minutes} м ${parser.seconds} с`
        : `${parser.seconds} с`;
  }

  /**
   * @param cache входящий текст для изменений
   * @param maxWidth максимальная ширина
   * @param [elseWidth] дополнительное значение, что будет участвовать в цикле
   * @returns
   */
  #whileClip(cache: string, maxWidth: number, elseWidth?: number): string {
    let cached: string = cache;

    while (this.ctx.measureText(cached).width + (elseWidth ?? 0) > maxWidth) {
      if (cached.length === 0) throw new EmiliaTypeError("infinite while");

      cached = cached.slice(0, -1);
    }

    return cached;
  }

  /**
   * @param options параметры
   * @param options.text  входящий текст
   * @param options.cache кеш-переменная
   * @param options.curInd текущий индекс
   * @param options.linesNext следующий индекс
   * @param options.dynamic динамический ли текст
   * @returns
   */
  #textFormatter({
    text,
    cache,
    curInd,
    linesNext,
    dynamic = false,
  }: ProfileTypes.TextFormatterOptions): string {
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
  }

  #drawBlock(args: ProfileTypes.DrawBlocksOptions): void {
    const ctx = this.ctx;
    const { width } = this.canvas;

    ctx.save();
    const {
      w,
      h,
      r,
      x,
      y,
      x_position,
      color,
      drawType = "fill",
      blurOptions,
      globalAlpha,
      strokeLineWidth,
    } = args;

    if (
      x_position !== undefined &&
      ["center", "right", "left"].includes(x_position)
    ) {
      const strokeWidth =
        strokeLineWidth && strokeLineWidth !== 0 ? strokeLineWidth / 2 : 0;
      const template: { [key: string]: number } = {
        left: strokeWidth,
        center: (width - w) / 2,
        right: width - w - strokeWidth,
      };

      ctx.translate(template[x_position], 0);
    }

    ctx.beginPath();

    this.drawRoundedRect({ x, y, w, h, r });

    if (typeof color !== "string" && color !== undefined && "colors" in color)
      this.#setGradient(color);
    else if (
      color !== undefined &&
      (typeof color === "string" || "fill" in color || "stroke" in color)
    ) {
      const colors = {
        fill: typeof color === "string" ? color : color?.fill,
        stroke: typeof color === "string" ? color : color?.stroke,
      };

      if (
        (drawType === "fill" || drawType === "both") &&
        colors.fill !== undefined
      )
        ctx.fillStyle = colors.fill;
      if (
        (drawType === "stroke" || drawType === "both") &&
        colors.stroke !== undefined
      )
        ctx.strokeStyle = colors.stroke;
    }

    if (strokeLineWidth) ctx.lineWidth = strokeLineWidth;

    if (typeof globalAlpha === "number") ctx.globalAlpha = globalAlpha;

    ctx.filter = `blur(${typeof blurOptions === "object" && "fill" in blurOptions ? blurOptions.fill : typeof blurOptions === "number" ? blurOptions : 0}px)`;

    if (typeof globalAlpha === "object" && globalAlpha?.fill !== undefined)
      ctx.globalAlpha = globalAlpha.fill;
    if (drawType === "fill" || drawType === "both") ctx.fill();

    ctx.filter = `blur(${typeof blurOptions === "object" && "stroke" in blurOptions ? blurOptions.stroke : typeof blurOptions === "number" ? blurOptions : 0}px)`;
    ctx.globalAlpha =
      typeof globalAlpha === "object" && globalAlpha?.stroke !== undefined
        ? globalAlpha.stroke
        : typeof globalAlpha === "number"
          ? globalAlpha
          : 1;

    if (drawType === "stroke" || drawType === "both") ctx.stroke();

    ctx.closePath();
    ctx.restore();
  }

  #drawBGColor({
    x,
    y,
    color,
    gradient,
    typeDraw = "rect",
    drawType = "fill",
    drawPriority = "fill",
    isClip = false,
    globalAlpha,
    strokeLineWidth,
    arcOptions = {
      radius1: 50,
      startAngle: Math.PI,
      endAngle: Math.PI * 2,
      counterclockwise: false,
    },
    rectOptions = { width: this.canvas.width, height: this.canvas.height },
  }: ProfileTypes.DrawBGDrawTypeColor): Profile {
    const ctx = this.ctx;

    ctx.save();
    ctx.beginPath();

    if (typeDraw === "rect")
      ctx.rect(x, y, rectOptions.width, rectOptions.height);
    if (typeDraw === "arc")
      ctx.arc(
        x,
        y,
        arcOptions.radius1,
        arcOptions.startAngle,
        arcOptions.endAngle,
        arcOptions.counterclockwise,
      );

    if (isClip) ctx.clip();

    //в случае наличия градиента - оно будет переопределено на градиент
    if (!gradient && color?.fill) ctx.fillStyle = color.fill;
    if (!gradient && color?.stroke) ctx.strokeStyle = color.stroke;
    if (gradient !== undefined) this.#setGradient(gradient);

    if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;

    if (strokeLineWidth !== undefined) ctx.lineWidth = strokeLineWidth;

    if (drawType === "fill") ctx.fill();
    else if (drawType === "stroke") ctx.stroke();
    else if (drawType === "both") {

      if (drawPriority === "fill") ctx.fill(), ctx.stroke();

      else ctx.stroke(), ctx.fill();
    }

    ctx.closePath();
    ctx.restore();

    return this;
  }

  #drawBGOneImage({
    x,
    y,
    image,
    imagePosition = "banner",
    draw = "image",
    isStroke = false,
    width = this.canvas.width,
    height,
    blurOptions,
    strokeLineWidth,
    globalAlpha,
    isClip,
    rotation,
    shadow,
    scale,
    translate,
    strokeColor,
    gradient,
  }: ProfileTypes.DrawBGTypeAllOne): Profile {
    const ctx = this.ctx;
    const canvas = this.canvas;

    if (draw !== "image")
      throw new EmiliaTypeError(
        `Profile.drawBG[drawBGOneImage()]: Why draw a "${draw}"? This draw is not "image"!`,
      );

    ctx.save();
    ctx.beginPath();

    const templateType: ProfileTypes.TemplateType = {
      banner: { x: 0, y: 0, width: canvas.width, height: 200 },
      full: { x: 0, y: 0, width: canvas.width, height: canvas.height },
      bottom: { x: 0, y: 200, width: canvas.width, height: 500 },
    };
    const position = templateType[imagePosition];

    ctx.rect(position.x, position.y, position.width, position.height);
    ctx.clip();

    if (isClip) {
      ctx.save();
      ctx.clip();
    }

    this.#applyBGImageTransformations({
      scale,
      translate,
      rotation,
      shadow,
      globalAlpha,
      strokeLineWidth,
      strokeColor,
      gradient,
      blurOptions,
      imagePosition,
    });

    height ??= position.height;
    y ??= position.y;

    if (
      (imagePosition === "banner" || imagePosition === "bottom") &&
      (!blurOptions ||
        (blurOptions !== undefined &&
          (blurOptions.full !== undefined || blurOptions.full === undefined)))
    )
      ctx.drawImage(image, x, y, width, height);
    else if (
      imagePosition === "full" &&
      (!blurOptions ||
        (blurOptions !== undefined && blurOptions.full === undefined))
    )
      ["banner", "bottom"].forEach((val) => {
        this.#drawImage({
          temType: val as ProfileTypes.PDImagePosition,
          templateType,
          blurOptions,
          image,
          dx: x,
          dy: y,
          dw: width,
          dh: height,
        });
      });
    else
      throw new EmiliaTypeError(
        `Profile.#drawBGOneImage: imagePosition (${imagePosition}) not a "banner", "bottom" or "full"!`,
      );

    if (isStroke) ctx.stroke();

    if (isClip) {
      ctx.restore();
    }

    ctx.closePath();
    ctx.restore();

    return this;
  }

  #drawBGTwoImage({ images, draw, positions }: ProfileTypes.DrawBGTypeFull): Profile {
    if (draw !== "image")
      throw new EmiliaTypeError(
        `Profile.drawBG[drawBGTwoImage()]: Why draw a "${draw}"? This draw is not "image"!`,
      );

    ["banner", "bottom"].forEach((val, i) =>
      this.#drawBGOneImage({
        draw,
        image: images[i],
        imagePosition: val as "banner" | "bottom",
        ...positions[i],
      }),
    );

    return this;
  }

  /**
   * If you just want to **draw** the image, use **`ctx.drawImage`** rather than this method)
   *
   * This method (**`#drawImage`**) is for drawing an image using `blur` (if you used **`BlurOptions`**). But since we want to draw only part of the image in blur (if the image covers the entire profile area), we will draw only this part of the image with blur (if you specified this), without adjusting it on top of the unblurred image.
   * @param root0
   * @param root0.temType
   * @param root0.templateType
   * @param root0.blurOptions
   * @param root0.image
   * @param root0.dx
   * @param root0.dy
   * @param root0.dw
   * @param root0.dh
   */
  #drawImage({
    temType,
    templateType,
    blurOptions,
    image,
    dx,
    dy,
    dw,
    dh,
  }: ProfileTypes.PrivateDrawImageOptions) {
    const ctx = this.ctx;
    const templatePosition = templateType[temType];

    const templateBlur: number | undefined =
      blurOptions !== undefined && temType in blurOptions
        ? blurOptions[temType]
        : undefined;

    ctx.save();
    ctx.beginPath();
    ctx.rect(
      templatePosition.x,
      templatePosition.y,
      templatePosition.width,
      templatePosition.height,
    );
    ctx.clip();

    if (templateBlur !== undefined) ctx.filter = `blur(${templateBlur}px)`;
    dh ??= templatePosition.height;

    ctx.drawImage(image, dx, dy, dw, dh);
    ctx.closePath();
    ctx.restore();
  }

  #applyBGImageTransformations({
    scale,
    translate,
    rotation,
    shadow,
    globalAlpha,
    strokeLineWidth,
    strokeColor,
    gradient,
    blurOptions,
    imagePosition,
  }: ProfileTypes.ApplyBGImageTransformationsOptions): void {
    const ctx = this.ctx;

    if (scale) ctx.scale(scale.x, scale.y);
    if (translate) ctx.translate(translate.x, translate.y);
    if (rotation) ctx.rotate(rotation);

    if (shadow) {
      ctx.shadowColor = shadow.color;
      ctx.shadowBlur = shadow.blur ?? 0;
      ctx.shadowOffsetX = shadow.x;
      ctx.shadowOffsetY = shadow.y;
    }

    if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;

    if (strokeLineWidth !== undefined) ctx.lineWidth = strokeLineWidth;
    if (strokeColor !== undefined && !gradient) ctx.strokeStyle = strokeColor;
    if (gradient !== undefined) this.#setGradient(gradient);

    if (blurOptions !== undefined && blurOptions.full !== undefined)
      ctx.filter = `blur(${blurOptions.full}px)`;
    else if (
      blurOptions !== undefined &&
      imagePosition !== "full" &&
      (blurOptions.banner !== undefined || blurOptions.bottom !== undefined)
    )
      ctx.filter = `blur(${blurOptions[imagePosition]}px)`;
  }

  #setGradient(gradient: ProfileTypes.GradientOptions) {
    const ctx = this.ctx;
    if (!gradient.colorType) gradient.colorType = "fill";
    if (!gradient.type) gradient.type = "linear";
    if (gradient.colors.length < 1 || !Array.isArray(gradient.colors))
      throw new EmiliaTypeError(
        `Profile.#setGradient: Where color's in gradient? gradient.color is empty!`,
      );

    let gradients: CanvasGradient = ctx.createLinearGradient(0, 0, 0, 0);
    const { linear, radial, colorType } = gradient;

    if (gradient.type === "linear" && linear !== undefined)
      gradients = ctx.createLinearGradient(
        linear.x0,
        linear.y0,
        linear.x1,
        linear.y1,
      );
    else if (gradient.type === "radial" && radial !== undefined)
      gradients = ctx.createRadialGradient(
        radial.x0,
        radial.y0,
        radial.r0,
        radial.x1,
        radial.y1,
        radial.r1,
      );
    else
      throw new EmiliaTypeError(
        "Profile.#setGradient: Invalid gradient type or missing parameters!",
      );

    gradient.colors.forEach((grad) =>
      gradients.addColorStop(grad.offset, grad.color),
    );

    if (colorType === "fill" || colorType === "both") ctx.fillStyle = gradients;
    if (colorType === "stroke" || colorType === "both")
      ctx.strokeStyle = gradients;
  }

  /**
   * @param options Параметры для отрисовки скруглённого квадрата
   * @param options.x координаты x
   * @param options.y координаты y
   * @param options.w ширина
   * @param options.h высота
   * @param options.r радиус скругления
   * @returns
   */
  drawRoundedRect({ x, y, w, h, r }: ProfileTypes.DrawRoundedRectOptions): Profile {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();

    return this;
  }

  /**
   * Render your **profile**. Support **`"image/png"`** and **`"image/jpeg"`**.
   *
   * Other image format - no. **`Discord` not supported** other **`image/format`** (**`webm`** and **`avif`**)
   */
  render(): Buffer;
  render(renderType: "image/jpeg", quality?: number): Buffer;
  render(renderType: "image/png"): Buffer;
  render(renderTypes: ProfileTypes.RenderType = "image/png", quality?: number): Buffer {
    if (renderTypes === "image/png") return this.canvas.toBuffer(renderTypes);
    if (renderTypes === "image/jpeg") return this.canvas.toBuffer(renderTypes, quality);

    throw new EmiliaTypeError(
      "Profile.render(): This render is not supported other image/format types! Only image/jpeg and image/png are supported.",
    );
  }
}
