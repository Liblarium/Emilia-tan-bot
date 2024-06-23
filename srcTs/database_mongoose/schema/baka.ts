import { IBaka } from "@type/database_mongoose/schema/baka";
import { model, Model, Schema } from "mongoose";

const bakaSchema = new Schema<IBaka, Model<IBaka>>({
  _id: { type: Schema.Types.ObjectId },
  id: { type: Number, required: true },
  uname: { type: String },
  test: { type: Object },
});

const Baka = model(`baka`, bakaSchema);

export { Baka, IBaka };
