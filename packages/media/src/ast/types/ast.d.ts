import type { CanvasCtx } from "@emilia-tan/types";

/** AST base node*/
export interface WrapAstNode extends Partial<Point> {
  type: WrapAstNodeKind;
  children?: WrapAstNode[];
  parent?: WrapAstNode;
  start?: number;
  end?: number;
}

export type WrapAstNodeKind =
  | "root"
  | "text"
  | "special"
  | "style"
  | "emoji"
  | "link"
  | "image"
  | "rect"
  | "circle"
  | "polygon"
  | "line"
  | "bezier"
  | "container"
  | "error";

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface NodeWithSize {
  width: number;
  height: number;
}

export interface AngleRange {
  start: number;
  end: number;
  anticlockwise?: boolean;
}

export type Validator<
  T,
  K extends PropertyKey = keyof T,
  I extends boolean = false,
> = I extends true
  ? (value: Partial<T> | null, key: K) => boolean
  : (value: Partial<T[keyof T]> | null) => boolean;

export type Box = Point & Size;

export interface WrapAstNodeBase extends Omit<WrapAstNode, keyof Point> {}

export type RequiredPositionNode = WrapAstNodeBase & Point;

export type VisualStyle = OpacityOptions & OutlineStyle & FillStyle & ShadowOptions;

export type LineVisualStyle = Omit<VisualStyle, keyof FillStyle>;

export type Indexable<T, I extends boolean = false> = I extends false
  ? T
  : T & Record<PropertyKey, T>;

type LineNodeBase = WrapAstNodeBase & LineSegment & LineVisualStyle;

type RectDebugKind = "rect" | "container" | "emoji" | "image" | "link";

type DebugShapeKind = "circle" | RectDebugKind;

export type AnyDebugShape =
  | DebugShape<DebugShapeKind>
  | DebugLineShape
  | DebugPolygonShape
  | DebugBezierCurveShape
  | DebugShapeError;

interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface DebugShapeBase<NodeType extends WrapAstNodeKind, BoxType = Box> {
  box: BoxType;
  nodeType: NodeType;
}

export interface DebugShapeError extends DebugShapeBase<"error", Box> {
  message: string;
}

export interface DebugShape<NodeType extends DebugShapeKind> extends DebugShapeBase<NodeType, Box> {
  radius?: number;
  angle?: AngleRange;
}

export interface DebugLineShape extends DebugShapeBase<"line", LineSegment> {}

export interface DebugPolygonShape extends DebugShapeBase<"polygon", Partial<Point>> {
  points: Point[];
}

export interface DebugBezierCurveShape extends DebugShapeBase<"bezier", BezierCurvePoints> {}

/** Node for text (includes spaces) */
export interface TextNode extends WrapAstNode {
  type: "text";
  value: string;
}

/** Node for special characters (for example, \n) */
export interface SpecialNode extends WrapAstNode {
  type: "special";
  value: string;
}

/** Node for stylized text */
export interface StyleNode extends WrapAstNode {
  type: "style";
  style: StyleNodeStyle;
  children: AnyWrapAstNode[];
}

export interface StyleNodeStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  align?: "left" | "center" | "right";
  lineHeight?: number;
  textWrap?: "wrap" | "none";
  maxWidth?: number;
}

interface OpacityOptions {
  opacity?: number;
}

interface OutlineStyle {
  strokeColor?: string;
  strokeWidth?: number;
}

interface FillStyle {
  fillColor?: string;
}

/** Emoji node */
export interface EmojiNode extends WrapAstNode {
  type: "emoji";
  value: string;
  imagePath?: string;
  size?: number;
  font?: string;
}

/** Link node */
export interface LinkNode extends WrapAstNode {
  type: "link";
  href: string;
  children: AnyWrapAstNode[];
}

/** Node for the image */
export interface ImageNode extends WrapAstNode {
  type: "image";
  imagePath: string;
  width?: number;
  height?: number;
  wrapText?: "left" | "right" | "none";
}

/** Node for a rectangle*/
export interface RectNode extends RequiredPositionNode, VisualStyle {
  type: "rect";
  width: number;
  height: number;
}

/** Node for a circle */
export interface CircleNode extends RequiredPositionNode, VisualStyle {
  type: "circle";
  radius: number;
  angle?: AngleRange;
}

/** Node for the line */
export interface LineNode extends LineNodeBase {
  type: "line";
}

/** Node for Polygon */
export interface PolygonNode extends WrapAstNode, FillStyle, OutlineStyle {
  type: "polygon";
  points: Point[]; // Polygon points
}

export interface BezierCurvePoints {
  start: Point;
  control1: Point;
  control2: Point;
  end: Point;
}

/** Node for the Bezier curve*/
export interface BezierCurveNode extends WrapAstNodeBase, VisualStyle {
  type: "bezier";
  points: BezierCurvePoints;
}

export interface GridTemplate {
  columns: number;
  rows: number;
}

/** Container node (for layouts) */
export interface ContainerNode extends WrapAstNode {
  type: "container";
  layout: LayoutKind;
  width?: number;
  height?: number;
  padding?: number;
  gridTemplate?: GridTemplate; // For the grid: number of columns and rows
  children: AnyWrapAstNode[];
}

/** Root node*/
export interface RootNode extends WrapAstNode {
  type: "root";
  children: AnyWrapAstNode[];
}

/** False node*/
export interface ErrorNode extends WrapAstNode {
  type: "error";
  message: string;
}

export interface ShadowOptions {
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface FallbackOptions extends OpacityOptions {
  text: string;
  font?: string;
}

export interface DrawImageOptions extends Point, NodeWithSize {
  imagePath?: string;
  value?: string;
  fallbackOptions: FallbackOptions;
}

export interface WrapText extends Point {
  ctx: CanvasCtx;
  text: string;
  maxWidth: number;
  lineHeight: number;
}

/**Combined type */
export type AnyWrapAstNode =
  | RootNode
  | TextNode
  | SpecialNode
  | StyleNode
  | EmojiNode
  | LinkNode
  | ImageNode
  | RectNode
  | CircleNode
  | LineNode
  | PolygonNode
  | BezierCurveNode
  | ContainerNode
  | ErrorNode;

export type LayoutKind = "row" | "column" | "grid";

/**
 * Checks if an object has all the specified keys.
 * @template T - The type of the object to check.
 * @template K - The type of the keys to check for.
 * @param obj - The object to check.
 * @param keys - The keys to check for.
 * @returns `true` if the object has all the specified keys, `false` otherwise.
 *
 * @example
 * type Result = HasAllKeys<{ a: string; b: number }, "a" | "b">; // Result is true
 */
type HasAllKeys<T, K extends PropertyKey> = [K] extends [keyof T] ? true : false;

/**
 * Checks if an object has all the specified keys.
 * @template T - The type of the object to check.
 * @template K - The type of the keys to check for.
 * @param obj - The object to check.
 * @param keys - The keys to check for.
 * @returns `true` if the object has all the specified keys, `false` otherwise.
 *
 * @example
 * type Result = FilterWithKeys<{ a: string; b: number }, "a" | "b">; // Result is { a: string; b: number }
 */
export type FilterWithKeys<T, K extends PropertyKey> = T extends any
  ? HasAllKeys<T, K> extends true
    ? T
    : never
  : never;

/**
 * Converts a tuple to a union
 *
 * @template T - The type of elements in the tuple.
 * @template N - The desired length (must be a non-negative number).
 * @returns A union of type T | T | ... | T with length N.
 *
 * @example
 * type Result = ToUnion<[1, 2, 3], 3>; // Result is 1 | 2 | 3
 */
export type ToUnion<T extends readonly unknown[]> = T[number];

export type KeysAsArray<T> = Array<keyof T>;

/**
 * Filters an object to only include the specified keys.
 * @template T - The type of the object to filter.
 * @template Keys - The type of the keys to include.
 * @returns A new object with only the specified keys.
 *
 * If you need "a" | "b" - use `FilterWithKeys<T, "a" | "b">`
 *
 *
 * @example
 * type Result = FilterByKeys<{ a: string; b: number }, ["a", "b"]>; // Result is { a: string; b: number }
 */
export type FilterByKeys<T, Keys extends readonly PropertyKey[]> = FilterWithKeys<T, ToUnion<Keys>>;

export type Shape2D = (PropertyKey | Record<PropertyKey, readonly PropertyKey[]>)[];

export type WithKeys<
  T extends object,
  K extends readonly PropertyKey[],
  I extends boolean = false,
> = I extends true ? T & Required<Pick<T, K[number]>> : T;

export type WithKey<
  T extends object,
  K extends PropertyKey,
  I extends boolean = false,
> = I extends true ? T & Required<Pick<T, K>> : T;

export type MatchesShape<T, Shape> = {
  [K in keyof Shape]: K extends keyof T
    ? Shape[K] extends object
      ? T[K] extends object
        ? MatchesShape<T[K], Shape[K]>
        : false
      : true
    : false;
}[keyof Shape] extends false
  ? false
  : true;

export type WithShape<T extends object, Shape> = MatchesShape<T, Shape> extends true ? T : never;

export interface Shape2DGlobals {
  required?: readonly PropertyKey[];
  optional?: readonly PropertyKey[];
}

export interface Shape2DFailure {
  entry: PropertyKey;
  missingRequired: PropertyKey[];
  missingOptional: PropertyKey[];
}

export interface Shape2DCheckResult {
  entry: PropertyKey;
  passed: boolean;
  missingRequired: PropertyKey[];
  missingOptional: PropertyKey[];
}
