import type { EmiliaClient } from "@client";
import type { BaseInteraction } from "discord.js";

export interface IAnyInteractionHandler {
  handler: () => Promise<void>;
}

export type AnyInteractionClass<T extends BaseInteraction, A extends unknown[] = []> = new (
  interaction: T,
  client: EmiliaClient,
  ...args: A
) => IAnyInteractionHandler;

export type ClassProcessing<T extends BaseInteraction, M extends Record<string, unknown[]>> = Array<
  { [K in keyof M]: [AnyInteractionClass<T, M[K]>, M[K]] }[keyof M]
>;

export interface IBaseInteractionHandler {
  client: EmiliaClient;
  interaction: BaseInteraction;
  handler(): Promise<void>;
}
