import { Baka, IBaka } from "./schema/baka";
import { Clans, IClans } from "./schema/clans";
import { GameClass, IGameClass } from "./schema/game.class";
import { GameInventory, IGameInventory } from "./schema/game.inventory";
import { GameItems, IGameItems } from "./schema/game.items";
import { GameProfile, IGameProfile } from "./schema/game.profile";
import { GameRace, IGameRace } from "./schema/game.race";
import { GameSkill, IGameSkill } from "./schema/game.skill";
import { GameUsers, IGameUsers } from "./schema/game.users";
import { Guilds, IGuilds } from "./schema/guilds";
import { ILocalXp, LocalXp } from "./schema/local_xp";
import { IPrivateVoice, PrivateVoice } from "./schema/private_voice";
import { ITest, Test } from "./schema/test";
import { IUsers, Users } from "./schema/users";

const modelsMap = {
  users: Users,
  clans: Clans,
  baka: Baka,
  local_xp: LocalXp,
  private_voice: PrivateVoice,
  guilds: Guilds,
  test: Test,
  game_users: GameUsers,
  game_class: GameClass,
  game_race: GameRace,
  game_profile: GameProfile,
  game_inventory: GameInventory,
  game_skill: GameSkill,
  game_items: GameItems,
};

type ModelsName = keyof typeof modelsMap;

interface ModelsTable {
  users: IUsers;
  clans: IClans;
  baka: IBaka;
  local_xp: ILocalXp;
  private_voice: IPrivateVoice;
  guilds: IGuilds;
  test: ITest;
  game_users: IGameUsers;
  game_class: IGameClass;
  game_race: IGameRace;
  game_profile: IGameProfile;
  game_inventory: IGameInventory;
  game_skill: IGameSkill;
  game_items: IGameItems;
}

export { modelsMap, ModelsTable, ModelsName };
