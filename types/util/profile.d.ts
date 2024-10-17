import type { Image } from "@napi-rs/canvas";
import type { LimitedArrayArgs } from "@type";

/**
 * Namespace for all types related to profile
 */
export namespace ProfileTypes {
  /**
   * Draw badge optional options
   * @remarks
   * this interface - options for draw badge
   * @property {StringOrGradient | FillOrStrokeOption<string>} [bgColor] - background color of block
   * @property {number} [bgW] - width of block
   * @property {number} [bgH] - height of block
   * @property {number} [bgR] - rounded corner radius
   * @property {number} [bgLineWidth] - border width
   * @property {boolean} [offStroke] - disable border
   * @property {number | FillOrStrokeOption<number>} [globalAlpha] - global alpha for block
   * @property {number | FillOrStrokeOption<number>} [blur] - blur for block
   * @property {"full" | "unique" | "none"} [bgFill] - determines how to fill the background
   */
  export interface DrawBadgeOptionalOptions extends X_And_Y {
    bgColor?: StringOrGradient | FillOrStrokeOption<string>;
    bgW?: number; //ширина блока для значков
    bgH?: number; //высота блока для значков
    bgR?: number; //скругление углов
    bgLineWidth?: number;
    offStroke?: boolean;
    globalAlpha?: number | FillOrStrokeOption<number>;
    blur?: number | FillOrStrokeOption<number>;
    bgFill?: "full" | "unique" | "none"; //влияет только при наличии массива
  }
  /**
   * Draw badge options
   * @remarks
   * This interface - options for draw badge
   * @property {number} [space] - space between badges
   * @property {Image} badge - image to draw
   * @property {number} [w] - width of badge
   * @property {number} [h] - height of badge
   * @property {number} [globalAlpha] - global alpha for badge
   * @property {number} [blur] - blur for badge
   * @property {number} [priority] - priority for badges. 0 - highest priority. If not specified - it will be placed in order of array
   */

  /**
   * Draw badge options
   * @remarks
   * This interface - options for draw badge
   * @property {number} [space] - space between badges
   * @property {Image} badge - image to draw
   * @property {number} [w] - width of badge
   * @property {number} [h] - height of badge
   * @property {number} [globalAlpha] - global alpha for badge
   * @property {number} [blur] - blur for badge
   * @property {number} [priority] - priority for badges. 0 - highest priority. If not specified - it will be placed in order of array
   */
  export interface DrawBadgeOptions extends Partial<X_And_Y> {
    space?: number; //отступ между значками
    badge: Image; //то, что будет загружаться
    w?: number; //ширина значка. w + space = отступ между значками
    h?: number; //высота значка. Если не указано, то h = w
    globalAlpha?: number; //прозрачность. Не знаю - надо или нет. Но пусть будет
    blur?: number; //размытие. Так-же не знаю. Потом увижу
    priority?: number; //как размещать их. 0 - высший приоритет. Если нет - будет по их расположению в массиве. Если это не массив - оно не будет иметь влияния. Просто не стакайте их на одном месте хд
  }

  /**
   * Draw guild icon options
   * @remarks
   * This interface - options for draw guild icon
   * @property {number} x1 - x coordinate of top left corner
   * @property {number} x2 - x coordinate of bottom right corner
   * @property {number} y1 - y coordinate of top left corner
   * @property {number} y2 - y coordinate of bottom right corner
   * @property {number} w - width of icon
   * @property {number} h - height of icon
   * @property {number} r - rounded corner radius
   * @property {number} [borderLineWidth] - border width
   * @property {StringOrGradient} [borderColor] - border color
   * @property {Image | StringOrGradient} icon - image to draw
   * @property {number | BorderOrIcon} [globalAlpha] - global alpha for icon
   * @property {number | BorderOrIcon} [blurOptions] - blur for icon
   * @property {boolean} [offBorder] - disable border
   */

  /**
   * Draw guild icon options
   * @remarks
   * This interface - options for draw guild icon
   * @property {number} x1 - x coordinate of top left corner
   * @property {number} x2 - x coordinate of bottom right corner
   * @property {number} y1 - y coordinate of top left corner
   * @property {number} y2 - y coordinate of bottom right corner
   * @property {number} w - width of icon
   * @property {number} h - height of icon
   * @property {number} r - rounded corner radius
   * @property {number} [borderLineWidth] - border width
   * @property {StringOrGradient} [borderColor] - border color
   * @property {Image | StringOrGradient} icon - image to draw
   * @property {number | BorderOrIcon} [globalAlpha] - global alpha for icon
   * @property {number | BorderOrIcon} [blurOptions] - blur for icon
   * @property {boolean} [offBorder] - disable border
   */
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

  /**
   * Interface for template text options
   * @remarks
   * This interface - options for draw text on the canvas
   * @property {TemplateText} [username] - text for username
   * @property {TemplateText} [title] - text for title
   * @property {TemplateText} [bio] - text for bio
   * @property {TemplateText} [bioFull] - text for bio (full)
   * @property {TemplateText} [bioCenter] - text for bio (center)
   * @property {GuildTemplateTextOptions} [guild] - text for guild
   * @property {TemplateText} [level] - text for level
   */
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

  /**
   * Interface for guild text options
   * @remarks
   * This interface - options for draw text on the canvas in guild profile
   * @property {IconGuildTextShift} [guildName] - text for guild name
   * @property {IconGuildTextShift} [guildType] - text for guild type
   * @property {IconGuildTextShift} [members] - text for guild members
   * @property {IconGuildTextShift} [perms] - text for guild perms
   * @property {boolean} [guildIcon] - is guild icon exists? If true - text will be shifted
   */
  export interface GuildTemplateTextOptions {
    guildName: IconGuildTextShift; //имя гильдии
    guildType: IconGuildTextShift; //тип гильдии
    members: IconGuildTextShift; //текст для гильдии
    perms: IconGuildTextShift; //это позиция в гильдии
    guildIcon?: boolean; //есть ли аватарка. От этого зависит расположение текста
    [key: string]: IconGuildTextShift | boolean | undefined;
  }

  /**
   * Interface for guild text options with icon shift
   * @remarks
   * This interface - options for draw text on the canvas in guild profile with icon shift
   * @property {number} [iconShift] - how much to shift y-coordinate of text in case of icon exists
   * @example
   * const iconShift: IconGuildTextShift = {
   *   x: 100,
   *   y: 200,
   *   text: "Hello, world!",
   *   iconShift: 40,
   * };
   */
  export interface IconGuildTextShift extends TemplateText {
    iconShift?: number; //на сколько "съехать"
  }

  /**
   * Interface for template blocks options
   * @remarks
   * This interface - options for draw blocks on the canvas in guild profile
   * @property {TemplateBlock} [username] - block for username
   * @property {TemplateBlock} [title] - block for title
   * @property {TemplateBlock} [bio] - block for bio
   * @property {TemplateBlock} [bioFull] - block for full bio
   * @property {TemplateBlock} [bioCenter] - block for centered bio
   * @property {TemplateBlock} [guild] - block for guild
   * @property {TemplateBlock} [badge] - block for badge
   * @property {TemplateBlock} [level] - block for level
   * @example
   * const options: TemplateBlocksOptions = {
   *   username: { text: "Kogasa Tatara", x: 100, y: 100 },
   *   title: { text: "Leader", x: 200, y: 200 },
   * };
   */
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

  /**
   * Interface for priority options
   * @remarks
   * This interface - options for draw blocks on the canvas in guild profile
   * @property {number} [priority] - priority of block. If not specified, then the block will be drawn before the blocks with the specified priority
   * @example
   * const options: PriorityOption = {
   *   priority: 3,
   * };
   */
  export interface PriorityOption {
    priority?: 1 | 2 | 3 | 4 | 5 | 6;
  }

  /**
   * Interface for base draw blocks options
   * @remarks
   * This interface - base options for draw blocks on the canvas in guild profile
   * @property {string | FillOrStrokeOption<string> | GradientOptions} [color] - color of block
   * @property {number | FillOrStrokeOption} [globalAlpha] - global alpha of block
   * @property {TypeDrawImageOrColor | "both"} [drawType] - type of drawing block
   * @property {number} [strokeLineWidth] - width of stroke
   * @property {number | FillOrStrokeOption} [blurOptions] - blur of block
   * @property {string} [name] - name of block
   * @example
   * const options: BaseDrawBlocksOptions = {
   *   color: "red",
   *   globalAlpha: 0.5,
   *   drawType: "stroke",
   *   strokeLineWidth: 5,
   *   blurOptions: 10,
   *   name: "username",
   * };
   */
  export interface BaseDrawBlocksOptions {
    color?: string | FillOrStrokeOption<string> | GradientOptions;
    globalAlpha?: number | FillOrStrokeOption;
    drawType?: TypeDrawImageOrColor | "both";
    strokeLineWidth?: number;
    blurOptions?: number | FillOrStrokeOption;
    name?: string;
  }

  /**
   * Interface for drawing a rounded rectangle on the canvas
   * @remarks
   * This interface - options for draw rounded rectangle on the canvas
   * @property {number} x - x coordinate of top left corner
   * @property {number} y - y coordinate of top left corner
   * @property {number} w - width of block
   * @property {number} h - height of block
   * @property {number} r - rounded corner radius
   * @example
   * const options: DrawRoundedRectOptions = {
   *   x: 100,
   *   y: 100,
   *   w: 200,
   *   h: 200,
   *   r: 20,
   * };
   */
  export interface DrawRoundedRectOptions {
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
  }

  /**
   * Interface for drawing an image avatar on the canvas
   * @remarks
   * This interface - options for draw image avatar on the canvas
   * @property {Image} avatar - image to draw
   */
  export interface DrawImageAvatarOptions extends DrawAvatarOptions {
    avatar: Image;
  }

  /**
   * Interface for drawing a color avatar on the canvas
   * @remarks
   * This interface - options for draw color avatar on the canvas
   * @property {string | GradientOptions} avatar - color to draw
   */
  export interface DrawColorAvatarOptions extends DrawAvatarOptions {
    avatar: string | GradientOptions;
  }

  /**
   * Interface for drawing an avatar on the canvas
   * @remarks
   * This interface - options for draw avatar on the canvas
   * @property {XPOptions} xp - experience options
   * @property {AvatarPositionOptions} avatarPosition - avatar position options
   * @property {BorderOptions & {backgroundColor?: string | GradientOptions, inRadius?: number, outRadius?: number}} avatarBorder - avatar border options
   * @property {AvatarBlurOptions} blurOptions - blur options
   * @property {LineBorderOptions} lineBorder - line border options
   */
  export interface DrawAvatarOptions {
    xp: XPOptions;
    avatarPosition: AvatarPositionOptions;
    avatarBorder?: BorderOptions & { backgroundColor?: string | GradientOptions, inRadius?: number, outRadius?: number };
    blurOptions?: AvatarBlurOptions;
    lineBorder?: LineBorderOptions;
  }


  /**
   * Interface for line border options
   * @remarks
   * This interface - options for line border
   * @property {boolean} off - disable line border
   * @property {{both?: number, top?: number, bottom?: number}} blurOption - blur options
   * @property {number} globalAlpha - global alpha
   * @property {number} radius - radius of line border
   */
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

  /**
   * Interface for experience options
   * @remarks
   * This interface - options for draw experience on the canvas
   * @property {number} now - current experience
   * @property {number} max - maximum experience
   * @property {string | GradientOptions} [color] - color of experience
   * @property {number} [lineWidth] - width of experience line
   * @property {number} [globalAlpha] - global alpha of experience
   * @property {{x: number, y: number, radius?: number}} [position] - position of experience
   */
  export interface XPOptions {
    now: number;
    max: number;
    color?: string | GradientOptions;
    lineWidth?: number;
    globalAlpha?: number;
    position?: X_And_Y & { radius?: number; };
  }

  /**
   * Interface for dimensions
   * @remarks
   * This interface - options for width and height
   */
  export interface Dimensions {
    width?: number;
    height?: number;
  }

  /**
   * Interface for avatar position options
   * @remarks
   * This interface - options for avatar position
   * @property {X_And_Y & { radius?: number; }} image - image options
   * @property {number} radius - radius of avatar
   * @property {number} width - width of avatar
   * @property {number} height - height of avatar
   */
  export interface AvatarPositionOptions extends X_And_Y {
    image?: X_And_Y & { radius?: number; };
    radius?: number;
    width?: number;
    height?: number;
  }

  /**
   * Interface for border options
   * @remarks
   * This interface - options for border
   * @property {string | GradientOptions} color - color of border
   * @property {number} lineWidth - width of border
   */
  export interface BorderOptions {
    color?: string | GradientOptions;
    lineWidth?: number;
  }

  /**
   * Interface for avatar blur options
   * @remarks
   * This interface - options for blur avatar
   * @property {number} [avatar] - blur for avatar
   * @property {{ out?: number; in?: number; }} [border] - blur for border
   * @property {number} [xp] - blur for xp
   */
  export interface AvatarBlurOptions {
    avatar?: number;
    border?: {
      out?: number;
      in?: number;
    }
    xp?: number;
  }

  /**
   * Interface for text formatter options
   * @remarks
   * This interface - options for text formatter
   * @property {string} text - original text
   * @property {string} cache - cached text
   * @property {number} curInd - current index of text
   * @property {number} linesNext - how many lines will be next
   * @property {boolean} dynamic - is text dynamic?
   */
  export interface TextFormatterOptions {
    text: string;
    cache: string;
    curInd: number;
    linesNext: number;
    dynamic: boolean;
  }

  /**
   * Interface for draw background with color
   * @remarks
   * This interface - options for draw background with color
   * @property {string} draw - type of draw
   * @property {string | FillOrStrokeOption<string> | GradientOptions} [color] - color of background
   * @property {number} [blur] - blur for background
   * @property {number} x - x coordinate of top left corner
   * @property {number} y - y coordinate of top left corner
   * @property {boolean} [isClip] - is clip this background?
   * @property {number} [globalAlpha] - global alpha for background
   * @property {TypeDrawImageOrColor | "both" | "none"} [drawType] - type of draw. If not specified - it will be filled and stroked
   * @property {number} [strokeLineWidth] - stroke width for background
   * @property {ArcType} [arcOptions] - options for arc draw
   * @property {RectType} [rectOptions] - options for rect draw
   */
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
    drawType?: TypeDrawImageOrColor | "both" | "none";
    strokeLineWidth?: number;
    arcOptions?: ArcType;
    rectOptions?: RectType;
  }



  /**
   * Interface for draw background with multiple images options
   * @remarks
   * This interface - options for draw background with multiple images options
   * @property {number} x - x coordinate of top left corner
   * @property {number} [y] - y coordinate of top left corner
   * @property {BlurOptions} [blurOptions] - blur options for image
   * @property {TypeDrawImageOrColor} [drawType] - type of draw. If not specified - it will be filled and stroked
   * @property {number} [strokeLineWidth] - stroke width for image
   * @property {number} [globalAlpha] - global alpha for image
   * @property {boolean} [isStroke] - is stroke this image?
   * @property {string} [strokeColor] - stroke color for image
   * @property {GradientOptions} [gradient] - gradient options for image
   * @property {boolean} [isClip] - is clip this image?
   * @property {number} [rotation] - rotation for image
   * @property {ShadowOptions & X_And_Y} [shadow] - shadow options for image
   * @property {X_And_Y} [scale] - scale for image
   * @property {X_And_Y} [translate] - translate for image
   */
  export interface DrawBGTypeFullImageOptions {
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
  }

  /**
 * Interface for draw background with multiple images
 * @remarks
 * This interface - options for draw background with multiple images
 * @property {Image[]} images - array of images
 * @property {"image"} draw - type of draw
 * @property {Array<DrawBGTypeFullImageOptions>} positions - array of positions for each image
 * @example
 * const bgImages: DrawBGTypeFull = {
 *   images: [
 *     await loadImage("path/to/image1.png"),
 *     await loadImage("path/to/image2.png"),
 *   ],
 *   draw: "image",
 *   positions: [
 *     {
 *       x: 10,
 *       y: 20,
 *       blurOptions: {
 *         blur: 10,
 *       },
 *     },
 *     {
 *       x: 50,
 *       y: 100,
 *       drawType: "stroke",
 *       strokeLineWidth: 5,
 *       strokeColor: "red",
 *     },
 *   ],
 * };
 */
  export interface DrawBGTypeFull {
    images: LimitedArrayArgs<Image, 2>;
    draw: "image";
    positions: LimitedArrayArgs<DrawBGTypeFullImageOptions, 1 | 2>;
  }

  /**
   * Interface for draw background with one image
   * @remarks
   * This interface - options for draw background with one image
   * @property {Image} image - image to draw
   * @property {DrawBGPosition} [imagePosition] - position of image
   * @property {"image"} draw - type of draw
   * @property {number} x - x coordinate of top left corner
   * @property {number} [y] - y coordinate of top left corner
   * @property {BlurOptions} [blurOptions] - blur options
   * @property {boolean} [isStroke] - is stroke?
   * @property {number} [strokeLineWidth] - stroke width
   * @property {string} [strokeColor] - stroke color
   * @property {GradientOptions} [gradient] - gradient options
   * @property {number} [globalAlpha] - global alpha
   * @property {boolean} [isClip] - is clip?
   * @property {number} [rotation] - rotation
   * @property {ShadowOptions & X_And_Y} [shadow] - shadow options
   * @property {X_And_Y} [scale] - scale
   * @property {X_And_Y} [translate] - translate
   */
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

  /**
   * Interface for apply background image transformations options
   * @remarks
   * This interface - options for apply background image transformations
   * @property {X_And_Y} [scale] - scale for image
   * @property {X_And_Y} [translate] - translate for image
   * @property {number} [rotation] - rotation for image
   * @property {ShadowOptions & X_And_Y} [shadow] - shadow options for image
   * @property {number} [globalAlpha] - global alpha for image
   * @property {number} [strokeLineWidth] - stroke width for image
   * @property {string} [strokeColor] - stroke color for image
   * @property {GradientOptions} [gradient] - gradient options for image
   * @property {BlurOptions} [blurOptions] - blur options for image
   * @property {DrawBGPosition} imagePosition - position of image
   */
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

  /**
   * Interface for shadow options
   * @remarks
   * This interface - options for shadow
   * @property {string} color - color of shadow
   * @property {number} [blur] - blur for shadow
   */
  export interface ShadowOptions {
    color: string;
    blur?: number;
  }

  /**
   * Interface for x and y options
   * @remarks
   * This interface - options for x and y
   * @property {number} x - x coordinate
   * @property {number} y - y coordinate
   */
  export interface X_And_Y {
    x: number;
    y: number;
  }

  /**
   * Interface for blur options
   * @remarks
   * This interface - options for blur
   * @property {number} [banner] - blur for banner
   * @property {number} [bottom] - blur for bottom
   * @property {number} [full] - blur for full
   */
  export interface BlurOptions {
    banner?: number;
    bottom?: number;
    full?: number;
  }

  /**
   * Interface for rect options
   * @remarks
   * This interface - options for rect
   * @property {number} width - width of rect
   * @property {number} height - height of rect
   */
  export interface RectType {
    width: number;
    height: number;
  }

  /**
   * Interface for arc options
   * @remarks
   * This interface - options for arc
   * @property {number} radius1 - radius of arc
   * @property {number} [radius2] - radius of arc
   * @property {number} startAngle - start angle of arc
   * @property {number} endAngle - end angle of arc
   * @property {boolean} [counterclockwise] - is counterclockwise?
   * @property {boolean} [isScale] - is scale?
   */
  export interface ArcType {
    radius1: number;
    radius2?: number;
    startAngle: number;
    endAngle: number;
    counterclockwise?: boolean;
    isScale?: boolean;
  }


  /**
   * Interface for set font style options
   * @remarks
   * This interface - options for set font style
   * @property {number | string} [size] - size of font
   * @property {string} [font] - font
   * @property {CanvasColorOptions} [color] - color of font
   * @property {1 | 2 | 3} [type] - type of font
   * 1 - fill font
   * 2 - stroke font
   * 3 - both fill and stroke font
   */
  export interface SetFontStyleOptions {
    size?: number | string;
    font?: string;
    color?: CanvasColorOptions;
    type?: 1 | 2 | 3;
  }

  /**
   * Interface for draw text options
   * @remarks
   * This interface - options for draw text on the canvas
   * @property {number} x1 - x coordinate of top left corner
   * @property {number} [x2] - x coordinate of bottom right corner
   * @property {number} y - y coordinate of top left corner
   * @property {number} [x_translate] - translate x coordinate
   */
  export interface DrawTextOptions extends TextBase {
    x1: number;
    x2?: number;
    y: number;
    x_translate?: number;
  }

  /**
   * Interface for base text options
   * @remarks
   * This interface - options for text
   * @property {string | number} text - text to draw
   * @property {"normal" | "center" | "left"} [textDirect] - direction of text
   * @property {SetFontStyleOptions} [fontOptions] - options for font style
   * @property {boolean} [clipNumber] - clip number?
   * @property {boolean} [timeFormat] - format text as time?
   * @property {DrawDynamicOptions} [dynamicOptions] - options for dynamic text
   */
  export interface TextBase {
    text: string | number;
    textDirect?: "normal" | "center" | "left";
    fontOptions?: SetFontStyleOptions;
    clipNumber?: boolean;
    timeFormat?: boolean;
    dynamicOptions?: DrawDynamicOptions;
  }

  /**
   * Interface for draw dynamic text options
   * @remarks
   * This interface - options for draw dynamic text on the canvas
   * @property {boolean} [dynamic] - is dynamic?
   * @property {number} [dynamicCorrector] - corrector for dynamic text
   * @property {boolean} [isClip] - is clip?
   * @property {number} [lines] - number of lines
   * @property {number} [lineSpacing] - line spacing
   */
  export interface DrawDynamicOptions {
    dynamic?: boolean;
    dynamicCorrector?: number;
    isClip?: boolean;
    lines?: number;
    lineSpacing?: number;
  }

  /**
   * Interface for gradient options
   * @remarks
   * This interface - options for gradient
   * @property {string} [type] - type of gradient
   * @property {TypeDrawImageOrColor | "both"} [colorType] - type of color
   * @property {GradientColorStop[]} colors - array of gradient color stops
   * @property {LinearGradientOptions} [linear] - options for linear gradient
   * @property {RadialGradientOptions} [radial] - options for radial gradient
   */
  export interface GradientOptions {
    type?: "linear" | "radial";
    colorType?: TypeDrawImageOrColor | "both";
    colors: GradientColorStop[];
    linear?: LinearGradientOptions;
    radial?: RadialGradientOptions;
  }


  /**
   * Interface for gradient color stops
   * @remarks
   * This interface - options for gradient color stops
   * @property {number} offset - offset of color stop
   * @property {string} color - color of color stop
   */
  export interface GradientColorStop {
    offset: number;
    color: string;
  }

  /**
   * Interface for linear gradient options
   * @remarks
   * This interface - options for linear gradient
   * @property {number} x0 - x coordinate of start point
   * @property {number} y0 - y coordinate of start point
   * @property {number} x1 - x coordinate of end point
   * @property {number} y1 - y coordinate of end point
   */
  export interface LinearGradientOptions {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  }

  /**
   * Interface for radial gradient options
   * @remarks
   * This interface - options for radial gradient
   * @property {number} x0 - x coordinate of start circle
   * @property {number} y0 - y coordinate of start circle
   * @property {number} r0 - radius of start circle
   * @property {number} x1 - x coordinate of end circle
   * @property {number} y1 - y coordinate of end circle
   * @property {number} r1 - radius of end circle
   */
  export interface RadialGradientOptions {
    x0: number;
    y0: number;
    r0: number;
    x1: number;
    y1: number;
    r1: number;
  }

  /**
   * Interface for base draw text options
   * @remarks
   * This interface - base options for draw text on the canvas
   * @property {DynamicOptionDrawsText[]} [dynamicOptions] - dynamic options for draw text
   */
  export interface DrawTextsBase {
    dynamicOptions?: DynamicOptionDrawsText[];
  }

  /**
   * Interface for static draw text options
   * @remarks
   * This interface - options for static draw text on the canvas
   * @property {Partial<DrawTextOptions>} [update] - update options for draw text
   * @property {number} [start] - start index of text
   * @property {number} [end] - end index of text
   */
  export interface StaticOptions {
    update?: Partial<DrawTextOptions>;
    start?: number;
    end?: number;
  }

  /**
   * Interface for dynamic draw text options
   * @remarks
   * This interface - options for dynamic draw text on the canvas
   * @property {number} [start] - start index of text
   * @property {number} [end] - end index of text
   * @property {boolean} [cache] - cache dynamic text
   */
  export interface DynamicOptions {
    start?: number;
    end?: number;
    cache?: boolean;
  }

  /**
   * Interface for update dynamic draw text options
   * @remarks
   * This interface - options for update dynamic draw text on the canvas
   * @property {Partial<DrawTextOptions>} update - update options for draw text
   */
  export interface UpdateDynamicDrawText {
    update: Partial<DrawTextOptions>;
  }

  /**
   * Interface for template type options
   * @remarks
   * This interface - options for template type
   * @property {TemplatePositionType} banner - template position for banner
   * @property {TemplatePositionType} full - template position for full
   * @property {TemplatePositionType} bottom - template position for bottom
   */
  export interface TemplateType {
    banner: TemplatePositionType;
    full: TemplatePositionType;
    bottom: TemplatePositionType;
  }

  /**
   * Interface for private draw image options
   * @remarks
   * This interface - options for private draw image
   * @property {PDImagePosition} temType - template position type
   * @property {TemplateType} templateType - template type
   * @property {BlurOptions} [blurOptions] - blur options
   * @property {Image} image - image to draw
   * @property {number} dx - x coordinate of top left corner
   * @property {number} dy - y coordinate of top left corner
   * @property {number} dw - width of image
   * @property {number} [dh] - height of image
   */
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

  /**
   * Interface for draw blocks options
   * @remarks
   * This interface - options for draw blocks on the canvas in guild profile
   * @property {BaseDrawBlocksOptions} [options] - base options for draw blocks
   * @property {DrawRoundedRectOptions} [options] - options for draw rounded rect
   * @property {XTemplatePosition} [x_position] - x position of block
   */
  export interface DrawBlocksOptions extends BaseDrawBlocksOptions, DrawRoundedRectOptions {
    x_position?: XTemplatePosition;
  }

  /**
   * Interface for template position type
   * @remarks
   * This interface - options for template position type
   * @property {number} x - x coordinate of top left corner
   * @property {number} y - y coordinate of top left corner
   * @property {number} width - width of block
   * @property {number} height - height of block
   */
  export interface TemplatePositionType {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  /**
   * Fill or stroke options
   * @remarks
   * This interface - options for fill or stroke
   * @property {T} [fill] - fill color
   * @property {K} [stroke] - stroke color
   */
  export type FillOrStrokeOption<T = number, K = T> = { fill?: T; stroke?: K; };

  /**
   * Border or icon options
   * @remarks
   * This interface - options for border or icon
   * @property {T} [border] - border width
   * @property {K} [icon] - icon image
   */
  export type BorderOrIcon<T = number, K = T> = { border?: T; icon?: K; };

  /**
   * String or gradient options
   * @remarks
   * This interface - options for string or gradient
   * @property {string} [string] - string color
   * @property {GradientOptions} [gradient] - gradient options
   */
  export type StringOrGradient = string | GradientOptions;

  /**
   * Template text options
   * @remarks
   * This interface - options for template text
   * @property {TextBase} text - text options
   * @property {Partial<DrawTextOptions>} [drawOptions] - draw text options
   * @property {PriorityOption} [priority] - priority options
   */
  export type TemplateText = TextBase & Partial<DrawTextOptions> & PriorityOption;

  /**
   * Template block options
   * @remarks
   * This interface - options for template block
   * @property {BaseDrawBlocksOptions} block - block options
   * @property {PriorityOption} [priority] - priority options
   */
  export type TemplateBlock = BaseDrawBlocksOptions & PriorityOption;

  /**
   * Canvas color options
   * @remarks
   * This interface - options for canvas color
   * @property {string} [string] - string color
   * @property {CanvasGradient} [gradient] - gradient options
   * @property {CanvasPattern} [pattern] - pattern options
   */
  export type CanvasColorOptions = string | CanvasGradient | CanvasPattern;

  /**
   * Dynamic draw text options
   * @remarks
   * This interface - options for dynamic draw text
   * @property {DynamicOptions} dynamic - dynamic options
   * @property {UpdateDynamicDrawText} update - update options
   */
  export type DynamicOptionDrawsText = DynamicOptions & UpdateDynamicDrawText;

  /**
   * Draw text options
   * @remarks
   * This interface - options for draw text
   * @property {DrawTextsBase} base - base options
   * @property {StaticOptions} [staticOptions] - static options
   */
  export type DrawTextsOption = DrawTextsBase & StaticOptions;

  /**
   * X template position options
   * @remarks
   * This interface - options for x template position
   * @property {"right" | "center" | "left"} [position] - x position
   */
  export type XTemplatePosition = "right" | "center" | "left";

  /**
   * Draw background position options
   * @remarks
   * This interface - options for draw background position
   * @property {"banner" | "full" | "bottom"} [position] - draw background position
   */
  export type DrawBGPosition = "banner" | "full" | "bottom";

  /**
   * Private draw image position options
   * @remarks
   * This interface - options for private draw image position
   * @property {Exclude<DrawBGPosition, "full">} [position] - private draw image position
   */
  export type PDImagePosition = Exclude<DrawBGPosition, "full">;

  /**
   * Draw background type options
   * @remarks
   * This interface - options for draw background type
   * @property {"rect" | "arc"} [type] - draw background type
   */
  export type DrawBGType = "rect" | "arc";

  /**
   * Type draw image or color options
   * @remarks
   * This interface - options for type draw image or color
   * @property {"fill" | "stroke"} [type] - type draw image or color
   */
  export type TypeDrawImageOrColor = "fill" | "stroke";

  /**
   * String number options
   * @remarks
   * This interface - options for string number
   * @property {string | number} [value] - string number value
   */
  export type StringNumber = string | number;

  /**
   * Render type options
   * @remarks
   * This interface - options for render type
   * @property {"image/png" | "image/jpeg"} [type] - render type
   */
  export type RenderType = "image/png" | "image/jpeg";

  /**
   * Draw option options
   * @remarks
   * This interface - options for draw option
   * @property {DrawBGDrawTypeColor | DrawBGTypeFull | DrawBGTypeAllOne} [option] - draw option
   */
  export type DrawOption = DrawBGDrawTypeColor | DrawBGTypeFull | DrawBGTypeAllOne;
}