import type { CanvasCtx } from "@emilia-tan/types";
import type { AnyWrapAstNode, ContainerNode, LayoutKind } from "../types/ast.js";
import { debugRect, isDebug } from "../utils/debug.js";
import {
  hasSize,
  isEmptyChildren,
  positionNode,
  withCanvasContext,
} from "../utils/renderHelpers.js";
import { renderAst, renderNode } from "./barrel.js";

export function renderContainerNode(node: ContainerNode, ctx: CanvasCtx) {
  return withCanvasContext(ctx, () => {
    if (isEmptyChildren(node)) return;

    const x = node.x ?? 0;
    const y = node.y ?? 0;
    const width = node.width ?? ctx.canvas.width;
    const height = node.height ?? ctx.canvas.height;

    if (isDebug())
      debugRect(ctx, {
        nodeType: node.type,
        box: { x, y, w: width, h: height },
      });

    const padding = node.padding ?? 0;
    ctx.translate(x + padding, y + padding);

    switch (true) {
      case node.layout === "grid" && Boolean(node.gridTemplate): {
        const { columns, rows } = node.gridTemplate ?? { columns: 1, rows: 1 };

        const cellWidth = (width - padding * 2) / columns;
        const cellHeight = (height - padding * 2) / rows;

        node.children.forEach((child, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);

          withCanvasContext(ctx, () => {
            ctx.translate(col * cellWidth, row * cellHeight);

            if (hasSize(child)) {
              child.width ??= cellWidth;
              child.height ??= cellHeight;
            }

            renderNode(child, ctx);
          });
        });

        break;
      }

      case ["row", "column"].some((v) => v === node.layout): {
        positionChildren(node.children, node.layout, padding);
        node.children.forEach((child) => renderNode(child, ctx));

        break;
      }

      default:
        renderAst({ children: node.children, type: "root" }, ctx);
        break;
    }

    function positionChildren(
      children: AnyWrapAstNode[],
      layout: Omit<LayoutKind, "grid">,
      padding: number
    ) {
      let offset = 0;

      for (const child of children) offset = positionNode(child, layout, offset, padding);
    }
  });
}
