/**
 * Types for events
 */
import type { Log } from "@log";
import type { ChatInputCommandInteraction, Message, VoiceChannel } from "discord.js";

/**
 * Categories for events
 */
export type CategoryType = `bot` | `mongo`;

/**
 * Possible returns of an event
 */
export type EventReturns = void | Message | VoiceChannel | ChatInputCommandInteraction | Log;

/**
 * Base options for events
 */
export interface BaseEventsOptions {
  /**
   * Event name
   */
  name: string;

  /**
   * Event category
   */
  category: CategoryType;

  /**
   * Whether the event should only be triggered once
   */
  once?: boolean;
}

/**
 * Base interface for events
 */
export interface IBaseEvent {
  /**
   * Event name
   */
  name: string;

  /**
   * Whether the event should only be triggered once
   */
  once: boolean;

  /**
   * Event category
   */
  category: CategoryType;

  /**
   * Method that will be called when the event is triggered
   * @param args - Arguments passed to the event
   * @returns - The return value of the event
   */
  execute: (...args: unknown[]) => EventReturns | Promise<EventReturns>;
}


