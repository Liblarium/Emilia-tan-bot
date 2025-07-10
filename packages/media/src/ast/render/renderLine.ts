import type { CanvasCtx } from "@emilia-tan/types";
import type { LineNode } from "../types/ast.js";
import { debugLine, isDebug } from "../utils/debug.js";
import { withCanvasContext } from "../utils/renderHelpers.js";

export function renderLineNode(node: LineNode, ctx: CanvasCtx) {
  return withCanvasContext(ctx, () => {
    const { x1, y1, x2, y2 } = node;

    if (x1 === x2 && y1 === y2) {
      console.warn(`LineNode has zero length: ${node.type}`);
      ctx.restore();

      return;
    }

    if (node.strokeColor) ctx.strokeStyle = node.strokeColor;
    if (node.strokeWidth) ctx.lineWidth = node.strokeWidth;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // debug
    if (isDebug()) debugLine(ctx, { nodeType: node.type, box: { x1, y1, x2, y2 } });
  });
}
