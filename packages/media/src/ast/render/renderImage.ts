import type { CanvasCtx } from "@emilia-tan/types";
import type { ImageNode } from "../types/ast.js";
import { debugRect, isDebug } from "../utils/debug.js";
import { drawImageOrFallbackText, withCanvasContext } from "../utils/renderHelpers.js";

export async function renderImageNode(node: ImageNode, ctx: CanvasCtx) {
  return withCanvasContext(ctx, async () => {
    const { x = 0, y = 0, width = 25, height = 25 } = node;

    await drawImageOrFallbackText(ctx, {
      x,
      y,
      width,
      height,
      imagePath: node.imagePath,
      fallbackOptions: {
        text: "[image missing]",
        opacity: 0.5,
        font: ctx.font,
      },
    });

    if (isDebug())
      debugRect(ctx, {
        nodeType: node.type,
        box: { x, y, w: width, h: height },
      });
  });
}
