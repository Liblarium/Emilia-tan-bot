import { Types } from "mongoose";

export interface IPrivateVoice {
  _id: Types.ObjectId;
  id: string;
  owner: string;
  guild: string;
}
