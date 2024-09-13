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
import * as user from "@schema/user";

export const schema = { ...user, ...baka, ...clan, ...clanMember, ...clanRole, ...dostup, ...guild, ...globalLevel, ...localLevel, ...privateVoice, ...test };