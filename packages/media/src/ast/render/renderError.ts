import type { CanvasCtx } from "@emilia-tan/types";
import type { ErrorNode } from "../types/ast.js";

export function renderErrorNode(node: ErrorNode, ctx: CanvasCtx) {
  ctx.save();

  const x = node.x ?? 0;
  const y = node.y ?? 0;
  const w = 200;
  const h = 50;

  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = "red";
  ctx.font = "14px monospace";
  ctx.fillText(`Error: ${node.message}`, x + 5, y + 20);

  ctx.restore();
}
