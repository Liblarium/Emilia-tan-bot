import { IGameItems } from "@type/database_mongoose/schema/game.items";
import { Model, model, Schema } from "mongoose";

const gameItemsSchema = new Schema<IGameItems, Model<IGameItems>>({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  weight: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  isDrop: { type: Boolean, default: false }, // выпадает ли предмет с врагов. Мб изменю имя позже
  isSale: { type: Boolean, default: false }, // покупаемый ли предмед
  isCraft: { type: Boolean, default: false }, // можно ли скрафтить
  isQuest: { type: Boolean, default: false }, // квестовый ли предмет
});

const GameItems = model(`gameItems`, gameItemsSchema);

export { GameItems, IGameItems };
