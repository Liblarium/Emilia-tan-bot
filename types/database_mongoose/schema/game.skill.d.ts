import { Types } from "mongoose";

export interface IGameSkill {
  _id: Types.ObjectId;
  name: string;
  type: string;
  rarity: string;
  dexterity: number;
  strength: number;
  endurance: number;
  concentration: number;
  intelligence: number;
  wisdom: number;
  spirit: number;
  luck: number;
  accuracy: number;
  mastery: number;
  attachment: number;
  eloquence: number;
  divinity: number;
  general_attack: number;
  physical_damage: number;
  mage_damage: number;
  mental_damage: number;
  recovery_hp: number;
  phesical_protection: number;
  mage_protection: number;
  mental_protection: number;
  cooldown_skill: string;
  stunning: string;
  working_hours: string;
  number_of_uses: string;
  restrictions: string;
  summon_creature: string;
  number_summon_creatures: string;
}
