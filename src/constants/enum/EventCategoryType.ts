/**
 * @enum
 * @name EventCagetoryType
 * @description This enum to define the category of the event
 */
export enum EventCategoryType {
  /**
   * Discord.js event. Default category.
   */
  BOT = "bot",
  /**
   * MongoDB/Mongoose event
   */
  MONGO = "mongo",
  /**
   * Custom event - you can create your own. Recomended: add there your category event
   */
  CUSTOM = "custom"
}