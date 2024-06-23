import { Types } from "mongoose";

export interface IGameItems {
  _id: Types.ObjectId;
  name: string;
  weight: number;
  price: number;
  isDrop: boolean;
  isSale: boolean;
  isCraft: boolean;
  isQuest: boolean;
}
