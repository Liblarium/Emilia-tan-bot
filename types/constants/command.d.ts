import type { Enums } from "@constants";
import type { ActionArguments } from "./action";

export interface CommandOptions {
  /**
   * Whether to delete the message with the command? (The message itself | command type only)
   */
  delete?: boolean;
  /**
   * Command available only for developers
   */
  developer?: boolean;
  /**
   * Permission level limitations (not Discord permissions)
   */
  perms?: number;
  /**
   * Is the command for testing purposes?
   */
  test?: boolean;
  /**
   * Testers' IDs
   */
  testers?: string[];
  /**
   * Is the command available for server owners?
   */
  owner?: boolean;
  /**
   * Channels where the command will not respond (IDs)
   */
  channels?: string[];
  /**
   * Guilds where the command will not respond (IDs)
   */
  guilds?: string[];
  /**
   * Users from which the command will not respond (IDs)
   */
  dUsers?: string[];
}


export interface CommandArguments extends ActionArguments {
  /**
   * Command options
   */
  option?: CommandOptions;
  /**
   * Command description
   */
  description: string;
  /**
   * Command Aliases (message command only)
   */
  aliases?: string[];
  /**
   * Command type (both, messsage or slash command)
   * @default Enums.CommandType.Both
   */
  type?: Enums.CommandType;
}

