import { Types } from "mongoose";

export interface IClans {
  _id?: Types.ObjectId;
  id: string;
  name: string;
  type: string;
  master: Types.ObjectId;
  deputu: Record<string, { id: string; username: string; user: Types.ObjectId }>;
  positions: Types.DocumentArray<{
    name: string;
    position: number;
  }>;
  limit?: number;
  position_limit?: number;
  members?: Types.DocumentArray<{
    id?: Types.ObjectId;
    position?: number;
  }>;
  elite_max?: number;
  upgrade?: {
    count?: number;
    max?: number;
  };
  deputu_max?: number;
}
