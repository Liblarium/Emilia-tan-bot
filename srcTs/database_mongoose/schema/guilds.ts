import { IGuilds } from "@type/database_mongoose/schema/guilds";
import { model, Model, Schema } from "mongoose";

const booleanOpt = { type: Boolean, default: false };
const logOption = { id: { type: String, default: `0` } };

const guildsSchema = new Schema<IGuilds, Model<IGuilds>>({
  _id: { type: Schema.Types.ObjectId },
  id: { type: String, required: true },
  prefix: {
    default: { type: String, default: `++` },
    now: { type: String, required: true },
  },
  addInBD: booleanOpt,
  logs: {
    log_module: booleanOpt,
    message: {
      ...logOption,
      update: booleanOpt,
      delete: booleanOpt,
    },
    channel: {
      ...logOption,
      create: booleanOpt,
      delete: booleanOpt,
      update: booleanOpt,
      join: booleanOpt,
      leave: booleanOpt,
    },
    guild: {
      ...logOption,
      update: booleanOpt,
    },
    member: {
      ...logOption,
      update: booleanOpt,
      join: booleanOpt,
      leave: booleanOpt,
    },
    emoji: {
      ...logOption,
      update: booleanOpt,
      create: booleanOpt,
      delete: booleanOpt,
    },
    role: {
      ...logOption,
      create: booleanOpt,
      update: booleanOpt,
      delete: booleanOpt,
    },
  },
});

const Guilds = model(`guilds`, guildsSchema);

export { Guilds, IGuilds };
