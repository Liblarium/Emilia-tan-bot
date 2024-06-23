import { Types } from "mongoose";

export interface IBaka {
  _id: Types.ObjectId;
  id: number;
  uname: string;
  test: object;
}
