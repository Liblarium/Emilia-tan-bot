/**
 * The categories of events
 */
export enum CategoryEvents {
  /**
   * The category for discord.js events
   */
  Bot = "bot",
  /**
   * The category for typegoose/mongoose events
   */
  Mongoose = "mongoose",
  /**
   * Custom event - you can create your own. Recommended: add there your category event
   */
  Custom = "custom",
  /**
   * Unknowns events (`[key: string]: unknown[]`)
   */
  Unknown = "unknown"
}