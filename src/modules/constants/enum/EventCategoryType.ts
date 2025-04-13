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
   * Custom event - you can create your own. Recomended: add there your category event
   */
  Custom = "custom",
  /**
   * Unknowns events (`[key: stirng]: unknown[]`)
   */
  Unknown = "unknown"
}