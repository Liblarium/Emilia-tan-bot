import { Types } from "mongoose";

export interface ILocalXp {
  _id: Types.ObjectId;
  id: string;
  guildId: string;
  xp: number;
  level: number;
  max_xp: number;
  next_xp: string;
}
