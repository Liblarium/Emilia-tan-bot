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

/**
 * Applies the given opacity to the canvas context.
 *
 * @remarks
 * If the `alpha` parameter is not provided, no changes are made to the context's opacity.
 *
 * @param ctx - The canvas context to apply the opacity to.
 * @param alpha - The opacity to apply, if provided.
 */
export function applyOpacity(ctx: CanvasCtx, alpha?: number) {
  if (alpha !== undefined) ctx.globalAlpha = alpha;
}

/**
 * Draws an image or renders a fallback text on the canvas context depending on the given DrawImageOptions.
 *
 * If the `imagePath` is provided, it will be rendered on the canvas context.
 *
 * If the `imagePath` is not provided but the `value` is, it will be rendered as a text on the canvas context.
 *
 * If both `imagePath` and `value` are not provided, a fallback text will be rendered on the canvas context.
 *
 * @param ctx - The canvas context to draw the image or render the fallback text on.
 * @param node - The DrawImageOptions to draw the image or render the fallback text with.
 * @returns A promise that resolves when the image has been drawn or the fallback text has been rendered.
 */
export async function drawImageOrFallbackText(ctx: CanvasCtx, node: DrawImageOptions) {
  try {
    const { imagePath, value, x, y, width, height } = node;

    switch (true) {
      // render emoji (ASCII)
      case !imagePath && value !== undefined:
        ctx.fillText(value, x, y);
        break;

      // render image/emoji from path on browser (html canvas)
      case isHTML2DCanvas(ctx) && imagePath !== undefined:
        {
          const image = new Image();
          await new Promise((resolve) => {
            image.onload = () => {
              ctx.drawImage(image, x, y, width, height);

              resolve(null);
            };

            image.onerror = () => {
              renderFallback();
              resolve(null);
            };

            image.src = imagePath;
          });
        }
        break;

      // render image/emoji on @napi-rs/canvas
      case !isHTML2DCanvas(ctx) && imagePath !== undefined:
        {
          const img = await loadImage(imagePath);

          ctx.drawImage(img, x, y, width, height);
        }
        break;

      // if imagePath and value are both undefined, render fallback
      default:
        renderFallback();
    }
  } catch (err) {
    console.warn(`drawImageOrFallbackText failed for ${node.imagePath}`, err);
    renderFallback();
  }

  /**
   * Renders a fallback text on the canvas context if the given node image could not be rendered.
   * @param node The node with the fallback options.
   */
  function renderFallback() {
    ctx.save();
    const { opacity, font, text } = node.fallbackOptions;

    if (opacity !== undefined) ctx.globalAlpha = opacity;
    if (font !== undefined) ctx.font = font;

    ctx.fillText(text, node.x, node.y);
    ctx.restore();
  }
}

/**
 * Checks if given canvas is a HTML Canvas 2D rendering context.
 * @param canvas The canvas to check.
 * @returns True if the canvas is a HTML Canvas 2D rendering context, false otherwise.
 */
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
