import type { CanvasCtx } from "@emilia-tan/types";
import type { BezierCurveNode } from "../types/ast.js";
import { debugBezierCurve, isDebug } from "../utils/debug.js";
import {
  applyOpacity,
  applyShadow,
  hasShape2D,
  withCanvasContext,
} from "../utils/renderHelpers.js";

export function renderBezierCurveNode(node: BezierCurveNode, ctx: CanvasCtx) {
  return withCanvasContext(ctx, () => {
    const { points, strokeColor, strokeWidth, fillColor, opacity } = node;

    if (hasShape2D(points, ["start", "control1", "control2", "end"], { required: ["x", "y"] }))
      return console.warn(`BezierCurveNode has invalid points: ${node.type}`);

    const { start, control1, control2, end } = points;

    if (strokeColor) ctx.strokeStyle = strokeColor;
    if (strokeWidth) ctx.lineWidth = strokeWidth;
    if (fillColor) ctx.fillStyle = fillColor;

    applyOpacity(ctx, opacity);
    applyShadow(ctx, node);

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, end.x, end.y);

    if (fillColor) ctx.fill();
    if (strokeColor && strokeWidth) ctx.stroke();

    // debug
    if (isDebug()) debugBezierCurve(ctx, { nodeType: node.type, box: points });
  });
}
