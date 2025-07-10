import type { CanvasCtx } from "@emilia-tan/types";
import { loadImage } from "@napi-rs/canvas";
import type {
  AnyWrapAstNode,
  DrawImageOptions,
  FilterByKeys,
  Indexable,
  KeysAsArray,
  LayoutKind,
  LineNode,
  LineSegment,
  NodeWithSize,
  Point,
  ShadowOptions,
  Shape2D,
  Shape2DCheckResult,
  Shape2DFailure,
  Shape2DGlobals,
  Size,
  ToUnion,
  Validator,
  WithKeys,
  WrapAstNodeKind,
} from "../types/ast.js";

/**
 * Applies shadow options to canvas context.
 *
 * @param ctx - The canvas context to update.
 * @param options - The shadow options to apply.
 * If `options` is an object with shape { shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY },
 * it will be used to set the shadow properties on the `ctx`. Otherwise, it will be ignored.
 */
export function applyShadow(ctx: CanvasCtx, options: AnyWrapAstNode | ShadowOptions) {
  if (!hasShadowOptions(options)) return;

  if (options.shadowColor !== undefined) ctx.shadowColor = options.shadowColor;
  if (options.shadowBlur !== undefined) ctx.shadowBlur = options.shadowBlur;
  if (options.shadowOffsetX !== undefined) ctx.shadowOffsetX = options.shadowOffsetX;
  if (options.shadowOffsetY !== undefined) ctx.shadowOffsetY = options.shadowOffsetY;
}

/**
 * Checks if the given object has all the properties of `ShadowOptions`.
 *
 * @param obj - The object to check.
 * @returns `true` if the object has all the properties of `ShadowOptions`, `false` otherwise.
 */
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

/**
 * Checks if the given node has the properties "width" and "height" or "w" and "h".
 * @param node The node to check.
 * @param validation If true, also checks if the values of "width" and "height" (or "w" and "h") are numbers.
 * @returns `true` if the node has the specified properties (and casts it to `FilterByKeys<T, KeysAsArray<NodeWithSize>>` or `FilterByKeys<T, KeysAsArray<Size>>`), `false` otherwise.
 */
export function hasSize<T extends AnyWrapAstNode>(
  node: T,
  validation?: boolean
): node is FilterByKeys<T, KeysAsArray<NodeWithSize>> | FilterByKeys<T, KeysAsArray<Size>> {
  const validator = validation
    ? (value: Partial<T> | null) => typeof value === "number"
    : () => true;

  if (hasKeys<T, KeysAsArray<NodeWithSize & Size>>(node, ["width", "height", "w", "h"], validator))
    throw new TypeError(
      "[hasSize]: The node already has the properties 'width', 'height', 'w' and 'h'"
    );

  const sizeKeyVariants: Readonly<KeysAsArray<NodeWithSize> | KeysAsArray<Size>>[] = [
    ["width", "height"],
    ["w", "h"],
  ];

  return sizeKeyVariants.some((keys) =>
    hasKeys<T, Readonly<KeysAsArray<NodeWithSize> | KeysAsArray<Size>>>(node, keys, validator)
  );
}

/**
 * Checks if the given node has the properties "x" and "y".
 * If `validation` is true, also checks if the values of "x" and "y" are numbers.
 * @param node The node to check.
 * @param validation If true, performs additional number validation on the "x" and "y" properties.
 * @returns `true` if the node has the specified properties (and casts it to `T`), `false` otherwise.
 */
export function hasPosition<T extends AnyWrapAstNode>(
  node: T,
  validation?: boolean
): node is FilterByKeys<T, KeysAsArray<Point>> {
  return hasKeys<T, KeysAsArray<Point>>(
    node,
    ["x", "y"],
    validation ? (x) => typeof x === "number" : () => true
  );
}

/**
 * Checks if the given object has the specified key.
 * @param obj The object to check.
 * @param key The key to check for.
 * @template T The type of the object to check.
 * @template I If true, the object is required to be an indexable object.
 * @returns `true` if the object has the key, `false` otherwise.
 */
export function hasKey<T extends object, I extends boolean = false>(
  obj: T,
  key: string
): obj is Indexable<T, I> {
  return isIndexable<T>(obj) && key in obj;
}

/**
 * Checks if the given object has all the specified keys.
 * If a key is not present, immediately returns `false`.
 * If a validator is provided, it checks the value of each key.
 * If the validator returns `false`, immediately returns `false`.
 * If the validator returns `true`, returns `true` after checking all keys.
 * @param obj The object to check.
 * @param keys The keys to check for.
 * @param validator A validator function that takes the value and key as arguments.
 * @template T The type of the object to check.
 * @template K The type of the keys to check for.
 * @template I If true, the object is required to be an indexable object. `false` by default.
 * @returns `true` if the object has all the specified keys, `false` otherwise.
 */
export function hasKeys<
  T extends object,
  K extends readonly PropertyKey[],
  I extends boolean = false,
>(obj: T, keys: K, validator?: Validator<T, ToUnion<K>, true>): obj is WithKeys<T, K, I> {
  return keys.every((key) => {
    const value = isIndexable(obj) ? obj[key] : undefined;

    return value !== undefined && (validator ? validator(value, key) : true);
  });
}

/**
 * Checks if the given value is an object that can be indexed by a key.
 * This function is equivalent to `typeof obj === "object" && obj !== null`.
 * @param obj The value to check.
 * @returns `true` if the value is an object that can be indexed by a key, `false` otherwise.
 */
export function isIndexable<T>(obj: unknown): obj is Record<PropertyKey, T> {
  return typeof obj === "object" && obj !== null;
}

/**
 * Checks if a node has no children.
 * If the node has no children, it warns the user by logging a message to the console.
 * @param node The node to check.
 * @returns `true` if the node has no children, `false` otherwise.
 */
export function isEmptyChildren(node: {
  children?: AnyWrapAstNode[];
  type: WrapAstNodeKind;
}): boolean {
  if (!node.children?.length) {
    console.warn(`Node has no children: ${node.type || "unknown"}`);

    return true;
  }

  return false;
}

/**
 * Calls the given function with the given canvas context, saving and restoring it.
 * This is a convenience function that ensures that the canvas context is restored
 * even if the given function throws an error.
 *
 * @param ctx The canvas context to save and restore.
 * @param fn The function to call with the canvas context.
 * @returns The result of calling the given function.
 */
export function withCanvasContext<T>(ctx: CanvasCtx, fn: () => T): T {
  ctx.save();
  try {
    return fn();
  } finally {
    ctx.restore();
  }
}

function checkShape2D(
  obj: unknown,
  shape: Shape2D,
  globals?: Shape2DGlobals
): Shape2DCheckResult[] {
  const results: Shape2DCheckResult[] = [];

  if (!isIndexable(obj))
    return [
      { entry: "root", passed: false, missingRequired: ["<not indexable>"], missingOptional: [] },
    ];

  if (Array.isArray(shape) && shape.length === 0)
    return [{ entry: "root", passed: true, missingRequired: [], missingOptional: [] }];

  for (const entry of shape) {
    let target: unknown;
    let entryKey: PropertyKey;

    if (typeof entry !== "object" || entry === null) {
      entryKey = entry;
      target = obj[entry];
    } else {
      const [outerKey, innerKeys] = Object.entries(entry)[0];
      const inner: object = obj[outerKey] ?? {};
      entryKey = outerKey;

      const missingInner = innerKeys.filter((k) => !(k in inner));

      if (missingInner.length > 0) {
        results.push({
          entry: outerKey,
          passed: false,
          missingRequired: missingInner,
          missingOptional: [],
        });

        continue;
      }

      target = inner;
    }

    if (!isIndexable(target)) {
      results.push({
        entry: entryKey,
        passed: false,
        missingRequired: ["<not indexable>"],
        missingOptional: [],
      });

      continue;
    }

    let missingRequired: PropertyKey[] = [];
    let missingOptional: PropertyKey[] = [];

    if (globals) {
      const [required, optional] = (["required", "optional"] as const).map((key) =>
        asArray<PropertyKey>(globals[key] ?? [])
      );

      missingRequired = required.filter((k) => !(k in target));
      missingOptional = optional.filter((k) => !(k in target));
    }

    results.push({
      entry: entryKey,
      passed: missingRequired.length === 0,
      missingRequired,
      missingOptional,
    });
  }

  return results;
}

export function hasShape2D(obj: unknown, shape: Shape2D, globals?: Shape2DGlobals): boolean {
  return checkShape2D(obj, shape, globals).every((r) => r.passed);
}

export function describeShapeFailure(
  obj: unknown,
  shape: Shape2D,
  globals?: Shape2DGlobals
): Shape2DFailure[] {
  return checkShape2D(obj, shape, globals)
    .filter((r) => !r.passed || r.missingOptional.length > 0)
    .map(({ entry, missingRequired, missingOptional }) => ({
      entry,
      missingRequired,
      missingOptional,
    }));
}

export function asArray<T>(value: unknown, defaultValue: T[] = []): T[] {
  return Array.isArray(value) ? value : defaultValue;
}

export function positionNode(
  node: AnyWrapAstNode,
  layout: Omit<LayoutKind, "grid">,
  offset: number,
  padding: number
): number {
  const isRow = layout === "row";
  const x = isRow ? offset : 0;
  const y = isRow ? 0 : offset;

  if (hasSize(node, true)) {
    node.x = x;
    node.y = y;
    const res = (isRow ? node.width : node.height) ?? 0;

    return offset + res + padding;
  }

  if (node.type === "line") {
    if (!hasKeys<LineNode, (keyof LineSegment)[]>(node, ["x1", "y1", "x2", "y2"])) return offset;

    const x2 = x + (node.x2 - node.x1);
    const y2 = y + (node.y2 - node.y1);
    const res = Math.abs(isRow ? node.x2 - node.x1 : node.y2 - node.y1);

    node.x1 = x;
    node.y1 = y;
    node.x2 = x2;
    node.y2 = y2;

    return offset + res + padding;
  }

  return offset;
}
