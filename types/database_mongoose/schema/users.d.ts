import { Types } from "mongoose";

export interface IUsers {
  _id?: Types.ObjectId;
  id: string;
  username?: string;
  info?: {
    dostup: {
      base: string;
      reader: string;
      additional_access: Array<string> | [];
    };
    dn?: 0;
    pol?: string;
    perms?: number;
    tityl?: Array<string>;
    bio?: string;
    potion?: number;
  };
  pechenie?: number;
  clan?: Types.ObjectId;
  level?: {
    global: {
      rank: {
        xp: number; //опыт
        level: number; //уровень
        max_xp: number; //сколько до следующего уровня. Пока 300.
        next_xp: string; //когда будет новое накопление опыта. new Date().GetTime() + (10 * 60 * 1000)
      };
    };
    local?: {
      rank: Types.ObjectId;
      id: string;
    }[];
  };
}
