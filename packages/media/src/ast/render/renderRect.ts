import type { CanvasCtx } from "@emilia-tan/types";
import type { RectNode } from "../types/ast.js";
import { debugRect, isDebug } from "../utils/debug.js";
import { applyOpacity, applyShadow, withCanvasContext } from "../utils/renderHelpers.js";

/**
 * Renders a rectangle node to a canvas context.
 *
 * @param node - The rect node to render
 * @param ctx - The canvas context to render to
 */
export function renderRectNode(node: RectNode, ctx: CanvasCtx) {
  return withCanvasContext(ctx, () => {
    // position
    const x = node.x ?? 0;
    const y = node.y ?? 0;

    // size
    const w = Math.max(node.width ?? 0, 0);
    const h = Math.max(node.height ?? 0, 0);

    // debug options
    const options = { nodeType: node.type, box: { x, y, w, h } };

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

    if (!node.fillColor && !(node.strokeColor && node.strokeWidth)) {
      console.warn(`RectNode has no fill or stroke: ${node.type}`);

      if (isDebug()) debugRect(ctx, options);

      return;
    }

    // debug
    if (isDebug()) debugRect(ctx, options);
  });
}
