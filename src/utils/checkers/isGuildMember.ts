import { GuildMember } from "discord.js";

/**
 * Checks if the provided value is a {@link GuildMember} instance.
 *
 * @param member - The value to be checked.
 * @returns `true` if the value is a {@link GuildMember} instance, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isGuildMember } from "./isGuildMember";
 * 
 * //some event. Expample - interactionCreate
 * const member = interaction.member; // GuildMember | APIInteractionGuildMember | null
 * if (isGuildMember(member)) {
 *   console.log("The member is a GuildMember instance");
 * } else {
 *   console.log("The member is not a GuildMember instance");
 * }
 * ```
 */
export function isGuildMember(member: unknown): member is GuildMember {
  if (member) return false;

  return member instanceof GuildMember;
}
