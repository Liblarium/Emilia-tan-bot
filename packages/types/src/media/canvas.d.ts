import type { SKRSContext2D } from "@napi-rs/canvas";

export type CanvasCtx =
  | CanvasRenderingContext2D
  | SKRSContext2D /* | other type canvas if needed */;
