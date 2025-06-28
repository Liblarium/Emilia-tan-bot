import type { CanvasCtx } from "@emilia-tan/types";
import type { RectNode } from "../types/ast.js";
import { debugRect, isDebug } from "../utils/debug.js";
import { applyOpacity, applyShadow } from "../utils/renderHelpers.js";

/**
 * Renders a rectangle node to a canvas context.
 *
 * @param node - The rect node to render
 * @param ctx - The canvas context to render to
 */
export function renderRectNode(node: RectNode, ctx: CanvasCtx) {
  ctx.save();

  // position
  const x = node.x ?? 0;
  const y = node.y ?? 0;

  // size
  const w = node.width ?? 0;
  const h = node.height ?? 0;

  // opacity and shadow
  applyOpacity(ctx, node.opacity);
  applyShadow(ctx, node);

  // color
  if (node.fillColor) {
    ctx.fillStyle = node.fillColor;
    ctx.fillRect(x, y, w, h);
  }

  // outline
  if (node.strokeColor && node.strokeWidth) {
    ctx.strokeStyle = node.strokeColor;
    ctx.lineWidth = node.strokeWidth;
    ctx.strokeRect(x, y, w, h);
  }

  // debug
  if (isDebug()) debugRect(ctx, { nodeType: node.type, box: { x, y, w, h } });

  ctx.restore();
}
