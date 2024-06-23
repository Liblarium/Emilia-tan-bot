import { Types } from "mongoose";

export interface IGameClass {
  _id: Types.ObjectId;
  id: string;
  name: string;
  passive: string[];
  active: string[];
}
