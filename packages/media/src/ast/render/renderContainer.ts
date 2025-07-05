import type { CanvasCtx } from "@emilia-tan/types";
import type { ContainerNode } from "../types/ast.js";
import { debugRect, isDebug } from "../utils/debug.js";
import { hasSize } from "../utils/renderHelpers.js";
import { renderAst, renderNode } from "./barrel.js";

export function renderContainerNode(node: ContainerNode, ctx: CanvasCtx) {
  ctx.save();

  const x = node.x ?? 0;
  const y = node.y ?? 0;
  const width = node.width ?? 0;
  const height = node.height ?? 0;

  if (isDebug()) {
    debugRect(ctx, {
      nodeType: node.type,
      box: { x, y, w: width, h: height },
    });
  }

  const padding = node.padding ?? 0;

  // Moving the context to the container + padding position
  ctx.translate(x + padding, y + padding);

  if (node.layout === "grid" && node.gridTemplate) {
    const { columns, rows } = node.gridTemplate;

    // Calculating the width and height of a grid cell
    const cellWidth = (width - padding * 2) / columns;
    const cellHeight = (height - padding * 2) / rows;

    node.children.forEach((child, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);

      ctx.save();
      // Positioning the context on a grid cell
      ctx.translate(col * cellWidth, row * cellHeight);

      if (hasSize(child)) {
        if (child.width === undefined) child.width = cellWidth;
        if (child.height === undefined) child.height = cellHeight;
      }

      renderNode(child, ctx);

      ctx.restore();
    });

    // If layout is not grid, just render the children with the current shift
  } else renderAst({ children: node.children, type: "root" }, ctx);

  ctx.restore();
}
