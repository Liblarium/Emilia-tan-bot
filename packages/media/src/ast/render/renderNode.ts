import type { CanvasCtx } from "@emilia-tan/types";
import type * as NodeType from "../types/ast.d.ts";
import { isNodeRender } from "../utils/renderHelpers.js";
import * as render from "./barrel.js";

export function renderNode(node: NodeType.AnyWrapAstNode, ctx: CanvasCtx) {
  switch (true) {
    case isNodeRender<NodeType.TextNode>(node, "text"):
      return render.renderTextNode(node, ctx);
    case isNodeRender<NodeType.RectNode>(node, "rect"):
      return render.renderRectNode(node, ctx);
    case isNodeRender<NodeType.RootNode>(node, "root"):
      return render.renderRootNode(node, ctx);
    case isNodeRender<NodeType.CircleNode>(node, "circle"):
      return render.renderCircleNode(node, ctx);
    case isNodeRender<NodeType.StyleNode>(node, "style"):
      return render.renderStyleNode(node, ctx);
    case isNodeRender<NodeType.ContainerNode>(node, "container"):
      return render.renderContainerNode(node, ctx);
    case isNodeRender<NodeType.BezierCurveNode>(node, "bezier"):
      return render.renderBezierCurveNode(node, ctx);
    case isNodeRender<NodeType.EmojiNode>(node, "emoji"):
      return render.renderEmojiNode(node, ctx);
    case isNodeRender<NodeType.LinkNode>(node, "link"):
      return render.renderLinkNode(node, ctx);
    case isNodeRender<NodeType.LineNode>(node, "line"):
      return render.renderLineNode(node, ctx);
    case isNodeRender<NodeType.PolygonNode>(node, "polygon"):
      return render.renderPolygonNode(node, ctx);
    case isNodeRender<NodeType.ErrorNode>(node, "error"):
      return render.renderErrorNode(node, ctx);
    case isNodeRender<NodeType.ImageNode>(node, "image"):
      return render.renderImageNode(node, ctx);
    default:
      console.warn(`Unknown node type: ${node?.type ?? "unknown"}`);
  }
}
