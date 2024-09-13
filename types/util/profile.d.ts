import type { Image } from "@napi-rs/canvas";
import type { LimitedArrayArgs } from "@type";

export namespace ProfileTypes {
  export interface DrawBadgeOptinalOptions extends X_And_Y {
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

  export interface DrawBadgeOptions extends Partial<X_And_Y> {
    space?: number; //отступ между значками
    badge: Image; //то, что будет загружаться
    w?: number; //ширина значка. w + space = отступ между значками
    h?: number; //высота значка. Если не указано, то h = w
    globalAlpha?: number; //прозрачность. Не знаю - надо или нет. Но пусть будет
    blur?: number; //размытие. Так-же не знаю. Потом увижу
    priority?: number; //как размещать их. 0 - выший приоритет. Если нет - будет по их расположению в массиве. Если это не массив - оно не будет иметь влияния. Просто не стакайте их на одном месте хд
  }

  export interface DrawGuildIconOptions {
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

  export interface TemplateTextOptions {
    username?: TemplateText;
    title?: TemplateText;
    bio?: TemplateText;
    bioFull?: TemplateText;
    bioCenter?: TemplateText;
    guild?: GuildTemplateTextOptions;
    level?: TemplateText;
    [key: string]: TemplateText | GuildTemplateTextOptions | undefined;
  }

  export interface GuildTemplateTextOptions {
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
  export interface IconGuildTextShift extends TemplateText {
    iconShift?: number; //на сколько "съехать"
  }

  export interface TemplateBlocksOptions {
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

  export interface PriorityOption {
    priority?: 1 | 2 | 3 | 4 | 5 | 6;
  }

  export interface BaseDrawBlocksOptions {
    color?: string | FillOrStrokeOption<string> | GradientOptions;
    globalAlpha?: number | FillOrStrokeOption;
    drawType?: TypeDrawImageOrColor | "both";
    strokeLineWidth?: number;
    blurOptions?: number | FillOrStrokeOption;
    name?: string;
  }

  export interface DrawRoundedRectOptions {
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
  }

  export interface DrawImageAvatarOptions extends DrawAvatarOptions {
    avatar: Image;
  }

  export interface DrawColorAvatarOptions extends DrawAvatarOptions {
    avatar: string | GradientOptions;
  }

  export interface DrawAvatarOptions {
    xp: XPOptions;
    avatarPosition: AvatarPositionOptions;
    avatarBorder?: BorderOptions & { backgroundColor?: string | GradientOptions, inRadius?: number, outRadius?: number };
    blurOptions?: AvatarBlurOptions;
    lineBorder?: LineBorderOptions;
  }

  export interface LineBorderOptions extends BorderOptions, Partial<X_And_Y> {
    off?: boolean;
    blurOption?: {
      both?: number,
      top?: number,
      bottom?: number;
    };
    globalAlpha?: number;
    radius?: number;
  }

  export interface XPOptions {
    now: number;
    max: number;
    color?: string | GradientOptions;
    lineWidth?: number;
    globalAlpha?: number;
    position?: X_And_Y & { radius?: number; };
  }

  export interface Dimensions {
    width?: number;
    height?: number;
  }

  export interface AvatarPositionOptions extends X_And_Y {
    image?: X_And_Y & { radius?: number; };
    radius?: number;
    width?: number;
    height?: number;
  }

  export interface BorderOptions {
    color?: string | GradientOptions;
    lineWidth?: number;
  }

  export interface AvatarBlurOptions {
    avatar?: number;
    border?: {
      out?: number;
      in?: number;
    }
    xp?: number;
  }

  export interface TextFormatterOptions {
    text: string;
    cache: string;
    curInd: number;
    linesNext: number;
    dynamic: boolean;
  }

  export interface DrawBGDrawTypeColor {
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

  export interface DrawBGTypeFull {
    images: LimitedArrayArgs<Image, 2>;
    draw: "image";
    positions: LimitedArrayArgs<{
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

  export interface DrawBGTypeAllOne extends Dimensions {
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

  export interface ApplyBGImageTransformationsOptions {
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

  export interface ShadowOptions {
    color: string;
    blur?: number;
  }

  export interface X_And_Y {
    x: number;
    y: number;
  }

  export interface BlurOptions {
    banner?: number;
    bottom?: number;
    full?: number;
  }

  export interface RectType {
    width: number;
    height: number;
  }

  export interface ArcType {
    radius1: number;
    radius2?: number;
    startAngle: number;
    endAngle: number;
    counterclockwise?: boolean;
    isScale?: boolean;
  }

  export interface SetFontStyleOptions {
    size?: number | string;
    font?: string;
    color?: CanvasColorOptions;
    type?: 1 | 2 | 3;
  }

  export interface DrawTextOptions extends TextBase {
    x1: number;
    x2?: number;
    y: number;
    x_translate?: number;
  }

  export interface TextBase {
    text: string | number;
    textDirect?: "normal" | "center" | "left";
    fontOptions?: SetFontStyleOptions;
    clipNumber?: boolean;
    timeFormat?: boolean;
    dynamicOptions?: DrawDynamicOptions;
  }

  export interface DrawDynamicOptions {
    dynamic?: boolean;
    dynamicCorrector?: number;
    isClip?: boolean;
    lines?: number;
    lineSpacing?: number;
  }

  export interface GradientOptions {
    type?: "linear" | "radial";
    colorType?: TypeDrawImageOrColor | "both";
    colors: GradientColorStop[];
    linear?: LinearGradientOptions;
    radial?: RadialGradientOptions;
  }

  export interface GradientColorStop {
    offset: number;
    color: string;
  }

  export interface LinearGradientOptions {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  }

  export interface RadialGradientOptions {
    x0: number;
    y0: number;
    r0: number;
    x1: number;
    y1: number;
    r1: number;
  }

  export interface DrawTextsBase {
    dynamicOptions?: DynamicOptionDrawsText[];
  }

  export interface StaticOptions {
    update?: Partial<DrawTextOptions>;
    start?: number;
    end?: number;
  }

  export interface DynamicOptions {
    start?: number;
    end?: number;
    cache?: boolean;
  }

  export interface UpdateDynamicDrawText {
    update: Partial<DrawTextOptions>;
  }

  export interface TemplateType {
    banner: TemplatePositionType;
    full: TemplatePositionType;
    bottom: TemplatePositionType;
  }

  export interface PrivateDrawImageOptions {
    temType: PDImagePosition;
    templateType: TemplateType;
    blurOptions?: BlurOptions;
    image: Image;
    dx: number;
    dy: number;
    dw: number;
    dh?: number;
  }

  export interface DrawBlocksOptions extends BaseDrawBlocksOptions, DrawRoundedRectOptions {
    x_position?: XTemplatePosition;
  }

  export interface TemplatePositionType {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export type FillOrStrokeOption<T = number, K = T> = { fill?: T; stroke?: K };

  export type BorderOrIcon<T = number, K = T> = { border?: T; icon?: K; };

  export type StringOrGradient = string | GradientOptions;

  export type TemplateText = TextBase & Partial<DrawTextOptions> & PriorityOption;

  export type TemplateBlock = BaseDrawBlocksOptions & PriorityOption;

  export type CanvasColorOptions = string | CanvasGradient | CanvasPattern;

  export type DynamicOptionDrawsText = DynamicOptions & UpdateDynamicDrawText;

  export type DrawTextsOption = DrawTextsBase & StaticOptions;

  export type XTemplatePosition = "right" | "center" | "left";

  export type DrawBGPosition = "banner" | "full" | "bottom";

  export type PDImagePosition = Exclude<DrawBGPosition, "full">

  export type DrawBGType = "rect" | "arc";

  export type TypeDrawImageOrColor = "fill" | "stroke";

  export type StringNumber = string | number;

  export type RenderType = "image/png" | "image/jpeg";

  export type DrawOption = DrawBGDrawTypeColor | DrawBGTypeFull | DrawBGTypeAllOne;

}