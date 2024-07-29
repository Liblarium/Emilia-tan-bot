import { createCanvas, loadImage, type Canvas, type SKRSContext2D, Image } from "@napi-rs/canvas";
import sharp from "sharp";

/* eslint-disable jsdoc/require-jsdoc, jsdoc/require-param */ //пока оно мне тут мешает)

const imagePath = `./abyss/images`;

class Profile {
  canvas: Canvas;
  ctx: SKRSContext2D;
  fonts = {
    size: `20px`,
    font: `Arial`
  };
  /** 
   * Для более подробной инфы - гляди на основную sharp функцию ;D (просто добавь скобки) 
   * 
   * Или на саму документацию библиотеки `sharp.js` (это библиотека для работы с изображениями)
   */
  _sharp = sharp;

  constructor() {
    this.canvas = createCanvas(1000, 700);
    this.ctx = this.canvas.getContext(`2d`);
  } 
  
  drawBG(): Profile;
  drawBG(options: DrawBGTypeAllOne): Profile;
  drawBG(options: DrawBGTypeFull): Profile;
  drawBG(options: DrawBGDrawTypeColor): Profile;
  drawBG(option?: DrawOption): Profile {
    const ctx = this.ctx; 
    const canvas = this.canvas;

    const isObject = typeof option === `object` && `draw` in option;
    const isDrawBGColor = isObject && option.draw === `color` && !(`image` in option) && !(`imagePosition` in option) && !(`images` in option);
    const isDrawBGOneImage = isObject && option.draw === `image` && `image` in option && (`imagePosition` in option ? `imagePosition` in option : (option.imagePosition = `banner`, true)) && !(`images` in option) && option.image instanceof Image;
    const isDrawBGTwoImage = isObject && option.draw === `image` && `images` in option && !(`image` in option);

    if (!option) (ctx.fillStyle = `#313338`, ctx.fillRect(0, 0, canvas.width, canvas.height));
    else if (isDrawBGColor !== false) this.#drawBGColor(option);
    else if (isDrawBGOneImage !== false) this.#drawBGOneImage(option);
    else if (isDrawBGTwoImage !== false) this.#drawBGTwoImage(option);
    else throw new TypeError(`Invalid DrawBG options! ${JSON.stringify(option)}`);
    
    
    this._sharp
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

  drawAvatar(options: DrawColorAvatarOptions): Profile;
  drawAvatar(options: DrawImageAvatarOptions): Profile;
  drawAvatar({ avatar, xp, avatarBorder, avatarPosition, blurOptions, lineBorder }: DrawColorAvatarOptions | DrawImageAvatarOptions): Profile {
    const ctx = this.ctx;

    //фон аватарки
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarPosition.x ?? 150, avatarPosition.y ?? 200, (avatarPosition.radius ?? 98), 0, Math.PI * 2);
    
    const avatarBorderColor = avatarBorder?.color;
    const avatarBorderBackground = avatarBorder?.backgroundColor;

    const setStyle = (args: string | GradientOptions | undefined, types: "fill" | "stroke", defaultColor: string) => {
      if (typeof args === `string`) ctx[`${types}Style`] = args; //`#124124`;
      else if (avatarBorder !== undefined && args !== undefined && `type` in args) {
        if (args.colorType !== types) throw new TypeError(`Profile.drawAvatar: Sorry, but "${args.colorType} in "avatarBorder.color.colorType" not supported. Please use "${types}" instead.`);
        
        this.#setGradient(args);
      } else ctx[`${types}Style`] = defaultColor; 
    }

    setStyle(avatarBorderColor, `fill`, `#123123`);
    
    const avatarLineWidh = avatarBorder?.lineWidth ?? 5;
    
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    // Опыт
    const startAngle = -Math.PI / 2;
    const endAngle = Math.PI * 2 * (xp.now / xp.max) - Math.PI / 2;
 
    ctx.beginPath();
    ctx.arc(avatarPosition.x ?? 150, avatarPosition.y ?? 200, (avatarPosition.radius ?? 86.5) + avatarLineWidh, startAngle, endAngle, false);
    
    if (blurOptions?.xp !== undefined) ctx.filter = `blur(${blurOptions.xp ?? 0}px)`;

    setStyle(xp.color, `stroke`, `lightgreen`);  
    ctx.lineWidth = xp.lineWidth ?? 7.5;
    ctx.globalAlpha = xp.globalAlpha ?? 0.8;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.closePath();

    ctx.filter = `blur(${blurOptions?.border !== undefined && blurOptions.border?.out !== undefined ? blurOptions.border?.out : 0}px)`;

    //внешняя обводка
    ctx.beginPath();
    ctx.arc(avatarPosition.x ?? 150, avatarPosition.y ?? 200, avatarPosition.radius ?? 98, 0, Math.PI * 2);
    setStyle(avatarBorderBackground, `stroke`, `#124124`);
    ctx.lineWidth = avatarLineWidh;
    ctx.stroke();
    ctx.closePath();

    ctx.filter = `blur(${blurOptions?.border !== undefined && blurOptions.border.in !== undefined ? blurOptions.border.in : 0}px)`;

    //внутришняя рамка аватарки
    ctx.beginPath();
    ctx.arc(avatarPosition.x ?? 150, avatarPosition.y ?? 200, (avatarPosition.radius ?? 98) - (avatarLineWidh + (xp.lineWidth ?? 8)),  0, Math.PI * 2); //82.4
    setStyle(avatarBorderBackground, `stroke`, `#124124`);
    ctx.lineWidth = avatarLineWidh;
    ctx.stroke();
    ctx.closePath();
    
    if (blurOptions?.border !== undefined) ctx.filter = `blur(0px)`;
    
    //аватарка
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarPosition.x ?? 150, avatarPosition.y ?? 200, avatarPosition.image?.radius ?? 82, 0, Math.PI * 2);
    if (blurOptions?.avatar !== undefined) ctx.filter = `blur(${blurOptions.avatar ?? 0}px)`;

    if (avatar instanceof Image) { 
      ctx.clip();  
      ctx.drawImage(avatar, avatarPosition.image?.x ?? 70, avatarPosition.image?.y ?? 120);
    } else if (typeof avatar === `string`) {
      ctx.fillStyle = avatar;
      ctx.fill();
    } else if (avatar !== undefined && `type` in avatar) this.#setGradient(avatar);
    
    ctx.closePath();
    ctx.restore();
    
    const lineBorderBlur = lineBorder?.blurOption;

    //Блок обводки (аватарка) вокруг всех
    if (lineBorder?.off !== true) {
      setStyle(lineBorder?.color, `stroke`, `black`);
      ctx.lineWidth = lineBorder?.lineWidth ?? 2;
      ctx.globalAlpha = lineBorder?.globalAlpha ?? 1;

      if (lineBorderBlur?.both !== undefined || lineBorderBlur?.top !== undefined) ctx.filter = `blur(${(lineBorderBlur.both ?? lineBorderBlur.top) ?? 0.8}px)`;
      
      ctx.beginPath();
      ctx.arc(lineBorder?.x ?? 150, lineBorder?.y ?? 200, lineBorder?.radius ?? 101, 0, Math.PI, true);
      ctx.stroke();
      ctx.closePath();

      if (lineBorderBlur?.both === undefined && lineBorderBlur?.bottom !== undefined) ctx.filter = `blur(${lineBorderBlur.bottom ?? 1.1}px)`;
      
      ctx.beginPath();
      ctx.arc(lineBorder?.x ?? 150, lineBorder?.y ?? 200, lineBorder?.radius ?? 101, 0, Math.PI, false);
      ctx.stroke();
      ctx.closePath();
      ctx.filter = `blur(0px)`;
      ctx.globalAlpha = 1;
    }

    return this;
  }

  drawGuildIcon(options: DrawGuildIconOptions): Profile {
    const ctx = this.ctx;
    const { x1, x2, y1, y2, r, borderLineWidth = 5, borderColor = `#124124`, icon, globalAlpha, offBorder = false, w, h } = options;
    const isImage = icon instanceof Image;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x1, y1, r, 0, Math.PI * 2);
    ctx.clip();

    ctx.globalAlpha = globalAlpha ? typeof globalAlpha === `number` ? globalAlpha : `icon` in globalAlpha ? globalAlpha.icon ?? 1 : 1 : 1;

    if (isImage) {
      ctx.drawImage(icon, x2, y2, w, h);
    } else {
      if (typeof icon === `string`) ctx.fillStyle = icon;
      else this.#setGradient(icon);
    
      ctx.fill();
    }    
    ctx.closePath();
    ctx.restore();
    ctx.beginPath();
    ctx.lineWidth = borderLineWidth;
    
    if (typeof globalAlpha !== `number` && globalAlpha !== undefined && `border` in globalAlpha) ctx.globalAlpha = globalAlpha.border ?? 1;

    if (typeof borderColor === `string`) ctx.strokeStyle = borderColor;
    else if (borderColor !== undefined) this.#setGradient(borderColor);

    if (offBorder !== true) {
      ctx.arc(x1, y1, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.closePath();
    
    return this;
  }

  drawBadge(args: DrawBadgeOptions, options: DrawBadgeOptinalOptions): Profile;
  drawBadge(args: DrawBadgeOptions[], options: DrawBadgeOptinalOptions): Profile;
  drawBadge(args: DrawBadgeOptions | DrawBadgeOptions[], options: DrawBadgeOptinalOptions): Profile {
    if (Array.isArray(args) && args.length > 0) {
      //let lastX = x;
      if (args.length === 1) {
        this.#badgeDraw(args[0], options);
        return this;
      }

      const sortBadges = args.sort((a, b) => (a?.priority ?? 1) - (b?.priority ?? 0));
      const badges: typeof sortBadges = [];

      let x = 0;
      let y = 0;
      for (let i = 0; i < args.length; i++) {
        delete sortBadges[i].priority;
        const bg = sortBadges[i];
        const prewBG = sortBadges[i - 1];

        if (i === 0) {
          x = bg.x ?? 0;
          y = bg.y ?? 0;

          badges.push({ x, y, ...bg});

          continue;
        }

        x += (prewBG.x ?? 0) - (bg.space ?? 10) - (bg.w ?? 20) - (bg.x ?? 0);
        y = (prewBG.y ?? 0) + (bg.y ?? 0);
        
        const result = { x, y };
        badges.push({ ...bg, ...result });
      }

      badges.forEach((val, i) => this.#badgeDraw(val, options, i, badges.length, badges));
    } else if (!Array.isArray(args)) this.#badgeDraw(args, options);
    

    return this;
  }

  #badgeDraw(args: DrawBadgeOptions, options: DrawBadgeOptinalOptions, ind: number = 0, length: number = 0, arr?: DrawBadgeOptions[]) {
    const ctx = this.ctx;
    const { x, y, bgR = 11, bgH = 34, bgW = 28, bgColor = `#10271d`, offStroke = false, bgLineWidth = 2, globalAlpha = { fill: 0.8, stroke: 0.7 }, blur, bgFill = `full` } = options; 
    const { w = 20, h = 20, badge, space = 9 } = args;
    const BGw = ind === 0 && bgFill === `full` && length > 0 ? arr !== undefined && arr.length > 0 ? Math.abs(arr[length - 1].x ?? bgW) + bgW : bgW : bgW;
    const BGx = bgFill === `unique` && arr !== undefined ? (arr[ind].x ?? x) - BGw + space : x; 
    
    if (ind === 0 && bgFill === `full` || bgFill === `unique`) this.drawBlocks({ x: BGx, y, w: BGw, h: bgH, r: bgR, color: bgColor, strokeLineWidth: bgLineWidth, drawType: offStroke ? "fill" : "both", globalAlpha, blurOptions: blur, x_position: `right` });

    ctx.save();
    ctx.beginPath();

    ctx.translate(955, 160);
    
    if (args.blur !== undefined) ctx.filter = `blur(${args.blur}px)`;
    if (args.globalAlpha !== undefined) ctx.globalAlpha = args.globalAlpha; 
    
    ctx.drawImage(badge, args.x ?? 0, args.y ?? 0, w, h);
    ctx.closePath();
    ctx.restore();
    
  }

  drawBlocks(options: DrawBlocksOptions): Profile;
  drawBlocks(options: DrawBlocksOptions[]): Profile;
  drawBlocks(options: DrawBlocksOptions | DrawBlocksOptions[] ): Profile { 

    if (Array.isArray(options) && options.length > 0) {
      options.forEach((val: DrawBlocksOptions) => this.#drawBlock(val));

    } else if (typeof options === `object` && !Array.isArray(options)) this.#drawBlock(options);
    else throw new TypeError(`Profile.drawBlocks: Why options is not array or object? Options type: ${typeof options} (${options?.toString()})`);
  
    return this;
  }

  drawTemplateBlock(options: TemplateBlocksOptions): Profile {
    const defaultBioY = 370;
    const defaultR = 11;
    const templateBlock: {[key: string]: DrawRoundedRectOptions} = {
      username: { x: 290, y: 140, w: 380, h: 50, r: defaultR },
      level: { x: -30, y: 234, w: 200, h: 40, r: defaultR },
      title: { x: 290, y: 230, w: 380, h: 45, r: defaultR },
      bio: { x: 20, y: defaultBioY, w: 710, h: 310, r: defaultR },
      bioFull: { x: 20, y: defaultBioY, w: 960, h: 310, r: defaultR },
      bioCenter: { x: 0, y: defaultBioY, w: 600, h: 310, r: defaultR },
      badge: { x: -20, y: 155, w: 40, h: 34, r: defaultR },
      guild: { x: 750, y: 370, w: 230, h: 310, r: defaultR }
    };

    const defaultBioOptions: BaseDrawBlocksOptions = { 
      color: { 
        fill: `white`, 
        stroke: `#124124` 
      }, 
      globalAlpha: { 
        fill: 0.5 
      }, 
      drawType: `both`, 
      strokeLineWidth: 5 
    };

    const templateOptions: {[key: string]: BaseDrawBlocksOptions & { x_position?: XTemplatePosition }} = {
      username: { globalAlpha: 0.5, color: "black", drawType: `both`, strokeLineWidth: 2 },
      level: { globalAlpha: 0.5, color: "black", x_position: `right`, drawType: "both", strokeLineWidth: 2 },
      title: { color: { fill: `#b89e14`, stroke: `orange`}, globalAlpha: { fill: 0.8, stroke: 0.5 }, drawType: `both`, strokeLineWidth: 2 },
      bio: defaultBioOptions,
      bioFull: defaultBioOptions,
      bioCenter: { x_position: `center`, ...defaultBioOptions},
      badge: { x_position: `right`, color: { fill: `#091711`, stroke: `black` }, globalAlpha: { fill: 0.7, stroke: 0.5 }, drawType: "both", strokeLineWidth: 2 },
      guild: { drawType: `both`, globalAlpha: { fill: 0.5 }, color: { fill: `white`, stroke: `#124124` }, strokeLineWidth: 5 },
    };
    const templateNames: string[] = [];
    const templates: TemplateBlocksOptions[] = Object.entries(options)
      .map(([key, value], i) => ({ name: key, priority: value?.priority ?? i, ...value }))
      .sort((a, b) => a.priority - b.priority)
      .map((v, i) => {
        const n: {[key: string]: object} = {};
        const name = v.name;
        templateNames.push(name);
        
        n[name] = v;

        return n;
      });
    
    const applyTemplate = (option: TemplateBlocksOptions, templateType: string) => {
      const defaultBlock = templateBlock[templateType];
      const defaultOptions = templateOptions[templateType];
      const opt = option[templateType];

      const mergedOptions: DrawBlocksOptions = {
        ...defaultBlock,
        ...defaultOptions,
        ...opt
      };

      this.#drawBlock(mergedOptions);
    };
   
    templates.forEach((val, i) => applyTemplate(val, templateNames[i]) );
    templateNames.length = 0;

    return this;
  }

  async drawText({ x1, x2 = 0, y, text, textDirect = `normal`, dynamicOptions, fontOptions, clipNumber = false, timeFormat = false, x_translate }: DrawTextOptions): Promise<Profile> {
    const ctx = this.ctx;

    if (clipNumber) text = this.numberClip(text);
    if (timeFormat) text = this.timeFormatter(Number(text));
  
    const iText: string = `${text}`;
    const dynamic: boolean = dynamicOptions?.dynamic || false;
    const isClip: boolean = dynamicOptions?.isClip || false;
    const linesNext: number = dynamicOptions?.lines ?? 1;
    const lineSpacing: number = dynamicOptions?.lineSpacing ?? 0;
    const dynamicCorrector: number = dynamicOptions?.dynamicCorrector ?? 0;
    const leftText: boolean = textDirect === `left`;
    const centerText: boolean = textDirect === `center`;
    const maxWidth: number = x2 > 0 ? x2 - x1 : x1;
    const ellipsisWidth: number = ctx.measureText(`...`).width;
    const dashWidth: number = ctx.measureText(`-`).width;
    const words: string[] = iText.split(` `);
    const lines: string[] = [``]; //массив строк
    const textMetrics = ctx.measureText(iText);
    const textWidth: number = textMetrics.width;
    const textHeight: number = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    const isStartEmpty: RegExp = /^\s/;
    let truncatedText: string = iText;
    let currentLineIndex: number = 0;
    let cacheWord: string = ``;
    let beforeNewLine: string = ``;
    let startNum: number = 0;
    let x: number = x1;
  
    if (fontOptions) this.setFontStyle(fontOptions);
    if (dynamic || isClip) {
      if (isClip) {
        for (const word of words) {
          const testLine = lines[currentLineIndex] + (lines[currentLineIndex] ? ' ' : '') + word;
            
          if (currentLineIndex > linesNext) break;
          if (ctx.measureText(testLine).width < maxWidth) {
            const newLineIndex = word.indexOf(`\n`);
  
            if (newLineIndex === -1) {
              lines[currentLineIndex] = testLine;
            } else {
              const beforeNewLine = testLine.slice(0, (testLine.length - word.length) + newLineIndex);
              const afterNewLine = word.slice(newLineIndex + 1);
                
              lines[currentLineIndex++] = beforeNewLine;
                
              if (currentLineIndex <= linesNext) lines[currentLineIndex] = afterNewLine;
            }
            continue;
          }
  
          cacheWord = testLine;
            
          cacheWord = this.#whileClip(cacheWord, maxWidth, currentLineIndex < linesNext ? dashWidth : (dynamic && currentLineIndex === linesNext ? (ellipsisWidth + dynamicCorrector): 0));
          const cacheWordNewIndex = cacheWord.indexOf(`\n`);
            
          if (cacheWordNewIndex !== -1) cacheWord = cacheWord.slice(0, cacheWordNewIndex);
  
          const tLClip = testLine.slice(cacheWord.length + (cacheWordNewIndex === -1 ? 0 : 1));
          const testLineClip = tLClip.startsWith(`-`) ? tLClip.slice(1) : tLClip;
          const textFormated = this.#textFormater({ text: testLineClip, cache: cacheWord, curInd: currentLineIndex, dynamic, linesNext });
          lines[currentLineIndex] = textFormated.endsWith(`--`) ? textFormated.slice(0, -1) : textFormated;
          let cacheLine = isStartEmpty.test(testLineClip) ? testLineClip.slice(1) : testLineClip;
            
          ++currentLineIndex;
            
          if (currentLineIndex <= linesNext) {
            lines[currentLineIndex] = ``;

            if (testLineClip.length >= cacheWord.length) {
              const lineCache = [];
              cacheWord = cacheLine;
              const nextLineNum = lines[0].length + 5;

              for (let i = 0; i <= cacheWord.length; i++) {
                if (lineCache.length + currentLineIndex >= linesNext + 1) break;
  
                const sliceNum = nextLineNum * (i + 1);
                let clipedWord = `${beforeNewLine ?? ``}${cacheLine.slice(startNum, sliceNum)}`;
                startNum = sliceNum;
                const newClipWordIndex = clipedWord.indexOf(`\n`);
                  
                if (newClipWordIndex !== -1) {
                  beforeNewLine = clipedWord;
                  clipedWord = clipedWord.slice(0, newClipWordIndex);
                  beforeNewLine = beforeNewLine.slice(newClipWordIndex + 1);
                } else beforeNewLine = ``;
                  
                lineCache.push(clipedWord);
                cacheWord = cacheWord.slice(clipedWord.length);
              }
                
              cacheWord = ``;
              cacheLine = ``;
  
              for (const line of lineCache) {
                cacheWord = this.#whileClip(line, maxWidth, currentLineIndex <= linesNext ? dashWidth : (dynamic && currentLineIndex === linesNext ? (ellipsisWidth + dynamicCorrector): 0));

                const textFormated = this.#textFormater({ text: line, cache: cacheWord, curInd: currentLineIndex, dynamic, linesNext });

                lines[currentLineIndex] = (textFormated.endsWith(`-`) && lineCache[lineCache.length - 1] == line || textFormated.endsWith(`--`)) ? textFormated.slice(0, -1) : textFormated;
                ++currentLineIndex;
              }
  
            } else lines[currentLineIndex] = testLineClip;
          }  
        }
      }
      
      ctx.save();

      if (x_translate !== undefined) ctx.translate(x_translate, 0);

      if (textWidth > maxWidth && !isClip) {
        while (ctx.measureText(truncatedText).width + (ellipsisWidth + dynamicCorrector) > maxWidth) {
          if (truncatedText.length == 0) throw new TypeError(`Бесконечный while!`);
              
          truncatedText = truncatedText.slice(0, -1);
        }
  
        truncatedText = truncatedText === text ? text : `${truncatedText}...`;
      }
    }
  
    if (leftText) ctx.textAlign = `right`;
    if (centerText) (ctx.textAlign = `center`), x = (x1 + x2) / 2;
    if (isClip) lines.forEach((line, i) => ctx.fillText(line, x, y + i * (textHeight + lineSpacing))), lines.length = 0;
    else ctx.fillText(truncatedText, x, y);
    if (leftText || centerText) ctx.textAlign = `start`;
    
    ctx.restore();

    return this;
  }
  
  drawTexts(args: DrawTextOptions[], options: DrawTextsOption): Profile;
  drawTexts(args: DrawTextOptions[]): Profile;
  drawTexts(args: DrawTextOptions[], option?: DrawTextsOption): Profile {
    let index: number = 0;
    let cache: Partial<DrawTextOptions>;

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

  drawTemplateText(args: TemplateTextOptions): Profile {
    const text = ``;
    const iconShift = 40;
    const defaultBio = { dynamicOptions: { dynamic: true,  dynamicCorrector: 1, isClip: true,  lineSpacing: 12, lines: 10 }, fontOptions: { size: 25, color: `black` } };
    const templateText: TemplateTextOptions = {
      username: { x1: 294, x2: 670, y: 178, dynamicOptions: { dynamic: true }, fontOptions: { color: `white`, size: 35 }, text },
      level: { x1: 772, x2: 970, y: 258, textDirect: `center`, dynamicOptions: { dynamic: true, dynamicCorrector: -2, lines: 0 }, fontOptions: { size: 15, color: `white` }, text },
      title: { x1: 294, x2: 668, y: 260, textDirect: `center`, dynamicOptions: { dynamic: true, lines: 0, dynamicCorrector: -11 }, fontOptions: { color: `black`, size: 27 }, text },
      bio: { x1: 30, x2: 710, y: 400, text, ...defaultBio },
      bioFull: { x1: 30, x2: 970, y: 400, text, ...defaultBio },
      bioCenter: { x1: 210, x2: 787, y: 400, text, ...defaultBio },
      guild: {
        guildName: { x1: 762.5, x2: 970, y: 400, dynamicOptions: { dynamic: true, isClip: true, lines: 1, lineSpacing: 2 }, fontOptions: { size: 25 }, text, iconShift },
        guildType: { x1: 763, x2: 965, y: 480, dynamicOptions: { dynamic: true }, fontOptions: { size: 20 }, text, iconShift }, 
        members: { x1: 763, x2: 965, y: 535, dynamicOptions: { dynamic: true }, fontOptions: { size: 20 }, text, iconShift },
        perms: { x1: 763, x2: 965, y: 590, dynamicOptions: { dynamic: true }, fontOptions: { size: 20 }, text, iconShift },
        guildIcon: args?.guild?.guildIcon || false
      }
    };

    const templateNames: string[] = [];
    const templates: TemplateTextOptions[] = Object
      .entries(args)
      .map(([key, value], i) => ({ name: key, priority: (value as TemplateText)?.priority ?? i, ...value }))
      .sort((a, b) => a.priority - b.priority)
      .map((v, i) => {
        const n: {[key: string]: any} = {};
        const name = v.name;
        templateNames.push(name);
        
        n[name] = v;

        return n;
      });
    
    const applyTemplate = (option: TemplateTextOptions, templateType: string) => {
      const defaultBlock = templateText[templateType];
      const opt = option[templateType];

      if (templateType === `guild`) {
        if (defaultBlock === undefined) throw new TypeError(`Profile.drawTemplateText().applyTemplate: why guild (in args) object undefined?`);

        const res: IconGuildTextShift[] = [];
        
        Object
          .entries(defaultBlock)
          .forEach(([key, value]: [string, IconGuildTextShift]) => {
            if (key === `guildIcon`) return;

            const opts = (opt as {[key: string]: IconGuildTextShift})[key];
            const guild = opt !== undefined && `guildIcon` in opt ? opt : undefined;
            const item = {
              ...value,
              ...opts
            };
            
            if (guild?.guildIcon === true) item.y = (item.y ?? 0) + (item.iconShift ?? 0);

            res.push(item);
          });

        res.forEach(item => this.drawText(item as DrawTextOptions));
      } else {
        const mergedOptions = {
          ...defaultBlock,
          ...opt
        };

        this.drawText(mergedOptions as DrawTextOptions);
      }

    };
   
    templates.forEach((val, i) => applyTemplate(val, templateNames[i]) );
    templateNames.length = 0;

    return this;
  }

  setFontStyle ({ size, font, color, type = 1 }: SetFontStyleOptions) {
    const ctx = this.ctx;
    const fonts = this.fonts;

    if (typeof size === `number`) size = `${size}px`;
    if (size) fonts.size = size;
    if (font) fonts.font = font;
    if (size || font) ctx.font = `${size ?? fonts.size} ${font ?? fonts.font}`;
    if (color) {
      if (type === 1 || type === 3) ctx.fillStyle = color;
      if (type === 2 || type === 3) ctx.strokeStyle = color;
    }
  }

  numberClip (num: StringNumber): string {
    if (typeof num != `string`) num = `${num}`;

    const numLength = num.length;

    return numLength >= 5 ? `${num.slice(0, 4)}k` : numLength >= 11 ? `${num.slice(0, 4)}kk` : numLength >= 16 ? `${num.slice(0, 4)}kk+` : num;
  }

  parseSecond (s: number): { hours: number; minutes: number; seconds: number; } {
    const minutes = Math.floor(s / 60);
    const hours = Math.floor(minutes / 60);
    return {
      hours,
      minutes: minutes - (hours * 60),
      seconds: s % 60,
    };
  }

  timeFormatter(time: number): string {
    if (typeof time != `number` || time < 0) throw new TypeError(`Profile.timeFormatter: Входное значение в timeFormatter не является положительным числом!`);

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
  * @param {string} cache входящий текст для изменений 
  * @param {number} maxWidth макстимальная ширина
  * @param {number} [elseWidth] дополнительное значение, что будет участвовать в цикле 
  * @returns {string}
  */
  #whileClip (cache: string, maxWidth: number, elseWidth?: number ): string {
    let cached: string = cache;
    
    while(this.ctx.measureText(cached).width + (elseWidth ?? 0) > maxWidth) {
      if (cached.length === 0) throw new TypeError(`infinite while`);

      cached = cached.slice(0, -1);
    }

    return cached;
  }

  /** 
  * @param {object} options параметры
  * @param {string} options.text  входящий текст
  * @param {string} options.cache кеш-переменная
  * @param {number} options.curInd текущий индекс
  * @param {number} options.linesNext следующий индекс
  * @param {boolean} options.dynamic динамический ли текст
  * @returns {string}
  */
  #textFormater ({ text, cache, curInd, linesNext, dynamic = false }: TextFormatterOptions): string {
    const isStartEmpty = /^\s/;
    const isEndEmpty = /\s$/;
    
    return curInd < linesNext ? ((isStartEmpty.test(text) || isEndEmpty.test(cache)) ? cache : `${cache}-`) : dynamic && curInd === linesNext ? (isEndEmpty.test(cache) ? `${cache.slice(0, -1)}...` : `${cache}...`) : cache; 
  }

  #drawBlock(args: DrawBlocksOptions): void {
    const ctx = this.ctx;
    const { width } = this.canvas;

    ctx.save();
    const { w, h, r, x, y, x_position, color, drawType = `fill`, blurOptions, globalAlpha, strokeLineWidth } = args;

    if (x_position !== undefined && [`center`, `right`, `left`].includes(x_position)) {
      const strokeWidth = strokeLineWidth && strokeLineWidth !== 0 ? strokeLineWidth / 2 : 0;
      const template: {[key: string]: number} = {
        left: strokeWidth,
        center: (width - w) / 2,
        right: width - w - strokeWidth,
      };

      ctx.translate(template[x_position], 0);
    }

    ctx.beginPath();

    this.drawRoundedRect({ x, y, w, h, r });
      
    if (typeof color !== `string` && color !== undefined && `colors` in color) this.#setGradient(color);
    else if (color !== undefined && (typeof color === `string` || (`fill` in color || `stroke` in color))) {
      const colors = {
        fill: typeof color === `string` ? color : color?.fill,
        stroke: typeof color === `string` ? color : color?.stroke
      }

      if ((drawType === `fill` || drawType === `both`) && colors.fill !== undefined) ctx.fillStyle = colors.fill;
      if ((drawType === `stroke` || drawType === `both`) && colors.stroke !== undefined) ctx.strokeStyle = colors.stroke;
    }

    if (strokeLineWidth) ctx.lineWidth = strokeLineWidth;

    if (typeof globalAlpha === `number`) ctx.globalAlpha = globalAlpha;

    ctx.filter = `blur(${typeof blurOptions === `object` && `fill` in blurOptions ? blurOptions.fill : typeof blurOptions === `number` ? blurOptions : 0}px)`;
    
    if (typeof globalAlpha === `object` && globalAlpha?.fill !== undefined) ctx.globalAlpha = globalAlpha.fill;
    if (drawType === `fill` || drawType === `both`) ctx.fill();
      
    ctx.filter = `blur(${typeof blurOptions === `object` && `stroke` in blurOptions ? blurOptions.stroke : typeof blurOptions === `number` ? blurOptions : 0}px)`;
    ctx.globalAlpha = typeof globalAlpha === `object` && globalAlpha?.stroke !== undefined ? globalAlpha.stroke : typeof globalAlpha === `number` ? globalAlpha : 1;
    
    if (drawType === `stroke` || drawType === `both`) ctx.stroke(); 

    ctx.closePath();
    ctx.restore();
  }

  #drawBGColor({ x, y, color, gradient, typeDraw = `rect`, drawType = `fill`, drawPriority = `fill`, isClip = false, globalAlpha, strokeLineWidth, arcOptions = { radius1: 50, startAngle: Math.PI, endAngle: Math.PI * 2, counterclockwise: false }, rectOptions = { width: this.canvas.width, height: this.canvas.height } }: DrawBGDrawTypeColor): Profile {
    const ctx = this.ctx;

    ctx.save();
    ctx.beginPath();
    
    if (typeDraw === `rect`) ctx.rect(x, y, rectOptions.width, rectOptions.height);
    if (typeDraw === `arc`) ctx.arc(x, y, arcOptions.radius1, arcOptions.startAngle, arcOptions.endAngle, arcOptions.counterclockwise);
    
    if (isClip) ctx.clip();
    
    //в случае наличия градиента - оно будет переопределено на градиент
    if (!gradient && color?.fill) ctx.fillStyle = color.fill;
    if (!gradient && color?.stroke) ctx.strokeStyle = color.stroke;
    if (gradient !== undefined) this.#setGradient(gradient);

    if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;

    if (strokeLineWidth !== undefined) ctx.lineWidth = strokeLineWidth;

    if (drawType === 'fill') ctx.fill();
    else if (drawType === 'stroke') ctx.stroke();
    else if (drawType === 'both') {
      if (drawPriority === 'fill') (ctx.fill(), ctx.stroke());
      else (ctx.stroke(), ctx.fill());
    }

    ctx.closePath();
    ctx.restore();
    
    return this;
  }

  #drawBGOneImage({ x, y, image, imagePosition = `banner`,  draw = `image`, isStroke = false, width = this.canvas.width, height, blurOptions, strokeLineWidth, globalAlpha, isClip, rotation, shadow, scale, translate, strokeColor, gradient }: DrawBGTypeAllOne): Profile {
    const ctx = this.ctx;
    const canvas = this.canvas;
    
    if (draw !== `image`) throw new TypeError(`Profile.drawBG[drawBGOneImage()]: Why draw a "${draw}"? This draw is not "image"!`);

    ctx.save();
    ctx.beginPath();
  
    const templateType: TemplateType = {
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
  
    this.#applyBGImageTransformations({ scale, translate, rotation, shadow, globalAlpha, strokeLineWidth, strokeColor, gradient, blurOptions, imagePosition });

    height ??= position.height;
    y ??= position.y;

    if ((imagePosition === "banner" || imagePosition === "bottom") && (!blurOptions || blurOptions !== undefined && (blurOptions.full !== undefined || blurOptions.full === undefined))) ctx.drawImage(image, x, y, width, height);
    else if (imagePosition === "full" && (!blurOptions || blurOptions !== undefined && blurOptions.full === undefined)) [`banner`, `bottom`].forEach((val) => {
      this.#drawImage({ temType: val as PDImagePosition, templateType, blurOptions, image, dx: x, dy: y, dw: width, dh: height });
    });
    else throw new TypeError(`Profile.#drawBGOneImage: imagePosition (${imagePosition}) not a "banner", "bottom" or "full"!`);

    if (isStroke) ctx.stroke();

    if (isClip) {
      ctx.restore();
    }
  
    ctx.closePath();
    ctx.restore();

    return this;
  }
  
  #drawBGTwoImage({ images, draw, positions }: DrawBGTypeFull): Profile { 
    if (draw !== `image`) throw new TypeError(`Profile.drawBG[drawBGTwoImage()]: Why draw a "${draw}"? This draw is not "image"!`);

    [`banner`, `bottom`].forEach((val, i) => this.#drawBGOneImage({ draw, image: images[i], imagePosition: val as "banner" | "bottom", ...positions[i] }));

    return this;
  }

  /** 
   * If you just want to **draw** the image, use **`ctx.drawImage`** rather than this method)
   * 
   * This method (**`#drawImage`**) is for drawing an image using `blur` (if you used **`BlurOptions`**). But since we want to draw only part of the image in blur (if the image covers the entire profile area), we will draw only this part of the image with blur (if you specified this), without adjusting it on top of the unblurred image.
   */
  #drawImage({ temType, templateType, blurOptions, image, dx, dy, dw, dh }: PrivateDrawImageOptions) {
    const ctx = this.ctx;
    const templatePosition = templateType[temType];

    const templateBlur: number | undefined = blurOptions !== undefined && temType in blurOptions ? blurOptions[temType] : undefined;
    
    ctx.save();
    ctx.beginPath();
    ctx.rect(templatePosition.x, templatePosition.y, templatePosition.width, templatePosition.height);
    ctx.clip();
            
    if (templateBlur !== undefined) ctx.filter = `blur(${templateBlur}px)`;
    dh ??= templatePosition.height;

    ctx.drawImage(image, dx, dy, dw, dh);
    ctx.closePath();
    ctx.restore();
  }
  
  #applyBGImageTransformations({ scale, translate, rotation, shadow, globalAlpha, strokeLineWidth, strokeColor, gradient, blurOptions, imagePosition }: ApplyBGImageTransformationsOptions): void {
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
        
    if (blurOptions !== undefined && blurOptions.full !== undefined) ctx.filter = `blur(${blurOptions.full}px)`;
    else if (blurOptions !== undefined && imagePosition !== `full` && (blurOptions.banner !== undefined || blurOptions.bottom !== undefined)) ctx.filter = `blur(${blurOptions[imagePosition]}px)`;
  }

  #setGradient(gradient: GradientOptions) {
    const ctx = this.ctx;
    if (!gradient.colorType) gradient.colorType = `fill`;
    if (!gradient.type) gradient.type = `linear`;
    if (gradient.colors.length < 1 || !Array.isArray(gradient.colors)) throw new TypeError(`Profile.#setGradient: Where color's in gradient? gradient.color is empty!`);

    let gradients: CanvasGradient = ctx.createLinearGradient(0, 0, 0, 0);
    const { linear, radial, colorType } = gradient;

    if (gradient.type === `linear` && linear !== undefined) gradients = ctx.createLinearGradient(linear.x0, linear.y0, linear.x1, linear.y1);
    else if (gradient.type === `radial` && radial !== undefined) gradients = ctx.createRadialGradient(radial.x0, radial.y0, radial.r0, radial.x1, radial.y1, radial.r1);
    else throw new TypeError(`Profile.#setGradient: Invalid gradient type or missing parameters!`);

    gradient.colors.forEach(grad => gradients.addColorStop(grad.offset, grad.color));

    if (colorType === `fill` || colorType === `both`) ctx.fillStyle = gradients;
    if (colorType === `stroke` || colorType === `both`) ctx.strokeStyle = gradients;
  }

  /**
   * @param {object} options Параметры для отрисовки скруглённого квадрата
   * @param {number} options.x координаты x
   * @param {number} options.y координаты y
   * @param {number} options.w ширина
   * @param {number} options.h высота
   * @param {number} options.r радиус скругления
   * @returns {Profile}
   */
  drawRoundedRect({ x, y, w, h, r }: DrawRoundedRectOptions): Profile {
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
  render(renderTypes: RenderType = "image/png", quality?: number): Buffer {
    if (renderTypes === "image/png") return this.canvas.toBuffer(renderTypes);
    else if (renderTypes === "image/jpeg") return this.canvas.toBuffer(renderTypes, quality);
    else throw new TypeError("Profile.render(): This render is not supported other image/format types! Only image/jpeg and image/png are supported.");
  }
}


const loadImages = async () => {
  const bg = await sharp(`${imagePath}/bg.png`).resize(1000, 200, { fit: `cover` }).toBuffer();
  const badge = await sharp(`${imagePath}/avatar.png`).toBuffer();
  const bottombg = await sharp(`${imagePath}/tenshi.png`).resize(1000, 1447, { fit: `cover` }).toBuffer();
  const avatar = await sharp(`${imagePath}/kogasa.png`).resize(160, 160, { fit: `cover` }).toBuffer();
  const guildIconImg = await sharp(`${imagePath}/tenshi.png`).resize(80, 115, { fit: `cover` }).toBuffer();

  return { bg, badge, bottombg, avatar, guildIconImg };
}

const main: () => Promise<void>  = async () => {
  
  const canvas = createCanvas(1000, 700);
  const ctx = canvas.getContext("2d");
  const fonts = {
    size: `20px`,
    font: `Arial`
  }; 

  const { bg, badge, bottombg, avatar, guildIconImg } = await loadImages();

  type DrawRoundedRectType = { x: number, y: number, w: number, h: number, r: number };

  const _drawRoundedRect = ({ x, y, w, h, r }: DrawRoundedRectType) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  const icon = await loadImage(badge);
  const bgImg = await loadImage(bg);
  const bbg = await loadImage(bottombg);
  const avImg = await loadImage(avatar);
  const guildIcon = await loadImage(guildIconImg);

  //Баннер
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 1000, 200);
  ctx.clip();
  ctx.drawImage(bgImg, 0, 0);
  ctx.closePath();
  ctx.restore();

  //нижний фон
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 200, 1000, 500);
  ctx.clip();
  ctx.filter = `blur(1.1px)`;
  ctx.drawImage(bbg, 0, 0);
  ctx.closePath();
  ctx.restore();

  //внешнаяя рамка и фон аватарки
  ctx.save();
  ctx.beginPath();
  ctx.arc(150, 200, 98, 0, Math.PI * 2);
  ctx.strokeStyle = `#124124`;
  ctx.fillStyle = `#123123`
  ctx.lineWidth = 5;
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  //внутришняя рамка аватарки
  ctx.beginPath();
  ctx.arc(150, 200, 82.4, 0, Math.PI * 2);
  ctx.strokeStyle = `#124124`;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.closePath();

  //аватарка
  ctx.save();
  ctx.beginPath();
  ctx.arc(150, 200, 80, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avImg, 70, 120);
  ctx.closePath();
  ctx.restore();

  //Блок обводки (полоска)
  ctx.filter = `blur(1.1px)`;
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.lineTo(50, 200);
  ctx.lineWidth = 2;
  ctx.strokeStyle = `black`;
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(250, 200);
  ctx.lineTo(canvas.width, 200);
  ctx.stroke();
  ctx.closePath();
  
  //Блок обводки (аватарка)
  ctx.strokeStyle = `black`;
  ctx.lineWidth = 2;
  ctx.filter = `blur(0.7px)`;
  
  ctx.beginPath();
  ctx.arc(150, 200, 100.5, 0, Math.PI, true);
  ctx.stroke();
  ctx.closePath();

  ctx.filter = `blur(1.1px)`;
  ctx.beginPath();
  ctx.arc(150, 200, 100.5, 0, Math.PI, false);
  ctx.stroke();
  ctx.closePath();
  ctx.filter = `blur(0px)`;

  // Опыт
  const startAngle = -Math.PI / 2;
  const xp = 70;//77.5;
  const xpMax = 155;
  const endAngle = Math.PI * 2 * (xp / xpMax) - Math.PI / 2;

  ctx.beginPath();
  ctx.arc(150, 200, 90.2, startAngle, endAngle, false);
  ctx.strokeStyle = `lightgreen`;
  ctx.lineWidth = 10;
  ctx.globalAlpha = 0.8;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.closePath();

  // Ник
  ctx.fillStyle = 'black';
  _drawRoundedRect({ x: 290, y: 210, w: 380, h: 50, r: 11 });
  ctx.globalAlpha = 0.5;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Уровень
  ctx.fillStyle = `black`;
  ctx.globalAlpha = 0.5;
  _drawRoundedRect({ x: 750, y: 255, w: 200, h: 40, r: 11 });
  ctx.fill();
  ctx.globalAlpha = 1;

  // Титул (1 или несколько)
  ctx.fillStyle = '#b89e14'; //x 290
  ctx.globalAlpha = 0.8;
  _drawRoundedRect({ x: 290, y: 285, w: 380, h: 45, r: 11 });
  ctx.fill();
  ctx.globalAlpha = 1;

  // Место под "значки" или что-то другое
  ctx.fillStyle = `#091711`;
  ctx.globalAlpha = 0.7; //full = x: 780, w: 200, one = w: 40, x: 940
  _drawRoundedRect({ x: 940, y: 208, w: 40, h: 34, r: 11 });
  //ctx.fillRect(780, 210, 200, 30);
  ctx.fill();
  ctx.globalAlpha = 1;
  _drawRoundedRect({ x: 780, y: 206, w: 200, h: 38, r: 11 });
  //ctx.stroke();
  //ctx.strokeRect(780, 208, 200, 34);

  // другое. Значки
  /* ctx.fillStyle = `pink`; //x = 789, 7
  for (let i = 0, iconX = 816; i < 6; i++) {
  //if (i === 0) ctx.fillStyle = 'orange'; // доступ
  //if (i === 1) ctx.fillStyle = 'pink';
  ctx.fillRect(iconX, 215, 20, 20); // Позиция и размеры прямоугольника
  iconX += 27;
  } */

  //значок
  ctx.beginPath(); //full = x: 788, one = x: 948
  ctx.drawImage(icon, 948, 212);
  ctx.closePath();

  // Место под "био" и инфу про клан
  ctx.strokeStyle = `#124124`;
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.globalAlpha = 0.5;

  //блок био //w: 710, full = w: 960
  _drawRoundedRect({ x: 20, y: 370, w: 710 , h: 310, r: 11 });
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();
  ctx.closePath();

  //блок клана
  ctx.beginPath();
  ctx.stroke();
  ctx.fillStyle = 'white';
  ctx.globalAlpha = 0.5;
  
  _drawRoundedRect({ x: 750, y: 370, w: 230, h: 310, r: 11 });
  ctx.fill();
  ctx.strokeStyle = `#124124`;
  ctx.globalAlpha = 1;
  ctx.stroke();
  ctx.closePath();
  
  //блок аватарка клана
  ctx.save();
  ctx.beginPath();
  ctx.stroke();
  ctx.arc(775, 370, 40, 0, Math.PI * 2);
  ctx.fillStyle = `grey`;
  //ctx.fill();
  ctx.clip();
  ctx.drawImage(guildIcon, 735, 330, 80, 80);
  ctx.restore();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc (775, 370, 42, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.closePath();

  //Ник. Пока Белый цвет
  ctx.font = `Arial 25px`;
  ctx.fillStyle = `black`;

  function numberClip (num: string | number): string {
    if (typeof num != `string`) num = `${num}`;

    const numLength = num.length;

    return numLength >= 5 ? `${num.slice(0, 4)}k` : numLength >= 11 ? `${num.slice(0, 4)}kk` : numLength >= 16 ? `${num.slice(0, 4)}kk+` : num;
  }

  function parseSecond (s: number): { hours: number; minutes: number; seconds: number; } {
    const minutes = Math.floor(s / 60);
    const hours = Math.floor(minutes / 60);
    return {
      hours,
      minutes: minutes - (hours * 60),
      seconds: s % 60,
    };
  }

  function timeFormatter(time: number): string {
    if (typeof time != `number` || time < 0) throw new TypeError(`Входное значение в timeFormatter не является положительным числом!`);

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
  }
  const setFontStyle = ({ size, font, color, type = 1 }: SetFontStyleOptions) => {

    if (typeof size === `number`) size = `${size}px`;
    if (size) fonts.size = size;
    if (font) fonts.font = font;
    if (size || font) ctx.font = `${size ?? fonts.size} ${font ?? fonts.font}`;
    if (color) {
      if (type === 1 || type === 3) ctx.fillStyle = color;
      if (type === 2 || type === 3) ctx.strokeStyle = color;
    }
  }
  
  const drawText = async ({ x1, x2 = 0, y, text, textDirect = `normal`, dynamicOptions, fontOptions, clipNumber = false, timeFormat = false }: DrawTextOptions) => {
    if (clipNumber) text = numberClip(text);
    if (timeFormat) text = timeFormatter(Number(text));

    const iText = `${text}`;
    const dynamic = dynamicOptions?.dynamic || false;
    const isClip = dynamicOptions?.isClip || false;
    const linesNext = dynamicOptions?.lines ?? 1;
    const lineSpacing = dynamicOptions?.lineSpacing ?? 0;
    const dynamicCorrector = dynamicOptions?.dynamicCorrector ?? 0;
    const leftText = textDirect === `left`;
    const centerText = textDirect === `center`;
    const maxWidth = x2 > 0 ? x2 - x1 : x1;
    const ellipsisWidth = ctx.measureText(`...`).width;
    const dashWidth = ctx.measureText(`-`).width;
    const words = iText.split(` `);
    const lines = [``]; //массив строк
    const textMetrics = ctx.measureText(iText);
    const textWidth = textMetrics.width;
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    const isStartEmpty = /^\s/;
    const isEndEmpty = /\s$/;
    let truncatedText = iText;
    let currentLineIndex = 0;
    let cacheWord = ``;
    let beforeNewLine = ``;
    let startNum = 0;
    let x = x1;

    if (fontOptions) setFontStyle(fontOptions);
    if (dynamic || isClip) {
      if (isClip) {
        for (const word of words) {
          const testLine = lines[currentLineIndex] + (lines[currentLineIndex] ? ' ' : '') + word;
          
          if (currentLineIndex > linesNext) break;
          if (ctx.measureText(testLine).width < maxWidth) {
            const newLineIndex = word.indexOf(`\n`);

            if (newLineIndex === -1) {
              lines[currentLineIndex] = testLine;
            } else {
              const beforeNewLine = testLine.slice(0, (testLine.length - word.length) + newLineIndex);
              const afterNewLine = word.slice(newLineIndex + 1);
              
              lines[currentLineIndex++] = beforeNewLine;
              
              if (currentLineIndex <= linesNext) lines[currentLineIndex] = afterNewLine;
            }
            continue;
          }

          cacheWord = testLine;

          /**
           * @param {string} cache входящий текст для изменений 
           * @param {number} [elseWidth] дополнительное значение, что будет участвовать в цикле 
           * @returns {string}
           */
          const whileClip = (cache: string, elseWidth?: number): string => {
            let cached = cache;
            while(ctx.measureText(cached).width + (elseWidth ?? 0) > maxWidth) {
              if (cached.length === 0) throw new TypeError(`infinite while`);

              cached = cached.slice(0, -1);
            }
            return cached;
          }
          /** 
             * @param {object} options параметры
             * @param {string} options.text  входящий текст
             * @param {string} options.cache кеш-переменная
             * @param {number} options.curInd текущий индекс
             * @returns {string}
             */
          const textFormater = ({ text, cache, curInd }: TextFormatterOptions): string => {
            return curInd < linesNext ? ((isStartEmpty.test(text) || isEndEmpty.test(cache)) ? cache : `${cache}-`) : dynamic && curInd === linesNext ? (isEndEmpty.test(cache) ? `${cache.slice(0, -1)}...` : `${cache}...`) : cache; 
          }
          
          cacheWord = whileClip(cacheWord, currentLineIndex < linesNext ? dashWidth : (dynamic && currentLineIndex === linesNext ? (ellipsisWidth + dynamicCorrector): 0));
          const cacheWordNewIndex = cacheWord.indexOf(`\n`);
          
          if (cacheWordNewIndex !== -1) cacheWord = cacheWord.slice(0, cacheWordNewIndex);

          const tLClip = testLine.slice(cacheWord.length + (cacheWordNewIndex === -1 ? 0 : 1));
          const testLineClip = tLClip.startsWith(`-`) ? tLClip.slice(1) : tLClip;
          const textFormated = textFormater({ text: testLineClip, cache: cacheWord, curInd: currentLineIndex, dynamic, linesNext });
          lines[currentLineIndex] = textFormated.endsWith(`--`) ? textFormated.slice(0, -1) : textFormated;
          let cacheLine = isStartEmpty.test(testLineClip) ? testLineClip.slice(1) : testLineClip;
          
          ++currentLineIndex;
          
          if (currentLineIndex <= linesNext) {
            lines[currentLineIndex] = ``;
            if (testLineClip.length >= cacheWord.length) {
              const lineCache = [];
              cacheWord = cacheLine;
              const nextLineNum = lines[0].length + 5;
              for (let i = 0; i <= cacheWord.length; i++) {
                if (lineCache.length + currentLineIndex >= linesNext + 1) break;

                const sliceNum = nextLineNum * (i + 1);
                let clipedWord = `${beforeNewLine ?? ``}${cacheLine.slice(startNum, sliceNum)}`;
                startNum = sliceNum;
                const newClipWordIndex = clipedWord.indexOf(`\n`);
                
                if (newClipWordIndex !== -1) {
                  beforeNewLine = clipedWord;
                  clipedWord = clipedWord.slice(0, newClipWordIndex);
                  beforeNewLine = beforeNewLine.slice(newClipWordIndex + 1);
                } else beforeNewLine = ``;
                
                lineCache.push(clipedWord);
                cacheWord = cacheWord.slice(clipedWord.length);
              }
              
              cacheWord = ``;
              cacheLine = ``;

              for (const line of lineCache) {
                cacheWord = whileClip(line, currentLineIndex <= linesNext ? dashWidth : (dynamic && currentLineIndex === linesNext ? (ellipsisWidth + dynamicCorrector): 0));
                const textFormated = textFormater({ text: line, cache: cacheWord, curInd: currentLineIndex, dynamic, linesNext });
                lines[currentLineIndex] = (textFormated.endsWith(`-`) && lineCache[lineCache.length - 1] == line || textFormated.endsWith(`--`)) ? textFormated.slice(0, -1) : textFormated;
                ++currentLineIndex;
              }

            } else lines[currentLineIndex] = testLineClip;
          }  
        }
      }
  
      if (textWidth > maxWidth && !isClip) {
        while (ctx.measureText(truncatedText).width + (ellipsisWidth + dynamicCorrector) > maxWidth) {
          if (truncatedText.length == 0) throw new TypeError(`Бесконечный while!`);
            
          truncatedText = truncatedText.slice(0, -1);
        }

        truncatedText = truncatedText === text ? text : `${truncatedText}...`;
      }
    }

    if (leftText) ctx.textAlign = `right`;
    if (centerText) (ctx.textAlign = `center`), x = (x1 + x2) / 2;
    if (isClip) lines.forEach((line, i) => ctx.fillText(line, x, y + i * (textHeight + lineSpacing))), lines.length = 0;
    else ctx.fillText(truncatedText, x, y);
    if (leftText || centerText) ctx.textAlign = `start`;
  }


  function drawTexts(args: DrawTextOptions[], options: DrawTextsOption): void;
  function drawTexts(args: DrawTextOptions[]): void
  function drawTexts(args: DrawTextOptions[], option?: DrawTextsOption): void {
    let index = 0;
    /** @type {object} */
    let cache: object;
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

      await drawText(data);
    });
  }

  drawTexts([
    //Bio текст. x2: 710, full = x2: 970
    { text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem-accusantium-doloremque-laudantium.-accusantium-doloremque-laudantium.-voluptatem-accusantium-doloremque-laudantium.1`, x1: 30, x2: 710, y: 400, dynamicOptions: { dynamic: true, dynamicCorrector: 1, isClip: true, lineSpacing: 17, lines: 10 }, fontOptions: { size: 25 } }, 
    //Никнейм
    { text: `Ran`, x1: 294, x2: 670, y: 245, dynamicOptions: { dynamic: true }, fontOptions: { color: `white`, size: 35 } },
    //титул
    { text: `Developer`, x1: 294, x2: 670, y: 316, textDirect: `center`, dynamicOptions: { dynamic: true }, fontOptions: { color: `black`, size: 27 } },
    //имя гильдии. С авой - y: 440, без авы - y: 400
    { text: `Имя гильдии/клана очень-и-очень большое`, x1: 762.5, x2: 970, y: 440, dynamicOptions: { dynamic: true, isClip: true, lines: 1 }, fontOptions: { size: 25 } },
    //тип гильдии. С авой - y: 520, без авы: y: 480 
    { text: `Тип: гильдия`, x1: 763, x2: 965, y: 520, dynamicOptions: { dynamic: true }, fontOptions: { size: 20 } },
    //количество участников. С авой - y: 575, без авы - y: 535
    { text: `Участники: 100/100`, x1: 763, x2: 965, y: 575, dynamicOptions: { dynamic: true }, fontOptions: { size: 20 } },
    //должность. С авой - y: 630, без авы - y: 590
    { text: `Позиция: Участник`, x1: 763, x2: 965, y: 630, dynamicOptions: { dynamic: true }, fontOptions: { size: 20 } },
    //уровень
    { text: `Сфера Полубога`, x1: 752, x2: 947, y: 280, textDirect: `center`, dynamicOptions: { dynamic: true, isClip: true, dynamicCorrector: -10 }, fontOptions: { size: 15, color: `white` } },
  ]);

  const res = canvas.toBuffer(`image/png`);

  await sharp(res).toFile(`./abyss/res.png`);

};

//main();
const someTest: () => Promise<void> = async () => {
  const { bg, badge, bottombg, avatar, guildIconImg } = await loadImages();

  const icon = await loadImage(badge);
  const bgImg = await loadImage(bg);
  const bbg = await loadImage(bottombg);
  const avImg = await loadImage(avatar);
  const guildIcon = await loadImage(guildIconImg);

  const test = new Profile();
  test
    .drawBG({ images: [bgImg, bbg], draw: `image`, positions: [{ x: 0 }, { x: 0, width: 1000, height: 1447, y: 5, blurOptions: { bottom: 1.1 } }] })
    .drawInline()
    .drawAvatar({ avatar: avImg, xp: { now: 50, max: 150 }, avatarPosition: { x: 150, y: 200, image: { x: 68, y: 118, radius: 82 } }, lineBorder: { blurOption: { top: 0.8, bottom: 1.1 } } })
    /*.drawTemplateBlocks([{ templateType: `username` }, { templateType: `title` }, { templateType: `bio` }, { templateType: `guild` }, { templateType: `level` }, { templateType: `badge` }])*/
    .drawBlocks([{ 
      x: 290, y: 140, w: 380, h: 50, r: 11, globalAlpha: 0.5, color: "black", drawType: `both`, strokeLineWidth: 2 }, 
    { x: 290, y: 230, w: 380, h: 45, r: 11, color: { fill: `#b89e14`, stroke: `orange`}, globalAlpha: { fill: 0.8, stroke: 0.5 }, drawType: `both`, strokeLineWidth: 2 },  
    /*{ x: 0, y: 370, w: 600, h: 310, r: 11, x_position: `center`, color: { fill: `white`, stroke: `#124124` }, globalAlpha: { fill: 0.5 }, drawType: `both`, strokeLineWidth: 5 },*/  //x: 20, y: 370, w: 710, h: 310
    /*{ x: 750, y: 370, w: 230, h: 310, r: 11, drawType: `both`, globalAlpha: { fill: 0.5 }, color: { fill: `white`, stroke: `#124124` } }, */ //710, full = w: 960
    { x: -30, y: 234, w: 200, h: 40, r: 11, globalAlpha: 0.5, color: "black", x_position: `right`, drawType: "both", strokeLineWidth: 2 }, 
    /*{ x: -20, y: 155, w: 40, h: 34, r: 11, x_position: `right`, color: { fill: `#091711`, stroke: `black` }, globalAlpha: { fill: 0.7, stroke: 0.5 }, drawType: "both", strokeLineWidth: 2 }*/])
    .drawTexts([
      //Bio текст. x1: 30, x2: 710, full = x2: 970,
      //Никнейм
      { text: `Ran`, x1: 294, x2: 670, y: 178, dynamicOptions: { dynamic: true }, fontOptions: { color: `white`, size: 35 } },
      //титул
      { text: `Developer`, x1: 294, x2: 668, y: 260, textDirect: `center`, dynamicOptions: { dynamic: true, lines: 0, dynamicCorrector: -11 }, fontOptions: { color: `black`, size: 27 } },
      //имя гильдии. С авой - y: 440, без авы - y: 400
      /*{ text: `Имя гильдии/клана очень-и-очень большое`, x1: 762.5, x2: 970, y: 440, dynamicOptions: { dynamic: true, isClip: true, lines: 1 }, fontOptions: { size: 25 } },
      //тип гильдии. С авой - y: 520, без авы: y: 480 
      { text: `Тип: гильдия`, x1: 763, x2: 965, y: 520, dynamicOptions: { dynamic: true }, fontOptions: { size: 20 } },
      //количество участников. С авой - y: 575, без авы - y: 535
      { text: `Участники: 100/100`, x1: 763, x2: 965, y: 575, dynamicOptions: { dynamic: true }, fontOptions: { size: 20 } },
      //должность. С авой - y: 630, без авы - y: 590
      { text: `Позиция: Участник`, x1: 763, x2: 965, y: 630, dynamicOptions: { dynamic: true }, fontOptions: { size: 20 } },*/
      //уровень
      { text: `Сфера Полубога`, x1: 772, x2: 970, y: 258, textDirect: `center`, dynamicOptions: { dynamic: true, dynamicCorrector: -2, lines: 0 }, fontOptions: { size: 15, color: `white` } },
    ])
    .drawTemplateBlock({
      bioCenter: {}
    })
    //.drawGuildIcon({ x1: 775, y1: 370, r: 40, x2: 735, y2: 330, w: 80, h: 80, icon: guildIcon })
    .drawTemplateText({ 
      bioCenter: { 
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem-accusantium-doloremque-laudantium.-accusantium-doloremque-laudantium.-voluptatem-accusantium-doloremque-laudantium.1` 
      },
      /*guild: {
        guildName: { text: `Имя гильдии/клана очень-и-очень большое` },
        guildType: { text: `Тип: гильдия` },
        members: { text: `Участники: 100/100` },
        perms: { text: `Позиция: Участник` },
        guildIcon: true
      }*/
    })
    .drawBadge( [{ badge: icon }, { badge: icon }, { badge: icon }, { badge: icon }, { badge: icon }], { x: -20, y: 155 })

  //full = x: 780, w: 200, one = w: 40, x: 940 - координаты под "значки"
  sharp(test.render()).toFile(`./abyss/res.png`);
};

const guildProfile = async () => {
  const { bg, badge, bottombg, avatar, guildIconImg } = await loadImages();
  const canvas = createCanvas(1000, 700);
  const ctx = canvas.getContext("2d");
  
  const icon = await loadImage(badge);
  const bgImg = await loadImage(bg);
  const bbg = await loadImage(bottombg);
  const avImg = await loadImage(avatar);
  const guildIcon = await loadImage(guildIconImg);
  
  //блок - просто область профиля
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();
  ctx.closePath();

  //аватарка
  ctx.save();
  ctx.beginPath();
  ctx.arc(100, 100, 75, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avImg, 25, 25, 150, 150);
  ctx.lineWidth = 5;
  ctx.strokeStyle = `#019b01`;
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
  
  //блок - разделение банера и остальной части профиля гильдии
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.lineTo(canvas.width, 200);
  ctx.stroke();
  ctx.closePath();

  //блок - тип гильдии
  ctx.save();
  ctx.beginPath();
  ctx.translate(950, 150);
  ctx.rect(-150, 0, 180, 30);
  //ctx.fillStyle = `#0097c9`;
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.moveTo(-60, 0);
  ctx.lineTo(-60, 30);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  //блок - участники
  ctx.beginPath();
  ctx.rect(20, 220, 250, 460);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.moveTo(20, 270);
  ctx.lineTo(270, 270);
  ctx.stroke();
  ctx.closePath();

  //блок - название
  ctx.beginPath();
  ctx.rect(200, 25, 250, 50);
  ctx.stroke();
  ctx.closePath();

  //блок - статус
  ctx.beginPath();
  ctx.rect(200, 90, 350, 80);
  ctx.stroke();
  ctx.closePath();

  //блок - описание гильдии
  ctx.beginPath();
  ctx.rect(365, 430, 550, 250);
  ctx.stroke();
  ctx.closePath();

  sharp(canvas.toBuffer(`image/png`)).toFile(`./abyss/guild.png`);
}
guildProfile();
//someTest();

interface DrawBadgeOptinalOptions extends X_And_Y  {
  bgColor?: StringOrGradient | FillOrStrokeOption<string>;
  bgW?: number; //ширина блока для значков
  bgH?: number; //высота блока для значков
  bgR?: number; //скругление углов
  bgLineWidth?: number;
  offStroke?: boolean;
  globalAlpha?: number | FillOrStrokeOption;
  blur?: number | FillOrStrokeOption;
  bgFill?: "full" | "unique" | "none"; //влияет только при наличии массива
}

interface DrawBadgeOptions extends Partial<X_And_Y> {
  space?: number; //отступ между значками
  badge: Image; //то, что будет загружаться
  w?: number; //ширина значка. w + space = отступ между значками
  h?: number; //высота значка. Если не указано, то h = w
  globalAlpha?: number; //прозрачность. Не знаю - надо или нет. Но пусть будет
  blur?: number; //размытие. Так-же не знаю. Потом увижу
  priority?: number; //как размещать их. 0 - выший приоритет. Если нет - будет по их расположению в массиве. Если это не массив - оно не будет иметь влияния. Просто не стакайте их на одном месте хд
}

interface DrawGuildIconOptions {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  w: number;
  h: number;
  r: number;
  borderLineWidth?: number;
  borderColor?: StringOrGradient;
  icon: Image | StringOrGradient;
  globalAlpha?: number | BorderOrIcon;
  blurOptions?: number | BorderOrIcon;
  offBorder?: boolean;
}

interface TemplateTextOptions {
  username?: TemplateText; 
  title?: TemplateText; 
  bio?: TemplateText;
  bioFull?: TemplateText;
  bioCenter?: TemplateText; 
  guild?: GuildTemplateTextOptions; 
  level?: TemplateText;
  [key: string]: TemplateText | GuildTemplateTextOptions | undefined;
}

interface GuildTemplateTextOptions {
  guildName: IconGuildTextShift; //имя гильдии
  guildType: IconGuildTextShift; //тип гильдии
  members: IconGuildTextShift; //текст для гильдии
  perms: IconGuildTextShift; //это позиция в гильдии
  guildIcon?: boolean; //есть ли аватарка. От этого зависит расположение текста
  [key: string]: IconGuildTextShift | boolean | undefined;
}

/** 
 * На сколько нужно "отступить" `y` в случае наличия аватарки. 
 * 
 * Например - у нас есть `y: 400`. Дабы оно не мешало аватарке мы укажем `iconShift: 40`. В результате `y = 440`.
 */
interface IconGuildTextShift extends TemplateText {
  iconShift?: number; //на сколько "съехать"
}

interface TemplateBlocksOptions {
  username?: TemplateBlock; 
  title?: TemplateBlock; 
  bio?: TemplateBlock;
  bioFull?: TemplateBlock;
  bioCenter?: TemplateBlock; 
  guild?: TemplateBlock; 
  badge?: TemplateBlock;
  level?: TemplateBlock;
  [key: string]: TemplateBlock | undefined;
}

interface PriorityOption {
  priority?: 1 | 2 | 3 | 4 | 5 | 6;
}

interface BaseDrawBlocksOptions {
  color?: string | FillOrStrokeOption<string> | GradientOptions; 
  globalAlpha?: number | FillOrStrokeOption;
  drawType?: TypeDrawImageOrColor | "both";
  strokeLineWidth?: number; 
  blurOptions?: number | FillOrStrokeOption;
  name?: string;
}

interface DrawRoundedRectOptions { 
  x: number; 
  y: number; 
  w: number; 
  h: number; 
  r: number; 
}

interface DrawImageAvatarOptions extends DrawAvatarOptions { 
  avatar: Image; 
}

interface DrawColorAvatarOptions extends DrawAvatarOptions { 
  avatar: string | GradientOptions; 
}

interface DrawAvatarOptions {
  xp: XPOptions;
  avatarPosition: AvatarPositionOptions;
  avatarBorder?: BorderOptions & { backgroundColor?: string | GradientOptions, inRadius?: number, outRadius?: number };
  blurOptions?: AvatarBlurOptions;
  lineBorder?: LineBorderOptions;
}

interface LineBorderOptions extends BorderOptions, Partial<X_And_Y> {
  off?: boolean;
  blurOption?: {
    both?: number, 
    top?: number, 
    bottom?: number; 
  };
  globalAlpha?: number;
  radius?: number;
}

interface XPOptions {
  now: number;
  max: number;
  color?: string | GradientOptions;
  lineWidth?: number;
  globalAlpha?: number;
  position?: X_And_Y & { radius?: number; };
}

interface Dimensions {
  width?: number;
  height?: number;
}

interface AvatarPositionOptions extends X_And_Y {
  image?: X_And_Y & { radius?: number; };
  radius?: number;
  width?: number;
  height?: number;
}

interface BorderOptions {
  color?: string | GradientOptions;
  lineWidth?: number;
}

interface AvatarBlurOptions {
  avatar?: number;
  border?: { 
    out?: number;
    in?: number;
  }
  xp?: number;
}

interface TextFormatterOptions {
  text: string; 
  cache: string; 
  curInd: number; 
  linesNext: number;
  dynamic: boolean;
}

interface DrawBGDrawTypeColor {
  draw: "color";
  color?: FillOrStrokeOption<string>;
  gradient?: GradientOptions;
  typeDraw?: DrawBGType;
  drawPriority?: TypeDrawImageOrColor;
  blur?: number;
  x: number;
  y: number;
  isClip?: boolean;
  globalAlpha?: number;
  drawType?: TypeDrawImageOrColor | "both" | "none"; //если человек хочет сам выбрать через this.ctx fill/stroke или оба сразу
  strokeLineWidth?: number;
  arcOptions?: ArcType;
  rectOptions?: RectType;
}

interface DrawBGTypeFull {
  images: ArrayLimited<Image, 2>;
  draw: "image";
  positions: ArrayLimited<{
    x: number;
    y?: number;
    blurOptions?: BlurOptions;
    drawType?: TypeDrawImageOrColor;
    strokeLineWidth?: number;
    globalAlpha?: number;
    isStroke?: boolean;
    strokeColor?: string;
    gradient?: GradientOptions;
    isClip?: boolean;
    rotation?: number;
    shadow?: ShadowOptions & X_And_Y;
    scale?: X_And_Y;
    translate?: X_And_Y;
  } & Dimensions, 1 | 2>;
}

interface DrawBGTypeAllOne extends Dimensions {
  image: Image;
  imagePosition?: DrawBGPosition;
  draw: "image";
  x: number;
  y?: number;
  blurOptions?: BlurOptions;
  isStroke?: boolean;
  strokeLineWidth?: number;
  strokeColor?: string;
  gradient?: GradientOptions;
  globalAlpha?: number;
  isClip?: boolean;
  rotation?: number;
  shadow?: ShadowOptions & X_And_Y;
  scale?: X_And_Y;
  translate?: X_And_Y;
}

interface ApplyBGImageTransformationsOptions {
  scale?: X_And_Y;
  translate?: X_And_Y; 
  rotation?: number;
  shadow?: ShadowOptions & X_And_Y;
  globalAlpha?: number;
  strokeLineWidth?: number;
  strokeColor?: string;
  gradient?: GradientOptions;
  blurOptions?: BlurOptions;
  imagePosition: DrawBGPosition;
}

interface ShadowOptions {
  color: string;
  blur?: number;
}

interface X_And_Y {
  x: number;
  y: number;
}

interface BlurOptions {
  banner?: number;
  bottom?: number;
  full?: number;
}

interface RectType {
  width: number;
  height: number;
}

interface ArcType {
  radius1: number;
  radius2?: number;
  startAngle: number;
  endAngle: number;
  counterclockwise?: boolean;
  isScale?: boolean;
}

interface SetFontStyleOptions {
  size?: number | string;
  font?: string;
  color?: CanvasColorOptions;
  type?: 1 | 2 | 3;
}

interface DrawTextOptions extends TextBase {
  x1: number;
  x2?: number;
  y: number;
  x_translate?: number;
}

interface TextBase {
  text: string | number;
  textDirect?: "normal" | "center" | "left";
  fontOptions?: SetFontStyleOptions;
  clipNumber?: boolean;
  timeFormat?: boolean;
  dynamicOptions?: DrawDynamicOptions;
}

interface DrawDynamicOptions {
  dynamic?: boolean;
  dynamicCorrector?: number;
  isClip?: boolean;
  lines?: number;
  lineSpacing?: number;
}

interface GradientOptions {
  type?: "linear" | "radial";
  colorType?: TypeDrawImageOrColor | "both";
  colors: GradientColorStop[];
  linear?: LinearGradientOptions;
  radial?: RadialGradientOptions;
}

interface GradientColorStop {
  offset: number;
  color: string;
}

interface LinearGradientOptions {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface RadialGradientOptions {
  x0: number;
  y0: number;
  r0: number;
  x1: number;
  y1: number;
  r1: number;
}

interface DrawTextsBase {
  dynamicOptions?: DynamicOptionDrawsText[];
}

interface StaticOptions {
  update?: Partial<DrawTextOptions>;
  start?: number;
  end?: number;
}

interface DynamicOptions {
  start?: number;
  end?: number;
  cache?: boolean;
}

interface UpdateDynamicDrawText {
  update: Partial<DrawTextOptions>;
}

interface TemplateType {
  banner: TemplatePositionType;
  full: TemplatePositionType;
  bottom: TemplatePositionType;
}

interface PrivateDrawImageOptions { 
  temType: PDImagePosition;
  templateType: TemplateType;
  blurOptions?: BlurOptions;
  image: Image; 
  dx: number; 
  dy: number; 
  dw: number; 
  dh?: number;
}

interface DrawBlocksOptions extends BaseDrawBlocksOptions, DrawRoundedRectOptions {
  x_position?: XTemplatePosition;
}

interface TemplatePositionType { 
  x: number; 
  y: number;
  width: number;
  height: number; 
}

type FillOrStrokeOption<T = number, K = T> = { fill?: T; stroke?: K };

type BorderOrIcon<T = number, K = T> = { border?: T; icon?: K; };

type StringOrGradient = string | GradientOptions;

type TemplateText = TextBase & Partial<DrawTextOptions> & PriorityOption;

type TemplateBlock = BaseDrawBlocksOptions & PriorityOption;

type CanvasColorOptions = string | CanvasGradient | CanvasPattern;

type DynamicOptionDrawsText = DynamicOptions & UpdateDynamicDrawText;

type DrawTextsOption = DrawTextsBase & StaticOptions;

type XTemplatePosition = "right" | "center" | "left";

type DrawBGPosition = "banner" | "full" | "bottom";

type PDImagePosition = Exclude<DrawBGPosition, "full">

type DrawBGType = "rect" | "arc";

type TypeDrawImageOrColor = "fill" | "stroke";

type StringNumber = string | number;

type RenderType = "image/png" | "image/jpeg";

type DrawOption = DrawBGDrawTypeColor | DrawBGTypeFull | DrawBGTypeAllOne;

type ArrayLimited<T, K extends number> = [T, ...T[]] & { length: K };