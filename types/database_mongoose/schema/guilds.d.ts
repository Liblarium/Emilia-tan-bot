import { Types } from "mongoose";

export interface IGuilds {
  _id: Types.ObjectId;
  id: string;
  prefix?: {
    default: string;
    now: string;
  };
  addInBD?: boolean;
  logs?: {
    log_module: boolean;
    message: {
      id: string;
      update: boolean;
      delete: boolean;
    };
    channel: {
      id: string;
      create: boolean;
      delete: boolean;
      update: boolean;
      join: boolean;
      leave: boolean;
    };
    guild: {
      id: string;
      update: boolean;
    };
    member: {
      id: string;
      update: boolean;
      join: boolean;
      leave: boolean;
    };
    emoji: {
      id: string;
      update: boolean;
      create: boolean;
      delete: boolean;
    };
    role: {
      id: string;
      create: boolean;
      update: boolean;
      delete: boolean;
    };
  };
}
