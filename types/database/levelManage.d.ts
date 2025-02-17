/**
 * Interface for adding a new Global/Local Level in database.
 */
export interface CreateLevelOptions {
  /**
   * Id discord user
   * @type {string}
   */
  id: string;
  /**
   * Username discord user
   * @type {string}
   */
  username: string;
  /**
   * id discord guild
   */
  guildId: string;
  /**
   * local level
   */
  local?: boolean;
}