/**
 * Enum for command type
 * 
 * If Both - work as slash and message command
 * 
 * If Command - only message command
 * 
 * If Slash - only Slash command
 */
export enum CommandType {
  /**
   * Message & Slash command
   */
  Both = "both",
  /**
   * Only message command
   */
  Command = "message",
  /**
   * Only slash command
   */
  Slash = "slash"
}