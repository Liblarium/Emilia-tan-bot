import { Types } from "mongoose";

export interface IGameRace {
  _id: Types.ObjectId;
  id: string;
  name: string;
  dexterity: number;
  strength: number;
  endurance: number;
  intelligence: number;
  spirit: number;
  eloquence: number;
  wisdom: number;
  luck: number;
  accuracy: number;
  mastery: number;
  attractiveness: number;
  divinity: number;
  concentration: number;
  total_amount: number;
}
