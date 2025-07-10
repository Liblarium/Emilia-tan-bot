import type { CanvasCtx } from "@emilia-tan/types";
import type { CircleNode, KeysAsArray, Point } from "../types/ast.js";
import { debugCircle, isDebug } from "../utils/debug.js";
import { applyOpacity, applyShadow, hasKeys, withCanvasContext } from "../utils/renderHelpers.js";
export function renderCircleNode(node: CircleNode, ctx: CanvasCtx) {
  return withCanvasContext(ctx, () => {
    if (node.radius <= 0) return console.warn(`CircleNode has invalid radius: ${node.radius}`);

    if (!hasKeys<CircleNode, KeysAsArray<Point>>(node, ["x", "y"]))
      console.warn(`CircleNode has invalid position: "circle"`);

    // position
    const x = node.x ?? 0;
    const y = node.y ?? 0;

    // angle
    const start = node.angle?.start ?? 0;
    const end = node.angle?.end ?? Math.PI * 2;
    const counterclockwise = node.angle?.anticlockwise ?? false;

    // opacity and shadow
    applyOpacity(ctx, node.opacity);
    applyShadow(ctx, node);

    // color
    if (node.fillColor) ctx.fillStyle = node.fillColor;

    // outline
    if (node.strokeColor && node.strokeWidth) {
      ctx.strokeStyle = node.strokeColor;
      ctx.lineWidth = node.strokeWidth;
    }

    ctx.beginPath();
    ctx.arc(x, y, node.radius, start, end, counterclockwise);

    if (node.fillColor) ctx.fill();
    if (node.strokeColor && node.strokeWidth) ctx.stroke();

    // debug
    if (isDebug())
      debugCircle(ctx, {
        nodeType: node.type,
        radius: node.radius,
        angle: { start, end, anticlockwise: counterclockwise },
        box: { x, y, w: node.radius * 2, h: node.radius * 2 },
      });
  });
}
