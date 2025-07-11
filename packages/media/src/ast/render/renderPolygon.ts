import type { CanvasCtx } from "@emilia-tan/types";
import type { PolygonNode } from "../types/ast.js";
import { debugPolygon, isDebug } from "../utils/debug.js";
import { hasPosition, withCanvasContext } from "../utils/renderHelpers.js";

export function renderPolygonNode(node: PolygonNode, ctx: CanvasCtx) {
  return withCanvasContext(ctx, () => {
    const nodePoint = hasPosition<PolygonNode>(node) && node.type === "polygon";

    if ((node.points.length < 2 && nodePoint) || (node.points.length < 3 && !nodePoint)) {
      throw new TypeError(
        `Polygon must have at least ${nodePoint ? 2 : 3} points. You passed ${node.points.length}. Min 2 points if your x, y is set. On another hand - min 3, and first point in points use as start.`
      );
    }

    const x = (nodePoint ? node.x : node.points[0].x) ?? 0;
    const y = (nodePoint ? node.y : node.points[0].y) ?? 0;
    const points = nodePoint ? node.points : node.points.slice(1);

    // Checking points
    points.forEach((p, i) => {
      if (p.x === undefined || p.y === undefined) {
        throw new TypeError(`Point ${i} in PolygonNode is invalid: ${JSON.stringify(p)}`);
      }
    });

    ctx.beginPath();
    ctx.moveTo(x, y);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();

    if (node.fillColor) {
      ctx.fillStyle = node.fillColor;
      ctx.fill();
    }

    if (node.strokeColor && node.strokeWidth) {
      ctx.strokeStyle = node.strokeColor;
      ctx.lineWidth = node.strokeWidth;
      ctx.stroke();
    }

    if (isDebug()) debugPolygon(ctx, { nodeType: node.type, points, box: { x, y } });
  });
}
