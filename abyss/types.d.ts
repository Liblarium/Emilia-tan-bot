import type { Image } from "@napi-rs/canvas";
import sharp from "sharp";
import * as types from "../types";
import { FontOptions } from './types.d';

export * from "../types";

/**
 * Represents the options for drawing a clan profile.
 */
export interface DrawClanProfileOptions {
  /** The URL of the clan logo. */
  logoUrl: string;
  /** The name of the clan. */
  name: string;
  /** The clan's motto. */
  motto: string;
  /** The date the clan was created. Optional field. */
  creationDate?: Date; // Изменено на Date
  /** The number of members in the clan. Optional field. */
  memberCount?: number;
  /** The level of activity in the clan. Optional field. */
  activityLevel?: ActivityLevel; // Добавлено enum
  /** The achievements of the clan. */
  achievements: string[];
}

/** Enum for representing the activity levels of the clan. */
export enum ActivityLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  VERY_HIGH = "very_high"
}

/**
 * Represents the optional options for drawing a badge.
 */
export interface DrawBadgeOptionalOptions extends XYPosition {
  /** Background color or gradient for the badge. */
  bgColor?: StringOrGradient | FillOrStrokeOption<string>;
  /** Width of the badge block. */
  bgW?: number;
  /** Height of the badge block. */
  bgH?: number;
  /** Corner radius for the badge. */
  bgR?: number;
  /** Width of the background line. */
  bgLineWidth?: number;
  /** Whether to disable the stroke. */
  offStroke?: boolean;
  /** Global alpha value or stroke options. */
  globalAlpha?: number | FillOrStrokeOption;
  /** Blur effect for the badge. */
  blur?: number | FillOrStrokeOption;
  /** Fill type for the badge background. */
  bgFill?: BadgeFillType; // Изменено на enum
}

/** Enum for representing the badge fill types. */
export enum BadgeFillType {
  FULL = "full",
  UNIQUE = "unique",
  NONE = "none"
}


/**
 * Represents the options for drawing a badge.
 */
export interface DrawBadgeOptions extends Partial<XYPosition> {
  /** Space between badges. */
  space?: number;
  /** The image that will be loaded as a badge. */
  badge: Image;
  /** Width of the badge. If not specified, defaults to height. */
  w?: number;
  /** Height of the badge. If not specified, equals to width (w). */
  h?: number;
  /** Global alpha value (transparency) ranging from 0 (fully transparent) to 1 (fully opaque). */
  globalAlpha?: number;
  /** Blur effect for the badge. Specify value for blur radius. */
  blur?: number;
  /** Priority for badge placement. Lower values indicate higher priority. */
  priority?: number;
}


/**
 * Represents the options for drawing a guild icon (avatar).
 */
export interface DrawGuildIconOptions {
  /** X coordinate of the top-left corner. */
  x1: number;
  /** X coordinate of the bottom-right corner. */
  x2: number;
  /** Y coordinate of the top-left corner. */
  y1: number;
  /** Y coordinate of the bottom-right corner. */
  y2: number;
  /** Width of the icon. */
  w: number;
  /** Height of the icon. */
  h: number;
  /** Radius for rounded corners. */
  r: number;
  /** Width of the border line, if any. */
  borderLineWidth?: number;
  /** Color of the border, can be a gradient. */
  borderColor?: StringOrGradient;
  /** The image or gradient to be used as the icon. */
  icon: Image | StringOrGradient;
  /** Global alpha value (transparency) ranging from 0 (fully transparent) to 1 (fully opaque). */
  globalAlpha?: number | BorderOrIcon;
  /** Blur effect for the icon. Specify value for blur radius. */
  blurOptions?: number | BorderOrIcon;
  /** Flag to indicate whether to draw the border. */
  offBorder?: boolean;
}


/**
 * Represents the options for template text rendering.
 */
export interface TemplateTextOptions {
  /** Template for the username text. */
  username?: TemplateText;
  /** Template for the title text. */
  title?: TemplateText;
  /** Template for the bio text. */
  bio?: TemplateText;
  /** Template for the full bio text. */
  bioFull?: TemplateText;
  /** Template for the centered bio text. */
  bioCenter?: TemplateText;
  /** Options for guild-specific text rendering. */
  guild?: GuildTemplateTextOptions;
  /** Template for the level text. */
  level?: TemplateText;
  /** 
   * Additional template text options.
   * Can include any key with TemplateText or GuildTemplateTextOptions.
   */
  [key: string]: TemplateText | GuildTemplateTextOptions | undefined;
}

/**  
 * Options for rendering text associated with a guild template.
 */
export interface GuildTemplateTextOptions {
  /** Name of the guild. */
  guildName: IconGuildTextShift;
  /** Type of the guild. */
  guildType: IconGuildTextShift;
  /** Text for the guild's members. */
  members: IconGuildTextShift;
  /** Position in the guild. */
  perms: IconGuildTextShift;
  /** Indicates if there is an avatar; affects text positioning. */
  guildIcon?: boolean;
  /** Additional options that may affect text rendering. */
  [key: string]: IconGuildTextShift | boolean | undefined;
}

/**  
 * Specifies the vertical shift for text when an avatar is present.
 * 
 * For example, if `y: 400` and `iconShift: 40` is specified, 
 * the resulting position will be `y = 440` to avoid overlap with the avatar.
 */
export interface IconGuildTextShift extends TemplateText {
  /** Amount to shift the text downwards due to the presence of an avatar. */
  iconShift?: number;
}

/**  
 * Options for rendering different blocks of a template.
 */
export interface TemplateBlocksOptions {
  /** Block for the username. */
  username?: TemplateBlock;
  /** Block for the title. */
  title?: TemplateBlock;
  /** Block for the bio (short version). */
  bio?: TemplateBlock;
  /** Block for the full bio (long version). */
  bioFull?: TemplateBlock;
  /** Block for center-aligned bio. */
  bioCenter?: TemplateBlock;
  /** Block for the guild information. */
  guild?: TemplateBlock;
  /** Block for badges. */
  badge?: TemplateBlock;
  /** Block for the user's level. */
  level?: TemplateBlock;
  /** Additional blocks that may be included in the template. */
  [key: string]: TemplateBlock | undefined;
}


/**  
 * Enum representing priority levels.
 */
export enum PriorityLevel {
  One = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
}

/**  
 * Options for specifying priority levels.
 */
export interface PriorityOption {
  /** The priority level, represented by an enum. */
  priority?: PriorityLevel;
}


/**
 * Options for drawing base blocks.
 */
export interface BaseDrawBlocksOptions {
  /**
   * The color to fill the block. It can be a string, a fill/stroke option, or gradient settings.
   */
  color?: string | FillOrStrokeOption<string> | GradientOptions;

  /**
   * The global alpha (opacity) for the block. It can be a number or a fill/stroke option.
   */
  globalAlpha?: number | FillOrStrokeOption;

  /**
   * The type of drawing to be applied. This can be an image type, color type, or both.
   */
  drawType?: DrawMethod | DrawOptions.BOTH;

  /**
   * The width of the stroke line for the block.
   */
  strokeLineWidth?: number;

  /**
   * Options for applying a blur effect. It can be a number or a fill/stroke option.
   */
  blurOptions?: number | FillOrStrokeOption;

  /**
   * The name of the block for identification or reference purposes.
   */
  name?: string;
}

/**
 * Options for drawing a rounded rectangle.
 */
export interface DrawRoundedRectOptions extends XYPosition {
  /** The width of the rectangle. */
  w: number;

  /** The height of the rectangle. */
  h: number;

  /** The radius of the corners. */
  r: number;
}

/**
 * Options for drawing an avatar using an image.
 */
export interface DrawImageAvatarOptions extends DrawAvatarOptions {
  avatar: Image; // The image to be used as the avatar.
}

/**
 * Options for drawing an avatar using a color or gradient.
 */
export interface DrawColorAvatarOptions extends DrawAvatarOptions {
  avatar: string | GradientOptions; // The color or gradient to be used as the avatar.
}

/**
 * Options for avatar border customization.
 */
export interface DrawAvatarBorderOption extends BorderOptions {
  backgroundColor?: string | GradientOptions; // Background color for the border.
  inRadius?: number; // Inner radius for rounded corners.
  outRadius?: number; // Outer radius for rounded corners.
}

/**
 * Options for blur effect customization.
 */
export interface BlurOptions {
  both?: number; // Blur applied to both top and bottom.
  top?: number; // Blur applied to the top.
  bottom?: number; // Blur applied to the bottom.
}

/**
 * Base options for drawing avatars.
 */
export interface DrawAvatarOptions {
  xp: XPOptions; // Experience points related to the avatar.
  avatarPosition: AvatarPositionOptions; // Position settings for the avatar.
  avatarBorder?: DrawAvatarBorderOption; // Options for the avatar's border.
  blurOptions?: AvatarBlurOptions; // Options for applying blur effects.
  lineBorder?: LineBorderOptions; // Options for line borders.
}

/**
 * Options for line borders including custom positioning and effects.
 */
export interface LineBorderOptions extends BorderOptions, Partial<XYPosition> {
  off?: boolean; // If true, disables the line border.
  blurOption?: BlurOptions; // Options for applying blur to the line.
  globalAlpha?: number; // Global alpha for line transparency.
  radius?: number; // Radius for rounded line corners.
}

/**
 * Options for avatar experience points.
 */
export interface XPOptions {
  now: number; // Current XP value.
  max: number; // Maximum XP value.
  color?: string | GradientOptions; // Color for the XP representation.
  lineWidth?: number; // Line width for the XP display.
  globalAlpha?: number; // Global alpha for XP transparency.
  position?: XYPosition & { radius?: number; }; // Positioning options for XP display.
}

/**
 * Dimensions for graphical elements.
 */
export interface Dimensions {
  width?: number; // Width of the element.
  height?: number; // Height of the element.
}

/**
 * Positioning options for avatars, including image and dimensions.
 */
export interface AvatarPositionOptions extends XYPosition {
  image?: XYPosition & { radius?: number; }; // Position options for the avatar image.
  radius?: number; // Radius for rounded avatar edges.
  width?: number; // Width of the avatar.
  height?: number; // Height of the avatar.
}

/**
 * Options for borders including color and line width.
 */
export interface BorderOptions {
  color?: string | GradientOptions; // Color of the border.
  lineWidth?: number; // Line width of the border.
}

/**
 * Options for border radius customization.
 */
export interface BorderOption {
  out?: number; // Outer border radius.
  in?: number; // Inner border radius.
}

/**
 * Options for applying blur effects to avatar components.
 */
export interface AvatarBlurOptions {
  avatar?: number; // Blur amount for the avatar.
  border?: BorderOption; // Blur options for the border.
  xp?: number; // Blur amount for the XP display.
}

/**
 * Options for formatting text within graphical elements.
 */
export interface TextFormatterOptions {
  text: string; // Text to be formatted.
  cache: string; // Cached formatted text.
  curInd: number; // Current index for text processing.
  linesNext: number; // Number of lines available for the next segment.
  dynamic: boolean; // If true, enables dynamic formatting options.
}

/**
 * Options for formatting text within graphical elements.
 */
export interface TextFormatterOptions {
  /** The text to be formatted. */
  text: string; // The string of text that needs to be formatted.

  /** Cached formatted text to improve performance. */
  cache: string; // A cached version of the formatted text.

  /** The current index for tracking position within the text. */
  curInd: number; // The current index for processing the text.

  /** The number of lines available for the next segment of text. */
  linesNext: number; // The number of lines that can accommodate more text.

  /** Indicates whether dynamic formatting options are enabled. */
  dynamic: boolean; // If true, enables dynamic text formatting.
}

/**
 * Interface representing options for drawing a background with color.
 */
export interface DrawBGDrawTypeColor extends XYPosition {
  /** The drawing type, which is always set to COLOR. */
  draw: DrawType.COLOR;

  /** The fill color or stroke options. */
  color?: FillOrStrokeOption<string>;

  /** Gradient options for the drawing. */
  gradient?: GradientOptions;

  /** Enum indicating the background drawing type. */
  typeDraw?: DrawBGEnum;

  /** Draw priority method (fill, stroke, or both). */
  drawPriority?: DrawMethod;

  /** Amount of blur applied to the drawing. */
  blur?: number;

  /** Flag indicating whether the drawing should be clipped. */
  isClip?: boolean;

  /** The global alpha value for the drawing. */
  globalAlpha?: number;

  /** Specifies the drawing method (fill, stroke, both, or none). */
  drawType?: DrawMethod | DrawOptions;

  /** Line width for the stroke. */
  strokeLineWidth?: number;

  /** Options for drawing arcs. */
  arcOptions?: ArcType;

  /** Options for drawing rectangles. */
  rectOptions?: RectType;
}


/**
 * Interface representing options for drawing a full background with images.
 */
export interface DrawBGTypeFull {
  /** An array of limited images (up to 2). */
  images: ArrayLimited<Image, 2>;

  /** The drawing type, which is set to IMAGE. */
  draw: DrawType.IMAGE;

  /** An array of positions for drawing, limited to 1 or 2. */
  positions: ArrayLimited<DrawBGPositionOptions, 1 | 2>;
}

/**
 * Interface representing options for the position of drawings.
 */
export interface DrawBGPositionOptions extends XYPosition, Dimensions {
  /** Options for applying blur effects. */
  blurOptions?: BlurOptions;

  /** Type of drawing (fill, stroke, or both). */
  drawType?: TypeDrawImageOrColor;

  /** Line width for the stroke. */
  strokeLineWidth?: number;

  /** Global alpha value for the drawing. */
  globalAlpha?: number;

  /** Flag indicating whether to apply a stroke. */
  isStroke?: boolean;

  /** Color for the stroke. */
  strokeColor?: string;

  /** Gradient options for the drawing. */
  gradient?: GradientOptions;

  /** Flag indicating whether the drawing should be clipped. */
  isClip?: boolean;

  /** Rotation angle for the image. */
  rotation?: number;

  /** Shadow options including position. */
  shadow?: ShadowOptions & XYPosition;

  /** Scale options for the drawing position. */
  scale?: XYPosition;

  /** Translation options for the drawing position. */
  translate?: XYPosition;
}

/**
 * Interface representing options for drawing a single background image.
 */
export interface DrawBGTypeAllOne extends Dimensions {
  /** The image to be drawn. */
  image: Image;

  /** Position options for the image, using the previously defined position options interface. */
  imagePosition?: DrawBGPositionOptions;

  /** The drawing type, which is set to IMAGE. */
  draw: DrawType.IMAGE;

  /** The x-coordinate for the drawing. */
  x: number;

  /** The y-coordinate for the drawing (optional). */
  y?: number;

  /** Options for applying blur effects. */
  blurOptions?: BlurOptions;

  /** Flag indicating whether to apply a stroke. */
  isStroke?: boolean;

  /** Line width for the stroke. */
  strokeLineWidth?: number;

  /** Color for the stroke. */
  strokeColor?: string;

  /** Gradient options for the drawing. */
  gradient?: GradientOptions;

  /** Global alpha value for the drawing. */
  globalAlpha?: number;

  /** Flag indicating whether the drawing should be clipped. */
  isClip?: boolean;

  /** Rotation angle for the image. */
  rotation?: number;

  /** Shadow options including position. */
  shadow?: ShadowOptions & XYPosition;

  /** Scale options for the drawing position. */
  scale?: XYPosition;

  /** Translation options for the drawing position. */
  translate?: XYPosition;
}

/**
 * Interface for options to apply transformations to a background image.
 */
export interface ApplyBGImageTransformationsOptions {
  /** Scale transformation options for the image position. */
  scale?: XYPosition;

  /** Translation options for the image position. */
  translate?: XYPosition;

  /** Rotation angle for the image. */
  rotation?: number;

  /** Shadow options including position, applied to the image. */
  shadow?: ShadowOptions & XYPosition;

  /** Global alpha value for the image. */
  globalAlpha?: number;

  /** Line width for the stroke applied to the image. */
  strokeLineWidth?: number;

  /** Color for the stroke applied to the image. */
  strokeColor?: string;

  /** Gradient options for the image. */
  gradient?: GradientOptions;

  /** Options for applying blur effects to the image. */
  blurOptions?: BlurOptions;

  /** Position options for the background image. */
  imagePosition: DrawBGPosition;
}
/**
 * Options for configuring shadow properties.
 */
export interface ShadowOptions {
  /** Color of the shadow. */
  color: string;
  /** Blur radius for the shadow. */
  blur?: number;
}

/**
 * Represents a 2D position with x and y coordinates.
 */
export interface PositionXY {
  /** X-coordinate. */
  x: number;
  /** Y-coordinate. */
  y: number;
}

/**
 * Settings for blur effects.
 */
export interface BlurSettings {
  /** Blur amount for the banner. */
  banner?: number;
  /** Blur amount for the bottom. */
  bottom?: number;
  /** Total blur amount. */
  full?: number;
}

/**
 * Represents the dimensions of a rectangle.
 */
export interface RectangleDimensions {
  /** Width of the rectangle. */
  width: number;
  /** Height of the rectangle. */
  height: number;
}

/**
 * Represents the dimensions of an arc.
 */
export interface ArcDimensions {
  /** Primary radius for the arc. */
  radius1: number;
  /** Secondary radius (optional). */
  radius2?: number;
  /** Starting angle in radians. */
  startAngle: number;
  /** Ending angle in radians. */
  endAngle: number;
  /** If true, draw counterclockwise. */
  counterclockwise?: boolean;
  /** If true, scaling is applied. */
  isScaled?: boolean;
}

/**
 * Enum representing different font styles for text rendering.
 * - 1: Fills the text with the given color.
 * - 2: Strokes the text with the given color.
 * - 3: Both fills and strokes the text with the given color.
 */
export enum FontStyle {
  /** Represents the fill font style. */
  ONE = 1,
  /** Represents the stroke font style. */
  TWO,
  /** Represents both fill and stroke font styles. */
  THREE
}


/**
 * Options for setting font styles.
 */
export interface SetFontStyleOptions {
  /** Font size (number or string). */
  size?: number | string;
  /** Font family. */
  font?: string;
  /** Color for the font. */
  color?: CanvasColorOptions;
  /** Type of font style. */
  type?: FontStyle;
}

/**
 * Options for setting the font style of the drawing context.
 */
export interface SetFontStyleOptions {
  /** 
   * The size of the font. Can be specified as a number (in pixels) 
   * or a string (with units, e.g., '16px').
   */
  size?: number | string;

  /** 
   * The font family to be used. Default is "Arial".
   */
  font?: string;

  /** 
   * The color of the font. Can be a string representing a color 
   * or an instance of CanvasColorOptions.
   */
  color?: CanvasColorOptions;

  /** 
   * The type of font style to apply. 
   * Uses FontStyleEnum to specify fill, stroke, or both.
   */
  type?: FontStyleTypeEnum;
}

/**
 * Options for drawing text on the canvas.
 * Inherits from TextBase.
 */
export interface DrawTextOptions extends TextBase {
  /** 
   * The x-coordinate for the start of the text.
   */
  x1: number;

  /** 
   * Optional x-coordinate for the end of the text. 
   * If not provided, the text will be drawn at x1.
   * @optional
   */
  x2?: number;

  /** 
   * The y-coordinate for the text's position.
   */
  y: number;

  /** 
   * Optional x-translation for adjusting the text position.
   * Useful for centering or offsetting the text.
   * @optional
   */
  x_translate?: number;
}

/**
 * Enum for text alignment options.
 * @enum {string}
 */
export enum TextAlignment {
  /** Aligns text to the left. */
  LEFT = "left",
  /** Centers the text. */
  CENTER = "center",
  /** Aligns text to the right. */
  RIGHT = "right",
}

/**
 * Base interface for text properties.
 */
export interface TextBase {
  /**
   * The text content to be rendered.
   * Can be either a string or a number.
   */
  text: string | number;

  /**
   * The alignment of the text.
   * @default TextAlignment.LEFT
   */
  textAlignment?: TextAlignment;

  /**
   * Options for font styling.
   */
  fontOptions?: SetFontStyleOptions;

  /**
   * Indicates whether to clip the number when rendering.
   */
  clipNumber?: boolean;

  /**
   * Indicates whether to format the time.
   */
  timeFormat?: boolean;

  /**
   * Dynamic options for drawing.
   */
  dynamicOptions?: DrawDynamicOptions;
}


/**
 * Options for drawing dynamic elements.
 */
export interface DrawDynamicOptions {
  /** 
   * Indicates whether the drawing should be dynamic or static. 
   * Defaults to false if not specified.
   */
  dynamic?: boolean;

  /** 
   * A correction factor to adjust the dynamics. 
   * Can be used to fine-tune the appearance of dynamic elements.
   */
  dynamicCorrector?: number;

  /** 
   * Indicates whether the drawing should be clipped. 
   * Defaults to false if not specified.
   */
  isClip?: boolean;

  /** 
   * The number of lines to draw. 
   * Can be used to limit the amount of drawn lines based on specific conditions.
   */
  lines?: number;

  /** 
   * The spacing between lines. 
   * Used to control the vertical distance between drawn lines.
   */
  lineSpacing?: number;
}

/**
 * Options for drawing the base description of a clan.
 */
export interface DrawClanDescriptionBaseOptions extends PositionXY {
  /** 
   * The width of the clan description area. 
   */
  width: number;

  /** 
   * The height of the clan description area. 
   */
  height: number;
}

/**
 * Options for styling the clan description.
 */
export interface DrawClanDescriptionStyleOptions {
  /** 
   * The color of the outline for the clan description.
   */
  outlineColor?: string;

  /** 
   * The background color for the clan description.
   */
  backgroundColor?: string;

  /** 
   * The width of the outline line.
   */
  lineWidth?: number;

  /** 
   * The amount of blur to apply to the description in pixels.
   */
  blurPx?: number;
}

/**
 * Options for drawing clan description text.
 */
export interface DrawClanDescriptionTextOptions extends DrawClanDescriptionText, FontOptionsAndText { }

export interface DrawClanDescriptionText {
  /** 
   * The x-coordinate of the starting point for the text.
   */
  x1: number;

  /** 
   * The x-coordinate of the ending point for the text.
   */
  x2: number;

  /** 
   * The y-coordinate for the vertical position of the text.
   */
  y: number;

  /** 
   * Options for dynamic adjustments when drawing the text.
   */
  dynamicOptions: DrawDynamicOptions;
}

/**
 * An object containing the actual text to be drawn and options for the font used in the text.
 */
interface FontOptionsAndText {
  /**
   * The actual text to be drawn.
   */
  text: string;
  /**
   * Options for the font used in the text.
   */
  fontOptions: FontOptions;
}

/**
 * Options for drawing clan information.
 */
export interface DrawClanInfoOptions extends Partial<DrawClanDescriptionText> {
  /** The x-coordinate for positioning the clan information. */
  x?: number;

  /** A correction value for positioning adjustments. */
  corrector?: number;

  /** The creation date of the clan in string format. */
  created: string;

  /** The type of the clan information being drawn. */
  type: string;

  /** The global alpha value for transparency (0 to 1). */
  globalAlpha?: number;

  /** An array of options for the font used in the text. */
  fontOptions?: types.ArrayNotEmpty<FontOptions>;

  /** The amount of blur to apply to the background. */
  blurPx?: number;

  /** The background color of the clan information. */
  backgroundColor?: string;

  /** The outline color for the clan information. */
  outlineColor?: string;

  /** The width of the drawing area for the clan information. */
  width?: number;

  /** The height of the drawing area for the clan information. */
  height?: number;

  /** The radius for rounded corners of the drawing area. */
  radius?: number;
}

/**
 * Options for font styling.
 */
export interface FontOptions {
  /** The color of the text. */
  color: string;

  /** The size of the text font. */
  size: number;
}

/**
 * Options for drawing the clan description, including text and style options.
 */
export interface DrawClanDescriptionOptions extends DrawClanDescriptionBaseOptions, DrawClanDescriptionStyleOptions {
  /** Options for the text to be displayed in the clan description. */
  textOptions: DrawClanDescriptionTextOptions;
}


/**
 * Options for defining a gradient.
 */
export interface GradientOptions {
  /** 
   * The type of gradient.
   * @optional
   * @default "linear"
   */
  type?: "linear" | "radial";

  /** 
   * The color type for drawing.
   * Can be a fill or stroke type, or both.
   * @optional
   */
  colorType?: DrawMethod | DrawOptions.BOTH;

  /** 
   * An array of color stops defining the gradient colors.
   * Each color stop includes a color and its position.
   */
  colors: GradientColorStop[];

  /** 
   * Options for a linear gradient.
   * @optional
   */
  linear?: LinearGradientOptions;

  /** 
   * Options for a radial gradient.
   * @optional
   */
  radial?: RadialGradientOptions;
}

/**
 * Represents a color stop in a gradient, defining the position and color.
 */
export interface GradientColorStop {
  /** The position of the color stop, from 0 to 1. */
  offset: number;
  /** The color at the specified offset. */
  color: string;
}

/**
 * Common properties for gradient options.
 */
export interface BaseGradientOptions {
  /** The starting x-coordinate. */
  x0: number;
  /** The starting y-coordinate. */
  y0: number;
  /** The ending x-coordinate. */
  x1: number;
  /** The ending y-coordinate. */
  y1: number;
}

/**
 * Options for linear gradients.
 */
export interface LinearGradientOptions extends BaseGradientOptions { }

/**
 * Options for radial gradients.
 */
export interface RadialGradientOptions extends BaseGradientOptions {
  /** The starting radius. */
  r0: number;
  /** The ending radius. */
  r1: number;
}


/**
 * Base options for drawing texts, allowing for dynamic adjustments.
 */
export interface DrawTextsBase {
  /** Array of dynamic options for adjusting text drawing. */
  dynamicOptions?: DynamicOptionDrawsText[];
}

/**
 * Options for static text updates, including a range defined by start and end.
 */
export interface StaticOptions {
  /** Partial options for updating the text. */
  update?: Partial<DrawTextOptions>;
  /** Starting index or position for the static text. */
  start?: number;
  /** Ending index or position for the static text. */
  end?: number;
}

/**
 * Options for dynamic text drawing, specifying the range and caching behavior.
 */
export interface DynamicOptions {
  /** Starting index or position for the dynamic text. */
  start?: number;
  /** Ending index or position for the dynamic text. */
  end?: number;
  /** Whether to cache the dynamic text for performance. */
  cache?: boolean;
}

/**
 * Options for updating dynamic drawn text.
 */
export interface UpdateDynamicDrawText {
  /** Partial options for updating the dynamic text. */
  update: Partial<DrawTextOptions>;
}

/**
 * Template positions for different areas in the drawing context.
 */
export interface TemplateType {
  /** Position type for the banner template. */
  banner: TemplatePositionType;
  /** Position type for the full template. */
  full: TemplatePositionType;
  /** Position type for the bottom template. */
  bottom: TemplatePositionType;
}

/**
 * Options for private image drawing.
 */
export interface PrivateDrawImageOptions {
  /** 
   * The type of position for the image, defined by PDImagePosition.
   */
  temType: PDImagePosition;

  /** 
   * The template type for positioning the image.
   */
  templateType: TemplateType;

  /** 
   * Options for applying blur effects to the image.
   */
  blurOptions?: BlurOptions;

  /** 
   * The image to be drawn.
   */
  image: Image;

  /** 
   * The x-coordinate for the image's position.
   */
  dx: number;

  /** 
   * The y-coordinate for the image's position.
   */
  dy: number;

  /** 
   * The width to draw the image.
   */
  dw: number;

  /** 
   * The height to draw the image (optional).
   */
  dh?: number;
}

/**
 * Options for drawing blocks with rounded rectangles.
 */
export interface DrawBlocksOptions extends BaseDrawBlocksOptions, DrawRoundedRectOptions {
  /** 
   * The x-position of the block, defined by XTemplatePosition.
   */
  x_position?: XTemplatePosition;
}

/**
 * Represents a position template with coordinates and dimensions.
 */
export interface TemplatePositionType {
  /** 
   * The x-coordinate of the position.
   */
  x: number;

  /** 
   * The y-coordinate of the position.
   */
  y: number;

  /** 
   * The width of the template position.
   */
  width: number;

  /** 
   * The height of the template position.
   */
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

/**
 * Options for drawing a deputu image.
 */
export interface DrawDeputuOptions {
  /** The x position of the deputu image. */
  x?: number;
  /** The y position of the deputu image. */
  y?: number;
  /** The width of the deputu image. */
  width?: number;
  /** The height of the deputu image. */
  height?: number;
  /** The radius of the deputu image. */
  r?: number;

  /** The x position of the deputu circle. */
  rx?: number;
  /** The y position of the deputu circle. */
  ry?: number;
  /** The radius of the deputu circle. */
  rr?: number;

  /** The x position of the deputu icon. */
  ix?: number;

  /** The x position of the deputu nickname. */
  xt?: number;
  /** The y position of the deputu nickname. */
  yt?: number;

  /** The background color of the deputu image. */
  bgColor?: string;
  /** The border style of the deputu image. */
  borderStyle?: string;
  /** The line width of the deputu image. */
  lineWidth?: number;
  /** The blur amount of the deputu image. */
  blurPx?: number;
  /** The global alpha of the deputu image. */
  globalAlpha?: number;

  /** The deputu information. */
  deputu: ClanDeputuDrawOptions[];

  /** The text options (nickname & role). */
  textOptions?: TextOptionsDeputu;
}

/**
 * Options for the text (nickname and role) of a deputu.
 */
export interface TextOptionsDeputu {
  /** The x position of the nickname. */
  x1?: number;
  /** The x2 position of the nickname or role. */
  x2?: number;
  /** The radius position of the role. */
  x2r?: number;
  /** The y position of the nickname and role. */
  y?: number;
  /** The y radius position of the role. */
  yr?: number;
  /** The text color options. */
  colorOptions?: TextColorOptions;
}

/**
 * Color options for nickname and role text.
 */
export interface TextColorOptions {
  /** The nickname color. */
  nickname?: string;
  /** The role color. */
  role?: string;
}

/**
 * Options for drawing a deputu.
 */
export interface ClanDeputuDrawOptions {
  /** The username of the deputu. */
  username: string;
  /** The avatar of the deputu. */
  avatar: Image;
  /** The role of the deputu. */
  role: string;
}


/**
 * Options for fill and stroke styles.
 * @template T - Type for fill value.
 * @template K - Type for stroke value.
 */
export type FillOrStrokeOption<T = number, K = T> = {
  /** Optional fill color or value. */
  fill?: T;
  /** Optional stroke color or value. */
  stroke?: K;
};

/**
 * Options for border and icon.
 * @template T - Type for border value.
 * @template K - Type for icon value.
 */
export type BorderOrIcon<T = number, K = T> = {
  /** Optional border color or value. */
  border?: T;
  /** Optional icon value. */
  icon?: K;
};

/**
 * Represents a string or gradient options for rendering.
 */
export type StringOrGradient = string | GradientOptions;

/**
 * Template for text with optional drawing options and priority.
 */
export type TemplateText = TextBase & Partial<DrawTextOptions> & PriorityOption;

/**
 * Template for drawing blocks with options and priority.
 */
export type TemplateBlock = BaseDrawBlocksOptions & PriorityOption;

/**
 * Color options for canvas rendering.
 */
export type CanvasColorOptions = string | CanvasGradient | CanvasPattern;

/**
 * Dynamic options for drawing text.
 */
export type DynamicOptionDrawsText = DynamicOptions & UpdateDynamicDrawText;

/**
 * Options for drawing texts with base and static options.
 */
export type DrawTextsOption = DrawTextsBase & StaticOptions;

/**
 * Enumeration for horizontal template position.
 */
export enum XTemplatePosition {
  /** Aligns to the right. */
  RIGHT = "right",
  /** Centers the content. */
  CENTER = "center",
  /** Aligns to the left. */
  LEFT = "left"
};

/**
 * Enumeration for background position.
 */
export enum DrawBGPosition {
  /** Fills the banner area. */
  BANNER = "banner",
  /** Fills the entire area. */
  FULL = "full",
  /** Positions at the bottom. */
  BOTTOM = "bottom"
};

/**
 * Excludes the "full" option from DrawBGPosition.
 */
export type PDImagePosition = Exclude<DrawBGPosition, "full">;

/**
 * Enumeration for background types.
 */
export enum DrawBGEnum {
  /** Rectangle background type. */
  RECT = "rect",
  /** Arc background type. */
  ARC = "arc"
};

/**
 * Enum representing the methods of drawing.
 * - FILL indicates filling shapes with color.
 * - STROKE indicates outlining shapes with color.
 */
export enum DrawMethod {
  FILL = "fill",
  STROKE = "stroke",
}

/**
 * Enum representing the options for drawing modes.
 * - BOTH indicates that both fill and stroke should be applied.
 * - NONE indicates that neither fill nor stroke should be applied.
 */
export enum DrawOptions {
  BOTH = "both",
  NONE = "none",
}

/**
 * Enum representing the type of drawing.
 * - COLOR indicates that the drawing is done using color.
 * - IMAGE indicates that the drawing is done using an image.
 */
enum DrawType {
  COLOR = "color",
  IMAGE = "image",
}

/**
 * Type that allows either string or number.
 */
export type StringNumber = string | number;

/**
 * Enumeration for render types.
 */
export enum RenderType {
  /** PNG format for rendering. */
  PNG = "image/png",
  /** JPEG format for rendering. */
  JPEG = "image/jpeg",
}

/**
 * Options for drawing with background types and color.
 */
export type DrawOption = DrawBGDrawTypeColor | DrawBGTypeFull | DrawBGTypeAllOne;
