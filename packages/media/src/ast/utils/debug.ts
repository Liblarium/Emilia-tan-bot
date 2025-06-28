import type { CanvasCtx } from "@emilia-tan/types";
import type {
  AnyDebugShape,
  DebugBezierCurveShape,
  DebugLineShape,
  DebugPolygonShape,
  DebugShape,
  RectDebugKind,
  WrapAstNodeKind,
} from "../types/ast.js";

export function debugRect(ctx: CanvasCtx, options: DebugShape<RectDebugKind>) {
  const { x, y, w, h } = options.box;

  ctx.save();
  debugRender(ctx);
  ctx.strokeRect(x, y, w, h);
  ctx.restore();

  debugLog(options);
}

function debugRender(ctx: CanvasCtx) {
  ctx.strokeStyle = "magenta";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 2]);
}

export function debugLine(ctx: CanvasCtx, options: DebugLineShape) {
  const { x1, y1, x2, y2 } = options.box;

  ctx.save();
  debugRender(ctx);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();

  debugLog(options);
}

export function debugCircle(ctx: CanvasCtx, options: DebugShape<"circle">) {
  const { x, y, w, h } = options.box;
  const { start = 0, end = Math.PI * 2 } = options.angle ?? {};
  const anticlockwise = options.angle?.anticlockwise ?? false;

  ctx.save();
  debugRender(ctx);
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, start, end, anticlockwise);
  ctx.stroke();
  ctx.restore();

  debugLog(options);
}

export function debugPolygon(ctx: CanvasCtx, options: DebugPolygonShape) {
  const { x, y } = options.box;
  let { points } = options;
  let x0 = x ?? 0;
  let y0 = y ?? 0;

  if (x === undefined && y === undefined) {
    x0 = points[0].x;
    y0 = points[0].y;
    points = points.slice(1);
  }

  ctx.save();
  debugRender(ctx);
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  points.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  debugLog(options);
}

/**
 * Checks if the current environment is in development mode.
 *
 * @returns {boolean} Whether the current environment is in development mode.
 */
export function isDebug(): boolean {
  const env = process.env.NODE_ENV ?? "production";

  return env === "development";
}

export function debugBezierCurve(ctx: CanvasCtx, options: DebugBezierCurveShape) {
  const { start, control1, control2, end } = options.box;

  ctx.save();
  debugRender(ctx);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, end.x, end.y);
  ctx.stroke();
  ctx.restore();

  debugLog(options);
}

function debugLog(options: AnyDebugShape) {
  let text = `[debug][${options.nodeType}]: Box: ${JSON.stringify(options.box)}`;

  switch (options.nodeType) {
    case "circle":
      {
        if (!isDebugShape<DebugShape<"circle">>(options, "circle")) return;

        text += ` Radius: ${JSON.stringify(options.radius)}, Angle: ${JSON.stringify(options.angle)}`;
      }
      break;
    case "polygon":
      {
        if (!isDebugShape<DebugPolygonShape>(options, "circle")) return;

        text += ` Points: ${JSON.stringify(options.points)}`;
      }
      break;
    case "bezier":
      {
        if (!isDebugShape<DebugBezierCurveShape>(options, "bezier")) return;

        text += ` Controls: ${JSON.stringify({
          control1: options.box.control1,
          control2: options.box.control2,
        })}`;
      }
      break;
    default:
      break;
  }

  console.info(text);
}

/**
 * Checks if a given debug shape is of a certain type and returns a type predicate.
 *
 * @param shape The debug shape to check.
 * @param nodeType The type of debug shape to check against.
 *
 * @returns A type predicate that asserts `shape` is of type `T` if it is of type `nodeType`.
 */
function isDebugShape<T extends AnyDebugShape>(
  shape: AnyDebugShape,
  nodeType: WrapAstNodeKind
): shape is T {
  return shape.nodeType === nodeType;
}
