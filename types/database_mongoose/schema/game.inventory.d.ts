import { Types } from "mongoose";

export interface IGameInventory {
  _id: Types.ObjectId;
  id: string;
  /* prettier-ignore */
  invetory: [{ 
    name: string,
    item: Types.ObjectId,
    count: number, 
    weight: number,
  }],
  max_inv_size: number;
  max_inv_weight: number;
}
