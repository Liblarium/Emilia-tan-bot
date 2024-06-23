import { IGameRace } from "@type/database_mongoose/schema/game.race";
import { model, Model, Schema } from "mongoose";

const gameRaceSchema = new Schema<IGameRace, Model<IGameRace>>({
  _id: { type: Schema.Types.ObjectId },
  id: { type: String, required: true },
  name: { type: String, required: true },
  dexterity: { type: Number, default: 0 },
  strength: { type: Number, default: 0 },
  endurance: { type: Number, default: 0 },
  intelligence: { type: Number, default: 0 },
  spirit: { type: Number, default: 0 },
  eloquence: { type: Number, default: 0 },
  wisdom: { type: Number, default: 0 },
  luck: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  mastery: { type: Number, default: 0 },
  attractiveness: { type: Number, default: 0 },
  divinity: { type: Number, default: 0 },
  concentration: { type: Number, default: 0 },
  total_amount: { type: Number, default: 0 },
});

const GameRace = model(`gameRace`, gameRaceSchema);

export { GameRace, IGameRace };
