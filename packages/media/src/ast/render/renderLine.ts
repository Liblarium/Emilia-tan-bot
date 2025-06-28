import type { CanvasCtx } from "@emilia-tan/types";
import type { LineNode } from "../types/ast.js";
import { debugLine, isDebug } from "../utils/debug.js";

export function renderLineNode(node: LineNode, ctx: CanvasCtx) {
  ctx.save();
  const { x1, y1, x2, y2 } = node;

  if (node.strokeColor) ctx.strokeStyle = node.strokeColor;
  if (node.strokeWidth) ctx.lineWidth = node.strokeWidth;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // debug
  if (isDebug()) debugLine(ctx, { nodeType: node.type, box: { x1, y1, x2, y2 } });

  ctx.restore();
}
