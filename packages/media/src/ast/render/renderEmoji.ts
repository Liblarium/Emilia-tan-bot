import type { CanvasCtx } from "@emilia-tan/types";
import type { EmojiNode } from "../types/ast.js";
import { debugRect, isDebug } from "../utils/debug.js";
import { drawImageOrFallbackText, withCanvasContext } from "../utils/renderHelpers.js";

export async function renderEmojiNode(node: EmojiNode, ctx: CanvasCtx) {
  return withCanvasContext(ctx, async () => {
    const x = node.x ?? 0;
    const y = node.y ?? 0;
    const size = node.size ?? 24; // standard emoji size

    ctx.textBaseline = "top";
    ctx.font = `${size}px ${node.font ?? "serif"}`;

    if (!node.value && !node.imagePath) {
      console.warn(`EmojiNode has no value or imagePath: ${node.type}`);

      ctx.restore();

      return;
    }

    await drawImageOrFallbackText(ctx, {
      x,
      y,
      width: size,
      height: size,
      imagePath: node.imagePath,
      value: node.value,
      fallbackOptions: {
        text: "[emoji missing]",
        opacity: 0.5,
        font: ctx.font,
      },
    });

    if (isDebug())
      debugRect(ctx, {
        nodeType: node.type,
        box: { x, y, w: size, h: size },
      });
  });
}
