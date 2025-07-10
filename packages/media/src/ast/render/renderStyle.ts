import type { CanvasCtx } from "@emilia-tan/types";
import type { StyleNode } from "../types/ast.js";
import { isEmptyChildren, withCanvasContext } from "../utils/renderHelpers.js";
import { renderNode } from "./renderNode.js";

export function renderStyleNode(node: StyleNode, ctx: CanvasCtx) {
  return withCanvasContext(ctx, () => {
    if (isEmptyChildren(node)) return;

    const { bold, italic, underline, fontSize, fontFamily, color, align } = node.style;

    // Creating a font
    const fontParts: string[] = [];

    if (italic) fontParts.push("italic");
    if (bold) fontParts.push("bold");
    if (fontSize && fontFamily) {
      fontParts.push(`${fontSize}px`);
      fontParts.push(`"${fontFamily}"`);
    }

    const font = fontParts.join(" ") || "16px sans-serif"; // Fallback font
    ctx.font = font;

    if (color) ctx.fillStyle = color;
    if (align) ctx.textAlign = align;

    // Rendering children
    for (const child of node.children) {
      if (child.type === "text") {
        const text = child.value;
        const metrics = ctx.measureText(text);
        const x = child.x || 0;
        const y = child.y || 0;

        // Processing textWrap and maxWidth // FIXME: SOLID Angry
        // if (textWrap === "wrap" && maxWidth)
        //   wrapText({ ctx, x, y, text: child.value, maxWidth, lineHeight: fontSize ?? 0 });

        ctx.fillText(text, x, y);

        // Underscores (similar to renderFontMatrixHorizontal)
        if (underline) {
          ctx.beginPath();
          ctx.moveTo(x, y + 2); // baseline + offset
          ctx.lineTo(x + metrics.width, y + 2);
          ctx.strokeStyle = color || "black";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      } else {
        renderNode(child, ctx); // We will render other nodes via renderNode
      }
    }
  });
}
