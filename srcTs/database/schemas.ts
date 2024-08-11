import { Baka, type IBaka } from "./schema/baka";
import { Clans, type IClans, defaultClans } from "./schema/clans";
import { GameClass, type IGameClass } from "./schema/game.class";
import { GameInventory, type IGameInventory } from "./schema/game.inventory";
import { GameItems, type IGameItems } from "./schema/game.items";
import { GameProfile, type IGameProfile } from "./schema/game.profile";
import { GameRace, type IGameRace } from "./schema/game.race";
import { GameSkill, type IGameSkill } from "./schema/game.skill";
import { GameUsers, type IGameUsers } from "./schema/game.users";
import { Guilds, type IGuilds, guildsLogDefault } from "./schema/guilds";
import { type IPrivateVoice, PrivateVoice } from "./schema/private_voice";
import { type ITest, Test } from "./schema/test";
import { type IUsers, Users, defaultUsers } from "./schema/users";

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
export interface SchemaTable {
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
}
