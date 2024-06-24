import { createCanvas, loadImage, type Canvas, type SKRSContext2D, type Image } from "@napi-rs/canvas";
import sharp from "sharp";

class Profile {
  canvas: Canvas;
  ctx: SKRSContext2D;
  fonts = {
    size: `20px`,
    font: `Arial`
  };
  /** Для более подробной инфы - гляди на основную sharp функцию ;D (просто добавь скобки) */
  _sharp = sharp;

  constructor() {
    this.canvas = createCanvas(1000, 700);
    this.ctx = this.canvas.getContext(`2d`);
  } 
  
  drawBG(): Profile;
  drawBG(options: DrawBGTypeAllOne): Profile;
  drawBG(options: DrawBGTypeFull): Profile;
  drawBG(options: DrawBGDrawTypeColor): Profile;
  drawBG(option?: unknown): Profile {
    const ctx = this.ctx; 
    const canvas = this.canvas;
    const options = option as DrawOption;

    if (!option) (ctx.fillStyle = `#313338`, ctx.fillRect(0, 0, canvas.width, canvas.height));
    else if (this.#isDrawBGColor(options)) this.#drawBGColor(option as DrawBGDrawTypeColor);
    else if (this.#isDrawBGOneImage(options)) this.#drawBGOneImage(option as DrawBGTypeAllOne);
    else if (this.#isDrawBGTwoImage(options)) this.#drawBGTwoImage(option as DrawBGTypeFull);
    else throw new TypeError(`Invalid DrawBG options! (${options})`);
    
    
    this._sharp
    return this;
  }
  
  #isDrawObject(option: any): option is DrawOption {
    return typeof option === `object` && `draw` in option;
  }

  #isDrawBGColor(option: DrawOption): option is DrawBGDrawTypeColor {
    return this.#isDrawObject(option) && option.draw === `color` && !(`image` in option) && !(`type` in option);
  }

  #isDrawBGOneImage(option: DrawOption): option is DrawBGTypeFull {
    return this.#isDrawObject(option) && option.draw === `image` && `image` in option && `type` in option && !(`image1` in option) && !(`image2` in option);
  }

  #isDrawBGTwoImage(option: DrawOption): option is DrawBGTypeAllOne {
    return this.#isDrawObject(option) && option.draw === `image` && `image1` in option && `image2` in option && !(`image` in option);
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

  #drawBGOneImage({ x, y, image, imagePosition = `baner`,  draw = `image`, isStroke = false, width = this.canvas.width, height, blur, strokeLineWidth, globalAlpha, isClip, rotation, shadow, scale, translate, strokeColor, gradient }: DrawBGTypeAllOne): Profile {
    const ctx = this.ctx;
    const canvas = this.canvas;

    if (draw !== `image`) throw new TypeError(`Profile.#drawBGOneImage: Why draw a "${draw}"? This draw is not "image"!`);

    ctx.save();

    const templateType: TemplateType = {
      baner: { x: 0, y: 0, width: canvas.width, height: 200 },
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

    ctx.beginPath();

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
    
    if (blur !== undefined) ctx.filter = `blur(${blur}px)`;
    
    ctx.drawImage(image, width, height ?? position.height, x, y);

    if (isStroke) ctx.stroke();

    ctx.closePath();

    if (isClip) ctx.restore();

    ctx.restore();

    return this;
  }
  
  #drawBGTwoImage(args: DrawBGTypeFull): Profile { 
    const ctx = this.ctx;
    return this;
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
}


(async () => {
  
  const canvas = createCanvas(1000, 700);
  const ctx = canvas.getContext("2d");
  const fonts = {
    size: `20px`,
    font: `Arial`
  }; 

  const bg = await sharp(`./abyss/images/bg.png`).resize(1000, 200, { fit: `cover` }).toBuffer();
  const badge = await sharp(`./abyss/images/avatar.png`).toBuffer();
  const bottombg = await sharp(`./abyss/images/tenshi.png`).resize(1000, 1447, { fit: `cover` }).toBuffer();
  const avatar = await sharp(`./abyss/images/kogasa.png`).resize(160, 160, { fit: `cover` }).toBuffer();
  const guildIconImg = await sharp(`./abyss/images/tenshi.png`).resize(80, 115, { fit: `cover` }).toBuffer();

  const _drawRoundedRect = ({ x, y, w, h, r }: { x: number, y: number, w: number, h: number, r: number }) => {
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
          const textFormated = textFormater({ text: testLineClip, cache: cacheWord, curInd: currentLineIndex });
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
                const textFormated = textFormater({ text: line, cache: cacheWord, curInd: currentLineIndex });
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

})();

interface TextFormatterOptions {
  text: string; 
  cache: string; 
  curInd: number; 
}

interface DrawBGDrawTypeColor {
  draw: "color";
  color?: ColorOptions;
  gradient?: GradientOptions;
  typeDraw?: DrawBGType;
  drawPriority?: TypeDrawImageOrColor;
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
  image1: Image;
  image2: Image;
  draw: "image";
  x1: number;
  x2?: number;
  y1: number;
  y2?: number;
  width1?: number;
  width2?: number;
  height1?: number;
  height2?: number;
  image1Blur?: BlurOptions;
  image2Blur?: BlurOptions;
  drawTypeImage1?: TypeDrawImageOrColor;
  drawTypeImage2?: TypeDrawImageOrColor;
  strokeLineWidth1?: number;
  strokeLineWidth2?: number;
  globalAlpha1: number;
  globalAlpha2: number;
}

interface DrawBGTypeAllOne {
  image: Image;
  imagePosition?: DrawBGPosition;
  draw: "image";
  x: number;
  y: number;
  width?: number;
  height?: number;
  blur?: number;
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

interface ShadowOptions {
  color: string;
  blur?: number;
}

interface X_And_Y {
  x: number;
  y: number;
}

interface ColorOptions {
  fill?: string;
  stroke?: string;
}

interface BlurOptions {
  blur: number;
  type?: DrawBGType;
  x?: number;
  y?: number;
  color?: string;
  arcOptions?: ArcType;
  drawType?: TypeDrawImageOrColor;
  strokeLineWidth?: number;
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

interface DrawTextOptions {
  x1: number;
  x2?: number;
  y: number;
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

interface DrawImageOptions {
  image?: Image;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  radiusX?: number;
  radiusY?: number;
  radiusA?: number;
  isScale?: boolean;
  type?: "bg" | "xpBar" | "avatar";
  otherOptions?: ExpBarOptions;
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

interface DrawExpBarBase {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}

interface ExpBarOptions {
  xp: number;
  xpMax: number;
  lineWidth?: number;
  color?: CanvasColorOptions;
}

interface DrawTextsBase {
  dynamicOptions?: DynamicOptionDrawsText[];
}

interface DrawImagesBase {
  dynamicOptions?: DynamicOptionsDrawImages[];
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
  
interface UpdateDynamicDrawImages {
  update: Partial<DrawImageOptions>;
}

interface TemplateType {
  baner: { x: number, y: number, width: number, height: number };
  full: { x: number, y: number, width: number, height: number };
  bottom: { x: number, y: number, width: number, height: number };
}

type CanvasColorOptions = string | CanvasGradient | CanvasPattern;

type DynamicOptionDrawsText = DynamicOptions & UpdateDynamicDrawText;

type DynamicOptionsDrawImages = DynamicOptions & UpdateDynamicDrawImages;

type DrawImagesOptions = DrawImagesBase & StaticOptions;

type DrawTextsOption = DrawTextsBase & StaticOptions;

type DrawExpBarOptions = DrawExpBarBase & ExpBarOptions;

type DrawBGPosition = "baner" | "full" | "bottom";

type DrawType = "image" | "color";

type DrawBGType = "rect" | "arc";

type TypeDrawImageOrColor = "fill" | "stroke";

type DrawOption = DrawBGDrawTypeColor | DrawBGTypeFull | DrawBGTypeAllOne;