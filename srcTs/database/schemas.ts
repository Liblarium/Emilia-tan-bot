import { Baka, IBaka } from "./schema/baka";
import { Clans, defaultClans, IClans } from "./schema/clans";
import { GameClass, IGameClass } from "./schema/game.class";
import { GameInventory, IGameInventory } from "./schema/game.inventory";
import { GameItems, IGameItems } from "./schema/game.items";
import { GameProfile, IGameProfile } from "./schema/game.profile";
import { GameRace, IGameRace } from "./schema/game.race";
import { GameSkill, IGameSkill } from "./schema/game.skill";
import { GameUsers, IGameUsers } from "./schema/game.users";
import { Guilds, guildsLogDefault, IGuilds } from "./schema/guilds";
import { IPrivateVoice, PrivateVoice } from "./schema/private_voice";
import { ITest, Test } from "./schema/test";
import { defaultUsers, IUsers, Users } from "./schema/users";

export const schemas = [Users, Baka, Clans, GameClass, GameInventory, GameItems, GameProfile, GameRace, GameSkill, GameUsers, Guilds, PrivateVoice, Test]; //на подключение в БД
export const defaults = { defaultUsers, guildsLogDefault, defaultClans }; //для изменения дефолтого заполнения
export const schemasMap = /* для Database */ {
  users: Users,
  baka: Baka,
  clans: Clans,
  game_class: GameClass,
  game_inventry: GameInventory,
  game_items: GameItems,
  game_profile: GameProfile,
  game_race: GameRace,
  game_skill: GameSkill,
  game_users: GameUsers,
  guilds: Guilds,
  private_voice: PrivateVoice,
  test: Test,
};

export type SchemaNames = keyof typeof schemasMap; //для удобства - название идёт в одну строку

// для удоства получения всех интерфейсов в одном типе через SchemaTable[T], где T = SchemaNames
export type SchemaTable = {
  users: IUsers;
  baka: IBaka;
  clans: IClans;
  game_class: IGameClass;
  game_inventry: IGameInventory;
  game_items: IGameItems;
  game_profile: IGameProfile;
  game_race: IGameRace;
  game_skill: IGameSkill;
  game_users: IGameUsers;
  guilds: IGuilds;
  private_voice: IPrivateVoice;
  test: ITest;
};
