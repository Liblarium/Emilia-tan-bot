import { Types } from "mongoose";

export interface IGameProfile {
  _id: Types.ObjectId;
  id: string;
  user_name: string;
  character_name: string;
  character_age: number;
  race: string;
  class: string;
  appeal: string;
  gender: string;
  pedigree: string;
  titul: string;
  nobless_titul: string;
  level: number;
  health: { max: number; now: number };
  mana: { max: number; now: number };
  hunger: { max: number; now: number };
  thirst: { max: number; now: number };
  location: string;
  guild: Types.ObjectId;
  profession: string;
  fraction: string;
  skill: Types.ObjectId;
  balance: number;
  inventory: Types.ObjectId;
  characteristic: {
    attack: number;
    strength: number;
    accuracy: number;
    precision: number;
    intelligence: number;
    wisdom: number;
    luck: number;
    defense: number;
    endurance: number;
    divinity: number;
    predisposition: number;
    concentration: number;
    dexterity: number;
    fatigue: number;
    injuries: string[];
  };
}
