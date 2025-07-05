import type { CanvasCtx } from "@emilia-tan/types";
import type { StyleNode } from "../types/ast.js";
import { renderAst } from "./renderAst.js";

export function renderStyleNode(node: StyleNode, ctx: CanvasCtx) {
  ctx.save();

  const { /*bold, italic, underline, fontSize, fontFamily,*/ color, align, lineHeight } =
    node.style;
  // TODO: Release StyleNode (font)
  /*let font = "";

  if (fontSize && fontSize > 0 && fontFamily && fontFamily.trim() !== "")
    font = `${fontSize}px ${fontFamily}`;

  if (bold) ctx.font = `${fontSize}px bold ${fontFamily}`.trimEnd();
  if (italic) ctx.font = `${fontSize}px italic ${fontFamily}`.trimEnd();
  if (underline) ctx.font = `${fontSize}px underline ${fontFamily}`.trimEnd();
  if (fontSize) ctx.font = `${fontSize}px ${fontFamily}`.trimEnd();*/

  if (color) ctx.fillStyle = color;
  if (align) ctx.textAlign = align;
  if (lineHeight) ctx.lineWidth = lineHeight;

  renderAst({ children: node.children, type: "root" }, ctx);

  ctx.restore();
}
