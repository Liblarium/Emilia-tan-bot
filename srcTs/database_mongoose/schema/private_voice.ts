import { IPrivateVoice } from "@type/database_mongoose/schema/private_voice";
import { Model, model, Schema } from "mongoose";

const privateVoiceSchema = new Schema<IPrivateVoice, Model<IPrivateVoice>>({
  _id: { type: Schema.Types.ObjectId },
  id: { type: String, required: true },
  owner: { type: String, required: true },
  guild: { type: String, required: true },
});

const PrivateVoice = model(`private_voice`, privateVoiceSchema);

export { PrivateVoice, IPrivateVoice };
