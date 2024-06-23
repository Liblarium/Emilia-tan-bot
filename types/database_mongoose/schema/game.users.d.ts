import { Types } from "mongoose";

export interface IGameUsers {
  _id: Types.ObjectId;
  id: string;
  created: string;
  username: string;
  profile: Types.ObjectId;
  registed: string;
  perms: number;
}
