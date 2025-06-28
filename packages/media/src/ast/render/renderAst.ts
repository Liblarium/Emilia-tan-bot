import type { CanvasCtx } from "@emilia-tan/types";
import type { RootNode } from "../types/ast.js";
import { renderNode } from "./barrel.js";

export function renderAst(node: RootNode, ctx: CanvasCtx) {
  for (const child of node.children) {
    renderNode(child, ctx);
  }
}
