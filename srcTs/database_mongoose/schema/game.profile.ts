import { IGameProfile } from "@type/database_mongoose/schema/game.profile";
import { Model, model, Schema } from "mongoose";

const maxAndNow = {
  max: { type: Number, required: true },
  now: { type: Number, required: true },
};

const gameProfileSchema = new Schema<IGameProfile, Model<IGameProfile>>({
  _id: { type: Schema.Types.ObjectId },
  id: { type: String, required: true }, // userId
  user_name: { type: String, required: true },
  character_name: { type: String, required: true },
  character_age: { type: Number, required: true },
  race: { type: String, required: true },
  class: { type: String, default: `Бесклассовый` },
  appeal: { type: String, required: true },
  gender: { type: String, required: true },
  pedigree: { type: String, required: true },
  titul: { type: String, default: `Отсуствует` },
  nobless_titul: { type: String, default: `Отсуствует` },
  level: { type: Number, default: 0 },
  health: maxAndNow,
  mana: maxAndNow,
  hunger: maxAndNow,
  thirst: maxAndNow,
  location: { type: String, required: true },
  guild: { type: Schema.Types.ObjectId, ref: `gameGuilds` },
  profession: { type: String, default: `Безработний` },
  fraction: { type: String, default: `Отсутствует` },
  skill: { type: Schema.Types.ObjectId, ref: `gameProfileSkill` },
  balance: { type: Number, default: 0 },
  inventory: { type: Schema.Types.ObjectId, ref: `gameInventory` },
  characteristic: {
    attack: { type: Number, required: true },
    strength: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    precision: { type: Number, required: true },
    intelligence: { type: Number, required: true },
    wisdom: { type: Number, required: true },
    luck: { type: Number, required: true },
    defense: { type: Number, required: true },
    endurance: { type: Number, required: true },
    divinity: { type: Number, required: true },
    predisposition: { type: Number, required: true },
    concentration: { type: Number, required: true },
    dexterity: { type: Number, required: true },
    fatigue: { type: Number, required: true },
    injuries: [{ type: String }],
  },
});

const GameProfile = model(`gameProfile`, gameProfileSchema);

export { GameProfile, IGameProfile };
