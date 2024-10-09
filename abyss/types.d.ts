import type { Image } from "@napi-rs/canvas";
import sharp from "sharp";
import * as types from "../types";

export * from "../types";

export interface DrawClanProfileOptions {
  logoUrl: string;
  name: string;
  motto: string;
  creationDate?: string;
  memberCount?: number;
  activityLevel?: string;
  achievements: string[];
}

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

export interface DrawClanDescriptionBaseOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DrawClanDescriptionStyleOptions {
  outlineColor?: string;
  backgroundColor?: string;
  lineWidth?: number;
  blurPx?: number;
}

export interface DrawClanDescriptionTextOptions {
  x1: number;
  x2: number;
  y: number;
  text: string;
  fontOptions: {
    color: string;
    size: number;
  };
  dynamicOptions: DrawDynamicOptions;
}

export interface DrawClanInfoOptions extends Partial<Omit<DrawClanDescriptionTextOptions, "text" | "fontOptions">> {
  x?: number;
  corrector?: number;
  created: string;
  type: string;
  globalAlpha?: number;
  fontOptions?: types.ArrayNotEmpty<FontOptions>;
  blurPx?: number;
  backgroundColor?: string;
  outlineColor?: string;
  width?: number;
  height?: number;
  radius?: number;
}

export interface FontOptions {
  color?: string; size?: number;
}

export interface DrawClanDescriptionOptions extends DrawClanDescriptionBaseOptions, DrawClanDescriptionStyleOptions {
  textOptions: DrawClanDescriptionTextOptions;
};

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

/**
 * The options for resizing an image.
 */
export interface ImageOptions {
  /** The width of the image. */
  w?: number;
  /** The height of the image. */
  h?: number;
  /** The fit option for resizing the image. */
  fit?: keyof sharp.FitEnum;
}


/**
 * The options for loading an image with resizing.
 */
export interface LoadImageResize {
  /** The width of the image. */
  w?: number;
  /** The height of the image. */
  h?: number;
  /** The additional options for resizing the image. */
  options?: ImageOptions;
}


/**
 * The options for drawing a rounded rectangle.
 */
export interface RoundedRectOptions {
  /** The x position of the rounded rectangle. */
  x: number;
  /** The y position of the rounded rectangle. */
  y: number;
  /** The width of the rounded rectangle. */
  w: number;
  /** The height of the rounded rectangle. */
  h: number;
  /** The radius of the rounded corners. */
  r?: number;
}

export interface DrawDeputuOptions {
  /**
   * The x position of the deputu image.
   */
  x?: number;

  /**
   * The y position of the deputu image.
   */
  y?: number;

  /**
   * The width of the deputu image.
   */
  width?: number;

  /**
   * The height of the deputu image.
   */
  height?: number;

  /**
   * The radius of the deputu image.
   */
  r?: number;

  /**
   * The x position of the deputu circle.
   */
  rx?: number;

  /**
   * The y position of the deputu circle.
   */
  ry?: number;

  /**
   * The radius of the deputu circle.
   */
  rr?: number;

  /**
   * The x position of the deputu icon.
   */
  ix?: number;

  /** The x position of the deputu nickname & role */
  xt?: number;

  /** The y position of the deputu nickname & role */
  yt?: number;

  /**
   * The background color of the deputu image.
   */
  bgColor?: string;

  /**
   * The border style of the deputu image.
   */
  borderStyle?: string;

  /**
   * The line width of the deputu image.
   */
  lineWidth?: number;

  /**
   * The blur amount of the deputu image.
   */
  blurPx?: number;

  /**
   * The global alpha of the deputu image.
   */
  globalAlpha?: number;

  /**
   * The deputu information.
   */
  deputu: ClanDeputuDrawOptions[];

  /** The text options (nickname & role) */
  textOptions?: TextOptionsDeputu;
}

export interface TextOptionsDeputu {
  /** The x position of the nickname and role*/
  x1?: number;

  /** The x2 position of the nickname or role */
  x2?: number;

  /** The x2 radius position of the role */
  x2r?: number;

  /** The y position of the nickname and role */
  y?: number;

  /** The y radius position of the role */
  yr?: number;

  /** The text color options */
  colorOptions?: TextColorOptions;
}

export interface TextColorOptions {
  /** The nickname color */
  nickname?: string;

  /** The role color */
  role?: string;
}

export interface ClanDeputuDrawOptions {
  /**
   * The username of the deputu.
   */
  username: string;

  /**
   * The avatar of the deputu.
   */
  avatar: Image;

  /**
   * The role of the deputu.
   */
  role: string;
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

export type ArrayLimited<T, K extends number> = [T, ...T[]] & { length: K };