import { IGameSkill } from "@type/database_mongoose/schema/game.skill";
import { Model, model, Schema } from "mongoose";

const gameSkillSchema = new Schema<IGameSkill, Model<IGameSkill>>({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  type: { type: String, required: true },
  rarity: { type: String, required: true },
  dexterity: { type: Number, default: 0 },
  strength: { type: Number, default: 0 },
  endurance: { type: Number, default: 0 },
  concentration: { type: Number, default: 0 },
  intelligence: { type: Number, default: 0 },
  wisdom: { type: Number, default: 0 },
  spirit: { type: Number, default: 0 },
  luck: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  mastery: { type: Number, default: 0 },
  attachment: { type: Number, default: 0 },
  eloquence: { type: Number, default: 0 },
  divinity: { type: Number, default: 0 },
  general_attack: { type: Number, default: 0 },
  physical_damage: { type: Number, default: 0 },
  mage_damage: { type: Number, default: 0 },
  mental_damage: { type: Number, default: 0 },
  recovery_hp: { type: Number, default: 0 },
  phesical_protection: { type: Number, default: 0 },
  mage_protection: { type: Number, default: 0 },
  mental_protection: { type: Number, default: 0 },
  cooldown_skill: { type: String, required: true },
  stunning: { type: String, default: `0` },
  working_hours: { type: String, required: true },
  number_of_uses: { type: String, required: true },
  restrictions: { type: String, default: `0` },
  summon_creature: { type: String, default: `0` },
  number_summon_creatures: { type: String, default: `0` },
});

const GameSkill = model(`gameSkill`, gameSkillSchema);

export { GameSkill, IGameSkill };
