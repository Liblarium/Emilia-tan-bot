import type { CanvasCtx } from "@emilia-tan/types";
import { loadImage } from "@napi-rs/canvas";
import type {
  AnyWrapAstNode,
  DrawImageOptions,
  NodeWithSize,
  ShadowOptions,
  WrapAstNodeKind,
} from "../types/ast.js";

export function applyShadow(ctx: CanvasCtx, options: AnyWrapAstNode | ShadowOptions) {
  if (!hasShadowOptions(options)) return;

  if (options.shadowColor !== undefined) ctx.shadowColor = options.shadowColor;
  if (options.shadowBlur !== undefined) ctx.shadowBlur = options.shadowBlur;
  if (options.shadowOffsetX !== undefined) ctx.shadowOffsetX = options.shadowOffsetX;
  if (options.shadowOffsetY !== undefined) ctx.shadowOffsetY = options.shadowOffsetY;
}

function hasShadowOptions(obj: unknown): obj is ShadowOptions {
  return (
    typeof obj === "object" &&
    obj !== null &&
    ("shadowColor" in obj ||
      "shadowBlur" in obj ||
      "shadowOffsetX" in obj ||
      "shadowOffsetY" in obj)
  );
}

export function applyOpacity(ctx: CanvasCtx, alpha?: number) {
  if (alpha !== undefined) ctx.globalAlpha = alpha;
}

export async function drawImageOrFallbackText(ctx: CanvasCtx, node: DrawImageOptions) {
  try {
    if (isHTML2DCanvas(ctx) && node.imagePath) {
      const image = new Image();
      image.src = node.imagePath;

      await new Promise((resolve) => {
        image.onload = () => {
          ctx.drawImage(image, node.x, node.y, node.width, node.height);

          resolve(null);
        };

        image.onerror = () => {
          renderFallback();
          resolve(null);
        };
      });
    } else if (!isHTML2DCanvas(ctx) && node.imagePath) {
      const img = await loadImage(node.imagePath);

      ctx.drawImage(img, node.x, node.y, node.width, node.height);
    } else renderFallback();
  } catch (err) {
    console.warn(`drawImageOrFallbackText failed for ${node.imagePath}`, err);
    renderFallback();
  }

  function renderFallback() {
    ctx.save();
    const { opacity, font, text } = node.fallbackOptions;

    if (opacity !== undefined) ctx.globalAlpha = opacity;
    if (font !== undefined) ctx.font = font;

    ctx.fillText(text, node.x, node.y);
    ctx.restore();
  }
}

function isHTML2DCanvas(canvas: unknown): canvas is CanvasRenderingContext2D {
  return (
    typeof CanvasRenderingContext2D !== "undefined" && canvas instanceof CanvasRenderingContext2D
  );
}

/**
 * Checks if given node is of type `nodeType` and casts it to `T` if true.
 * @template T The type of node to check.
 * @param node The node to check.
 * @param nodeType The type of node to check against.
 * @returns `true` if the node is of type `nodeType` (and casts it to `T`), `false` otherwise.
 */
export function isNodeRender<T extends AnyWrapAstNode>(
  node: AnyWrapAstNode,
  nodeType: WrapAstNodeKind
): node is T {
  return node.type === nodeType;
}

export function hasSize(node: unknown): node is NodeWithSize {
  return typeof node === "object" && node !== null && "width" in node && "height" in node;
}
