import type { CanvasCtx } from "@emilia-tan/types";
import type { LinkNode, TextNode } from "../types/ast.js";
import { debugRect, isDebug } from "../utils/debug.js";
import { isNodeRender } from "../utils/renderHelpers.js";
import { renderNode } from "./renderNode.js";

export function renderLinkNode(node: LinkNode, ctx: CanvasCtx) {
  ctx.save();

  // debug
  if (isDebug())
    debugRect(ctx, {
      nodeType: node.type,
      box: { x: node.x ?? 0, y: node.y ?? 0, w: 0, h: 0 },
    });

  for (const child of node.children) {
    if (isNodeRender<TextNode>(child, "text")) {
      const { x = 0, y = 0, value } = child;

      // force stylize as a link
      ctx.fillStyle = "blue";
      ctx.fillText(value, x, y);

      // measure the width
      const metrics = ctx.measureText(value);

      // coordinates for the line
      const underlineY = y + metrics.actualBoundingBoxAscent + 2;

      ctx.beginPath();
      ctx.moveTo(x, underlineY);
      ctx.lineTo(x + metrics.width, underlineY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.stroke();
    } else renderNode(child, ctx);
  }

  ctx.restore();
}
