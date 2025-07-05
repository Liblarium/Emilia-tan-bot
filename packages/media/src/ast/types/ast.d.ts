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

export type Box = Point & Size;

export interface WrapAstNodeBase extends Omit<WrapAstNode, keyof Point> {}

export type RequiredPositionNode = WrapAstNodeBase & Point;

export type VisualStyle = OpacityOptions & OutlineStyle & FillStyle & ShadowOptions;

export type LineVisualStyle = Omit<VisualStyle, keyof FillStyle>;

type LineNodeBase = WrapAstNodeBase & LineSegment & LineVisualStyle;

type RectDebugKind = "rect" | "container" | "emoji" | "image" | "link";

export type AnyDebugShape = 
  | DebugShape<"circle" | RectDebugKind>
  | DebugLineShape
  | DebugPolygonShape
  | DebugBezierCurveShape;

interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface DebugShapeBase<BoxType = Box, NodeType extends WrapAstNodeKind> {
  box: BoxType;
  nodeType: NodeType;
}

export interface DebugShape<NodeType extends "circle" | RectDebugKind> extends DebugShapeBase<Box, NodeType> {
  radius?: number;
  angle?: AngleRange;
}

export interface DebugLineShape extends DebugShapeBase<LineSegment, "line"> {}

export interface DebugPolygonShape extends DebugShapeBase<Partial<Point>, "polygon"> {
  points: Point[];
}

export interface DebugBezierCurveShape extends DebugShapeBase<BezierCurvePoints, "bezier"> {}

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
  layout: "row" | "column" | "grid";
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
