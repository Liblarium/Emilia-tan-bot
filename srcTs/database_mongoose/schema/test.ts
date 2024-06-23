import { ITest } from "@type/database_mongoose/schema/test";
import { Model, model, Schema } from "mongoose";

const testSchema = new Schema<ITest, Model<ITest>>({
  _id: Schema.Types.ObjectId,
  codes: String,
});

const Test = model(`test`, testSchema);
export { Test, ITest };
