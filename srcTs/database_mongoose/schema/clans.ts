import { IClans } from "@type/database_mongoose/schema/clans";
import { model, Model, Schema } from "mongoose";

const clansSchema = new Schema<IClans, Model<IClans>>({
  _id: { type: Schema.Types.ObjectId, required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  master: { type: Schema.Types.ObjectId, ref: `users`, required: true },
  deputu: {
    type: Object,
    default: {},
    validate: {
      validator: (v: any) => {
        if (!v) return false;
        return Object.keys(v).length > 0;
      },
      message: (props: any) => `${props.value} is not a valid data Object!`,
    },
  },
  /* prettier-ignore */
  positions: [{
    name: { type: String },
    position: { type: Number },
  }],
  limit: { type: Number, default: 50 },
  position_limit: { type: Number, default: 10 },
  /* prettier-ignore */
  members: [{
    id: { type: Schema.Types.ObjectId, ref: `users` },
    position: { type: Number },
  }],
  elite_max: { type: Number, default: 5 },
  upgrade: {
    count: { type: Number, default: 1 },
    max: { type: Number, default: 50 },
  },
  deputu_max: { type: Number, default: 2 },
});

const Clans = model(`clans`, clansSchema);

export { Clans, IClans };
