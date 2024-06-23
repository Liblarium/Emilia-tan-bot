import { IGameClass } from "@type/database_mongoose/schema/game.class";
import { model, Model, Schema } from "mongoose";

const gameClassSchema = new Schema<IGameClass, Model<IGameClass>>({
  _id: { type: Schema.Types.ObjectId },
  id: { type: String, required: true },
  name: { type: String, required: true },
  passive: [{ type: String, required: true }],
  active: [{ type: String, required: true }],
});

const GameClass = model(`gameClass`, gameClassSchema);

export { GameClass, IGameClass };
