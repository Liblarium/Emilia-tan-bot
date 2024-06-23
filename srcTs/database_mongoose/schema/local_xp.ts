import { ILocalXp } from "@type/database_mongoose/schema/local_xp";
import { Model, model, Schema } from "mongoose";

const localXpSchema = new Schema<ILocalXp, Model<ILocalXp>>({
  _id: { type: Schema.Types.ObjectId },
  id: { type: String, required: true },
  guildId: { type: String },
  xp: { type: Number },
  level: { type: Number },
  max_xp: { type: Number },
  next_xp: { type: String },
});

const LocalXp = model(`local_xp`, localXpSchema);

export { LocalXp, ILocalXp };
