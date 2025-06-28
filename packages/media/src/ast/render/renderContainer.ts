import type { CanvasCtx } from "@emilia-tan/types";
import type { ContainerNode } from "../types/ast.js";
import { debugRect, isDebug } from "../utils/debug.js";
import { hasSize } from "../utils/renderHelpers.js";
import { renderNode } from "./renderNode.js";

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

  // Зрушуємо контекст на позицію контейнера + паддінг
  ctx.translate(x + padding, y + padding);

  if (node.layout === "grid" && node.gridTemplate) {
    const { columns, rows } = node.gridTemplate;

    // Обчислюємо ширину та висоту клітинки сітки
    const cellWidth = (width - padding * 2) / columns;
    const cellHeight = (height - padding * 2) / rows;

    node.children.forEach((child, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);

      ctx.save();
      // Позиціонуємо контекст на клітинку сітки
      ctx.translate(col * cellWidth, row * cellHeight);

      if (hasSize(child)) {
        if (child.width === undefined) child.width = cellWidth;
        if (child.height === undefined) child.height = cellHeight;
      }

      renderNode(child, ctx);

      ctx.restore();
    });
  } else {
    // Якщо layout не grid — просто рендеримо дітей з поточним зсувом
    for (const child of node.children) {
      renderNode(child, ctx);
    }
  }

  ctx.restore();
}
