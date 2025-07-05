import type { CanvasCtx } from "@emilia-tan/types";
import type { RootNode } from "../types/ast.js";
import { renderAst } from "./barrel.js";

export function renderRootNode(node: RootNode, ctx: CanvasCtx) {
  renderAst(node, ctx);
}
