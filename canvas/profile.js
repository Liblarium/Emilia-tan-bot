const avatar = document.createElement(`img`);
const baner = document.createElement(`img`);
const clan_avatar = document.createElement(`img`);
const bg = document.createElement(`img`);
const icon = document.createElement(`img`);
const canvas = document.createElement(`canvas`);

canvas.width = 1000;
canvas.height = 700;


/** @type {{canvas: HTMLCanvasElement; cnt: CanvasRenderingContext2D; font: { size: string, fontStyle: string, color: {[key: string]: string } }, defaultContent: { globalAlpha: number, textAlign: CanvasTextAlign, textBaseline: CanvasTextBaseline } }} */
class Profile {
  /** @type {{ globalAlpha: number, textAlign: CanvasTextAlign, textBaseline: CanvasTextBaseline }} */
  defaultContent = {
    globalAlpha: 1,
    textAlign: "start",
    textBaseline: "alphabetic"
  }

  fonts = {
    size: `20px`,
    font: `Arial`
  }

  constructor() {
    const content = canvas.getContext('2d');

    if (!content) return;

    this.canvas = canvas;
    this.cnt = content;

    document.body.appendChild(canvas);
  }

  /**
   * @overload
   * @returns {Profile}
   *//**
 * @overload
 * @param {DrawBGTypeAllOne} options
 * @returns {Profile}
 *//**
  * @overload
  * @param {DrawBGTypeFull} options
  * @returns {Profile}
  *//**
  * @overload
  * @param {DrawBGDrawTypeColor} options
  * @returns {Profile}
  *//**
  * @param {unknown} [option]
  * @returns {Profile}
  */
  drawBG(option) {
    const cnt = this.cnt;

    if (!option) {
      cnt.fillStyle = `#313338`;
      cnt.fillRect(0, 0, canvas.width, canvas.height);
    }

    return this;
  }

  /** 
   * @param {SetFontStyleOptions} options опции для установки стиля
   * @returns {Profile}
   */
  setFontStyle({ size, font, color, type = 1 }) {
    const cnt = this.cnt;
    const fonts = this.fonts;

    if (typeof size === `number`) size = `${size}px`;
    if (size) fonts.size = size;
    if (font) fonts.font = font;
    if (size || font) cnt.font = `${size ?? fonts.size} ${font ?? fonts.font}`;
    if (color) {
      if (type === 1 || type === 3) cnt.fillStyle = color;
      if (type === 2 || type === 3) cnt.strokeStyle = color;
    }

    return this;
  }

  drawBanner() {
    const ctx = this.cnt;

    // Фон
    ctx.fillStyle = '#123123';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //блок фулл фон
    ctx.save();
    ctx.beginPath();
    ctx.drawImage(bg, 0, -280, canvas.width, 1230);
    ctx.restore();
    ctx.closePath();

    //блок фон сферху
    /*ctx.save();
    ctx.beginPath();/*
    /*ctx.moveTo(51, 200);
    ctx.lineTo(0, 200);
    ctx.lineTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, 200);
    ctx.arc(150, 200, 100, 0, Math.PI, true);
    ctx.lineTo(250, 200);*/
    /*ctx.rect(0, 0, canvas.width, 200);
    ctx.fillStyle = `#124124`;
    ctx.fill();
    ctx.clip();
    ctx.drawImage(bg, 0, -280, canvas.width, 1230);
    ctx.restore();
    ctx.closePath();

    //блок фон внизу
    ctx.save();
    ctx.beginPath();*/
    /*ctx.moveTo(50, 200);
    ctx.lineTo(0, 200);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width, 200);
    ctx.lineTo(250, 200);
    ctx.arc(150, 200, 100, 0, Math.PI, false);*/
    /*ctx.fillStyle = `#123123`;
    //ctx.fill();
    ctx.rect(0, 200, canvas.width, canvas.height);
    ctx.clip();
    ctx.filter = `blur(1.5px)`;
    ctx.drawImage(bg, 0, -280, canvas.width, 1230);
    ctx.restore();
    ctx.closePath();*/

    //Внешняя рамка аватарки
    ctx.beginPath();
    ctx.arc(150, 200, 97, 0, 2 * Math.PI);
    ctx.strokeStyle = `#124124`;
    ctx.fillStyle = `#123123`;
    ctx.lineWidth = 5;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    //Внутреняя рамка аватарки
    ctx.beginPath();
    ctx.arc(150, 200, 85, 0, 2 * Math.PI);
    ctx.fillStyle = `#124124`;
    ctx.fill();
    ctx.closePath();

    // Аватар (круглая)
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 200, 80, 0, 2 * Math.PI); // Координаты центра аватарки
    //ctx.fillStyle = `grey`;
    //ctx.fill();
    ctx.clip();
    ctx.drawImage(avatar, 70, 120, 160, 160);
    ctx.restore();
    ctx.closePath();

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

    // Ник
    ctx.fillStyle = 'black';
    this.#drawRoundedRect({ x: 290, y: 210, w: 380, h: 50, r: 11 });
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.globalAlpha = 1;
    //ctx.fillRect(290, 210, 380, 50); // Позиция и размеры прямоугольника

    // Уровень
    ctx.fillStyle = `black`;
    ctx.globalAlpha = 0.5;
    this.#drawRoundedRect({ x: 750, y: 255, w: 200, h: 40, r: 11 });
    ctx.fill();
    ctx.globalAlpha = 1;
    //ctx.fillRect(70, 310, 160, 35); // Позиция и размеры прямоугольника

    // Опыт
    const startAngle = -Math.PI / 2;
    const xp = 77.5;
    const xpMax = 155;
    const endAngle = Math.PI * 2 * (xp / xpMax) - Math.PI / 2;

    ctx.beginPath();
    ctx.arc(150, 200, 90, startAngle, endAngle, false);
    ctx.strokeStyle = `lightgreen`;
    ctx.lineWidth = 10;
    ctx.globalAlpha = 0.8;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.closePath();

    ctx.lineWidth = 10;
    // Титул (1 или несколько)
    ctx.fillStyle = '#b89e14'; //x 290
    ctx.globalAlpha = 0.8;
    this.#drawRoundedRect({ x: 290, y: 285, w: 380, h: 45, r: 11 });
    ctx.fill();
    //ctx.fillRect(290, 285, 380, 60); // Позиция и размеры прямоугольника
    ctx.globalAlpha = 1;

    // Место под "значки" или что-то другое
    ctx.fillStyle = `#091711`;
    ctx.globalAlpha = 0.7; //full = x: 780, w: 200, one = w: 40, x: 940
    this.#drawRoundedRect({ x: 940, y: 208, w: 40, h: 34, r: 11 });
    //ctx.fillRect(780, 210, 200, 30);
    ctx.fill();
    ctx.globalAlpha = 1;
    //this.#drawRoundedRect({ x: 780, y: 206, w: 200, h: 38, r: 11 });
    //ctx.stroke();
    //ctx.strokeRect(780, 208, 200, 34);

    // другое. Значки
    /*ctx.fillStyle = `pink`; //x = 789, 7
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
    this.#drawRoundedRect({ x: 20, y: 370, w: 710, h: 310, r: 11 });
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();
    ctx.closePath();

    //блок клана
    ctx.beginPath();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 0.5;

    this.#drawRoundedRect({ x: 750, y: 370, w: 230, h: 310, r: 11 });
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
    ctx.drawImage(baner, 735, 330, 80, 80);
    ctx.restore();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(775, 370, 42, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();

    //Ник. Пока Белый цвет
    ctx.font = `Arial 25px`;
    ctx.fillStyle = `black`;

    this.drawTexts([
      //Bio текст. x2: 710, full = x2: 970
      { text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem-accusantium-doloremque-laudantium.-accusantium-doloremque-laudantium.-voluptatem-accusantium-doloremque-laudantium.1`, x1: 30, x2: 710, y: 400, dynamicOptions: { dynamic: true, dynamicCorrector: 1, isClip: true, lineSpacing: 17, lines: 10 }, fontOptions: { size: 25 } },
      //Никнейм
      { text: `Qipeax`, x1: 294, x2: 670, y: 245, dynamicOptions: { dynamic: true }, fontOptions: { color: `white`, size: 35 } },
      //титул
      { text: `Верховный бог Капусты`, x1: 294, x2: 670, y: 316, textDirect: `center`, dynamicOptions: { dynamic: true }, fontOptions: { color: `black`, size: 27 } },
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
    /*this.drawTexts([{ text: `Kogasa Tatara Kogasa Tatara    1`, x1: 294, x2: 670, y: 237.5 }], { update: { dynamic: true, fontOptions: { color: `#252568` } } });/*/

    return this;
  }

  /**
   * @param {DrawTextOptions} options Параметры для отрисовки текста
   * @returns {Promise<Profile>}
   */
  drawText({ x1, x2 = 0, y, text, textDirect = `normal`, dynamicOptions, fontOptions, clipNumber = false, timeFormat = false }) {
    return new Promise((resolve, reject) => {
      if (clipNumber) text = numberClip(text);
      if (timeFormat) text = timeFormatter(Number(text));

      const iText = `${text}`;
      const cnt = this.cnt;
      const dynamic = dynamicOptions?.dynamic || false;
      const isClip = dynamicOptions?.isClip || false;
      const linesNext = dynamicOptions?.lines ?? 1;
      const lineSpacing = dynamicOptions?.lineSpacing ?? 0;
      const dynamicCorrector = dynamicOptions?.dynamicCorrector ?? 0;
      const leftText = textDirect === `left`;
      const centerText = textDirect === `center`;
      const maxWidth = x2 > 0 ? x2 - x1 : x1;
      const ellipsisWidth = cnt.measureText(`...`).width;
      const dashWidth = cnt.measureText(`-`).width;
      const words = iText.split(` `);
      const lines = [``]; //массив строк
      const textMetrics = cnt.measureText(iText);
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

      if (fontOptions) this.setFontStyle(fontOptions);
      if (dynamic || isClip) {
        if (isClip) {
          for (const word of words) {
            const testLine = lines[currentLineIndex] + (lines[currentLineIndex] ? ' ' : '') + word;

            if (currentLineIndex > linesNext) break;
            if (cnt.measureText(testLine).width < maxWidth) {
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
            const whileClip = (cache, elseWidth = 0) => {
              let cached = cache;
              while (cnt.measureText(cached).width + elseWidth > maxWidth) {
                if (cached.length === 0) {
                  reject(undefined);
                  throw new TypeError(`infinite while`);
                }

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
            const textFormater = ({ text, cache, curInd }) => {
              return curInd < linesNext ? ((isStartEmpty.test(text) || isEndEmpty.test(cache)) ? cache : `${cache}-`) : dynamic && curInd === linesNext ? (isEndEmpty.test(cache) ? `${cache.slice(0, -1)}...` : `${cache}...`) : cache;
            }

            cacheWord = whileClip(cacheWord, currentLineIndex < linesNext ? dashWidth : (dynamic && currentLineIndex === linesNext ? (ellipsisWidth + dynamicCorrector) : 0));
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
                  cacheWord = whileClip(line, currentLineIndex <= linesNext ? dashWidth : (dynamic && currentLineIndex === linesNext ? (ellipsisWidth + dynamicCorrector) : 0));
                  const textFormated = textFormater({ text: line, cache: cacheWord, curInd: currentLineIndex });
                  lines[currentLineIndex] = (textFormated.endsWith(`-`) && lineCache[lineCache.length - 1] == line || textFormated.endsWith(`--`)) ? textFormated.slice(0, -1) : textFormated;
                  ++currentLineIndex;
                }

              } else lines[currentLineIndex] = testLineClip;
            }
          }
        }

        if (textWidth > maxWidth && !isClip) {
          while (cnt.measureText(truncatedText).width + (ellipsisWidth + dynamicCorrector) > maxWidth) {
            if (truncatedText.length == 0) {
              reject(undefined);
              throw new TypeError(`Бесконечный while!`);
            }

            truncatedText = truncatedText.slice(0, -1);
          }

          truncatedText = truncatedText === text ? text : `${truncatedText}...`;
        }
      }

      if (leftText) cnt.textAlign = `right`;
      if (centerText) (cnt.textAlign = `center`), x = (x1 + x2) / 2;
      if (isClip) lines.forEach((line, i) => cnt.fillText(line, x, y + i * (textHeight + lineSpacing))), lines.length = 0;
      else cnt.fillText(truncatedText, x, y);
      if (leftText || centerText) cnt.textAlign = `start`;

      return resolve(this);
    });
  }

  //🛠️✉️ 📤📥👤

  /**
   * @overload
   * @param {DrawTextOptions[]} args параметры для отрисовки текста
   * @param {DrawTextsOption} options доп опции
   * @returns {Profile}
   *//**
 * @overload
 * @param {DrawTextOptions[]} args параметры для отрисовки текста
 * @returns {Profile}
 *//**
  * @param {DrawTextOptions[]} args параметры для отрисовки текста
  * @param {DrawTextsOption} [option] доп опции
  * @returns {Profile}
  */
  drawTexts(args, option) {
    let index = 0;
    /** @type {object} */
    let cache;
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

  /**
   * @param {object} options Параметры для отрисовки скруглённого квадрата
   * @param {number} options.x координаты x
   * @param {number} options.y координаты y
   * @param {number} options.w ширина
   * @param {number} options.h высота
   * @param {number} options.r радиус скругления
   * @returns {Profile}
   */
  #drawRoundedRect({ x, y, w, h, r }) {
    const ctx = this.cnt;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();

    return this;
  }
}

const pr = new Profile();

window.onload = () => pr.drawBanner();

avatar.src = `./kogasa.png`;
baner.src = `./tenshi.png`;
clan_avatar.src = `./kogasa_small.png`;
bg.src = `./bg.png`;
icon.src = `./avatar.png`;

/** 
 * @param {string | number} num
 * @returns {string}
 */
function numberClip(num) {
  if (typeof num != `string`) num = `${num}`;

  const numLength = num.length;

  return numLength >= 5 ? `${num.slice(0, 4)}k` : numLength >= 11 ? `${num.slice(0, 4)}kk` : numLength >= 16 ? `${num.slice(0, 4)}kk+` : num;
}

/** 
 * Функция для перевода секунд в часы, минуты и секунды
 * @param {number} s секунды. Не строкой
 * @returns {{ hours: number, minutes: number, seconds: number }}
 */
function parseSecond(s) {
  const minutes = Math.floor(s / 60);
  const hours = Math.floor(minutes / 60);
  return {
    hours,
    minutes: minutes - (hours * 60),
    seconds: s % 60,
  };
}

/**
 * @param {number} time
 * @returns {string}
 */
function timeFormatter(time) {
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







/**
 * @typedef {object} DrawBGDrawTypeColor
 * @property {Exclude<DrawType, "image">} draw - Тип отрисовки. Рисуем цвет.
 * @property {string} [color] - Цвет для указанной зоны. Либо используйте параметер gradient.
 * @property {DrawBGType} [typeDraw] - Тип отрисовки зоны с изображением.
 * @property {number} x - Расположение зоны с цветом по оси x.
 * @property {number} y - Расположение зоны с цветом по оси y.
 * @property {number} [globalAlpha] - Прозрачность цвета. От 0 до 1 включно.
 * @property {GradiedType[]} [gradient] - Настройка для градиента. Если вам нужен один цвет - берите параметер color.
 * @property {TypeDrawImage} [drawType] - Как отрисовывать зону с цветом. fill - полностью. stroke - полоской.
 * @property {number} [strokeLineWidth] - Толщина линии в пикселях. Игнорируется, если для drawType указано "fill".
 * @property {ArcType} [arcOptions] - Параметры для отрисовкив круглой формы. Влияет только при type = "arc".
 * @property {RectType} [rectOptions] - Параметры для отрисовки квадратной формы. Влияет только при type = "rect".
 */

/**
 * @typedef {object} DrawBGTypeFull
 * @property {HTMLImageElement} image1 - Первое изображение.
 * @property {HTMLImageElement} image2 - Второе изображение.
 * @property {Exclude<DrawType, "color">} draw - Тип отрисовки. Рисуем изображение.
 * @property {number} x1 - Расположение первого изображения по оси x.
 * @property {number} [x2] - Расположение второго изображения по оси x. Если не указано, то будет использовать значение x1.
 * @property {number} y1 - Расположение первого изображения по оси y.
 * @property {number} [y2] - Расположение второго изображения по оси y. Если не указано, то будет использоваться height1.
 * @property {number} [width1] - Ширина первого изображения. Если не указано, будет использована ширина хоста.
 * @property {number} [width2] - Ширина второго изображения. Если не указано, будет использована ширина хоста.
 * @property {number} [height1] - Высота первого изображения. Если не указано, будет использована высота хоста.
 * @property {number} [height2] - Высота второго изображения. Если не указано, будет использовано значение -height1.
 * @property {BlurOptions} [image1Blur] - Опции для размытия первого изображения.
 * @property {BlurOptions} [image2Blur] - Опции для размытия второго изображения.
 * @property {TypeDrawImage} [drawTypeImage1] - Способ отрисовки первого изображения. "fill" - полностью, "stroke" - обводкой.
 * @property {TypeDrawImage} [drawTypeImage2] - Способ отрисовки второго изображения. "fill" - полностью, "stroke" - обводкой.
 * @property {number} [strokeLineWidth1] - Толщина линии для первого изображения в пикселях. Игнорируется, если для drawTypeImage1 указано "fill".
 * @property {number} [strokeLineWidth2] - Толщина линии для второго изображения в пикселях. Игнорируется, если для drawTypeImage2 указано "fill".
 * @property {number} globalAlpha1 - Прозрачность первого изображения. От 0 до 1 включно.
 * @property {number} globalAlpha2 - Прозрачность второго изображения. От 0 до 1 включно.
 */

/** 
 * @typedef {object} DrawBGTypeAllOne 
 * @property {HTMLImageElement} image - Изображение для отрисовки.
 * @property {DrawBGTypeDraw} type - Тип отрисовки: "baner", "full" или "bottom".
 * @property {Exclude<DrawType, "color">} draw - Тип отрисовки. Рисуем изображение.
 * @property {number} x - Координата x.
 * @property {number} y - Координата y.
 * @property {number} [width] - Ширина изображения.
 * @property {number} [height] - Высота изображения.
 * @property {BlurOptions} [blurOptions] - Опции для размытия изображения.
 * @property {TypeDrawImage} [drawType] - Способ отрисовки изображения. "fill" - полностью, "stroke" - обводкой.
 * @property {number} [strokeLineWidth] - Толщина линии в пикселях. Игнорируется, если для drawType указано "fill".
 * @property {number} [globalAlpha] - Прозрачность изображения. От 0 до 1 включно.
 */

/**
 * @typedef {object} BlurOptions
 * @property {number} blur - Концентрация размытия.
 * @property {DrawBGType} [type] - Тип отрисовки размытой зоны.
 * @property {number} [x] - Расположение зоны размытия по оси X.
 * @property {number} [y] - Расположение зоны размытия по оси Y.
 * @property {string} [color="white"] - Цвет для размытия.
 * @property {ArcType} [arcOptions] - Дополнительные опции для круглого размытия.
 * @property {TypeDrawImage} [drawType] - Способ отрисовки размытия.
 * @property {number} [strokeLineWidth] - Толщина линии в пикселях. Игнорируется, если для drawType указано "fill".
 */

/**
 * @typedef {object} RectType
 * @property {number} width - Ширина квадрата.
 * @property {number} height - Высота квадрата.
 */

/** 
 * @typedef {object} ArcType 
 * @property {number} radius1 - Радиус зоны размытия.
 * @property {number} [radius2] - Дополнительный радиус для зоны размытия.
 * @property {number} startAngle - Начало круга.
 * @property {number} endAngle - Конец круга.
 * @property {boolean} [counterclockwise] - Направление отрисовки круга.
 * @property {boolean} [isScale=false] - Сжатие круга и изменение координаты y в процессе сжатия.
 */

/**
 * @typedef {object} GradiedType
 * @property {number} offset - Число между `0` и `1` включительно, обозначающее положение остановки цвета. `0` представляет начало градиента и `1` представляет конец.
 * @property {string} color - Цвет для градиента.
 */

/**
 * @typedef {object} SetFontStyleOptions
 * @property {number | string} [size] размер шрифта. Входящие числа (не строка) будут в px
 * @property {string} [font] имя нужного вам шрифта
 * @property {CanvasColorOptions} [color] цвет вашего текста
 * @property {1 | 2 | 3} [type] выбор - куда указать цвет. 1 - fillStyle, 2 - strokeStyle, 3 - оба.
 */

/**
 * @typedef {object} DrawTextOptions
 * @property {number} x1 Откуда будет идти текст
 * @property {number} [x2] Конец для текста (центровка). Использовать только при `textDirect` = "center" или `dynamic` = `true`. Конец `text`, что выходит за указанные `x1` и `x2` - будет обрезан и выведен с `...` в конце
 * @property {number} y Высота расположения текста
 * @property {string | number} text выходящий текст
 * @property {"normal" | "center" | "left"} [textDirect] Направление текста. По дефолту стоит `normal` (без доп изменений)
 * @property {SetFontStyleOptions} [fontOptions] Параметры для установки стиля шрифта
 * @property {boolean} [clipNumber] делать ли обрезку чисел и добавлять k в конце (не больше 2х. Максимум kk+) 
 * @property {boolean} [timeFormat] Вывод текста в виде времени (вводить значение в секундах)
 * @property {DrawDynamicOptions} [dynamicOptions] Опции для динамической отрисовки
 */

/**
 * @typedef {object} DrawDynamicOptions
 * @property {boolean} [dynamic] Использование x1 и x2 для обрезки текста, что находится в указанной зоне (зависит от размера шрифта)
 * @property {number} [dynamicCorrector] значения, что будут использоваться для корректировки обрезки
 * @property {boolean} [isClip] Делать ли перенос строки.
 * @property {number} [lines] Сколько сделать переносов строки (с только при isClips). По дефолту - `1`. `1` = перенос на следующую строку. Рекомендуется использовать с `dynamic` = `true`
 * @property {number} [lineSpacing] Высота между строками. В px. По дефолту - 0. Этого вполне хватает;
 */

/**
 * @typedef {object} DrawImageOptions
 * @property {CanvasImageSource} [image] Ваше изображение
 * @property {number} [x1] Координаты для обрезки
 * @property {number} [y1] Координаты для обрезки
 * @property {number} [x2] Координаты для аватарки
 * @property {number} [y2] Координаты для аватарки
 * @property {number} [radiusX] Радиус для обрезки (если аватарка)
 * @property {number} [radiusY] Радиус для аватарки, если isScale = false
 * @property {number} [radiusA] Радиус для аватарки, если isScale = true
 * @property {boolean} [isScale] делать ли "сжатие" области для обрезки исходя из radiusX и radiusY.
 * @property {"bg" | "xpBar" | "avatar"} [type] если bg - изображение не будет обрезаться и выставится на максималные размеры
 * @property {ExpBarOptions} [otherOptions] Другие парамеры. xp = 0, xpMax = 155
*/

/**
 * @typedef {object} DrawExpBarBase
 * @property {number} x Координаты X
 * @property {number} y Координаты Y
 * @property {number} radiusX Радиус сверху
 * @property {number} radiusY Радиус сбоку
 */

/**
 * @typedef {object} ExpBarOptions
 * @property {number} xp Текущий опыт
 * @property {number} xpMax Максимальный опыт
 * @property {number} [lineWidth] толщина полоски опыта, 10 по дефолту
 * @property {CanvasColorOptions} [color] цвет полоски опыта. По дефолту - `#24ab93`
 */

/**
 * @typedef {object} DrawTextsBase  
 * @property {DynamicOptionDrawsText[]} [dynamicOptions] динамическая настройка. При её наличии - статичная настройка игнорируется
 */

/**
 * @typedef {object} DrawImagesBase
 * @property {DynamicOptionsDrawImages[]} [dynamicOptions] динамическая настройка. При её наличии - статичная настройка игнорируется
 */

/**
 * @typedef {object} StaticOptions
 * @property {Partial<DrawTextOptions>} [update] значения, что заменять существующие в массиве - на другие по указанным start/end элементам. Статичный вариант
 * @property {number} [start] откуда начинать. Если не указано (но указано `end`) - начало массива. Статичный вариант
 * @property {number} [end] где заканчивать. Если не указано (но указано `start`) - конец массива. Статичный вариант
 */

/**
 * @typedef {object} DynamicOptions
 * @property {number} [start] откуда начинать. Если не указано (но указано `end`) - начало массива
 * @property {number} [end] где заканчивать. Если не указано (но указано `start`) - конец массива
 * @property {boolean} [cache] переносить ли дальше значения
 */

/**
 * @typedef {object} UpdateDynamicDrawText
 * @property {Partial<DrawTextOptions>} update значения, что заменять существующие в массиве - на другие по указанным start/end элементам
 */

/**
 * @typedef {object} UpdateDynamicDrawImages
 * @property {Partial<DrawImageOptions>} update значения, что заменять существующие в массиве - на другие по указанным start/end элементам
 */

/** 
 * @typedef {string | CanvasGradient | CanvasPattern} CanvasColorOptions
 * @typedef {DynamicOptions & UpdateDynamicDrawText} DynamicOptionDrawsText
 * @typedef {DynamicOptions & UpdateDynamicDrawImages} DynamicOptionsDrawImages
 * @typedef {DrawImagesBase & StaticOptions} DrawImagesOptions
 * @typedef {DrawTextsBase & StaticOptions} DrawTextsOption
 * @typedef {DrawExpBarBase & ExpBarOptions} DrawExpBarOptions 
 * @typedef {"baner" | "full" | "bottom"} DrawBGTypeDraw
 * @typedef {"image" | "color"} DrawType
 * @typedef {"rect" | "arc"} DrawBGType
 * @typedef {"fill" | "stroke"} TypeDrawImage
 */