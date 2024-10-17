import * as baka from "@schema/baka";
import * as clan from "@schema/clan.core";
import * as clanMember from "@schema/clan.members";
import * as clanRole from "@schema/clan.roles";
import * as dostup from "@schema/dostup";
import * as guild from "@schema/guild";
import * as globalLevel from "@schema/level.global";
import * as localLevel from "@schema/level.local";
import * as privateVoice from "@schema/private_voice";
import * as test from "@schema/test";
import * as users from "@schema/user";

export const schema = { ...users, ...baka, ...clan, ...clanMember, ...clanRole, ...dostup, ...guild, ...globalLevel, ...localLevel, ...privateVoice, ...test };

export interface SchemaTables {
  baka: baka.BakaTable;
  clan: clan.ClanTable;
  clanMember: clanMember.ClanMemberTable;
  clanRole: clanRole.ClanRoleTable;
  dostup: dostup.DostupTable;
  guild: guild.GuildTable;
  globalLevel: globalLevel.GlobalLevelTable;
  localLevel: localLevel.LocalLevelTable;
  privateVoice: privateVoice.PrivateVoiceTable;
  test: test.TestTable;
  users: users.UsersTable;
}

/** A mapping of table names to their corresponding Table objects. */
export const schemaTables = {
  baka: baka.baka,
  clan: clan.clan,
  clanMember: clanMember.clanMember,
  clanRole: clanRole.clanRole,
  dostup: dostup.dostup,
  guild: guild.guild,
  globalLevel: globalLevel.globalLevel,
  localLevel: localLevel.localLevel,
  privateVoice: privateVoice.privateVoice,
  test: test.test,
  users: users.users,
};
