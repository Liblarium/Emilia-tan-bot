import { IGameInventory } from "@type/database_mongoose/schema/game.inventory";
import { Model, model, Schema } from "mongoose";

const gameInventorySchema = new Schema<IGameInventory, Model<IGameInventory>>({
  _id: { type: Schema.Types.ObjectId },
  id: { type: String, required: true },
  /* prettier-ignore */
  invetory: [{ 
    name: { type: String, required: true },
    item: { type: Schema.Types.ObjectId, ref: `gameItems` },
    count: { type: Number, required: true },
    weight: { type: Number, default: 0 },
  }],
  max_inv_size: { type: Number, default: 25 },
  max_inv_weight: { type: Number, default: 0 },
});

const GameInventory = model(`gameInventory`, gameInventorySchema);

export { GameInventory, IGameInventory };
