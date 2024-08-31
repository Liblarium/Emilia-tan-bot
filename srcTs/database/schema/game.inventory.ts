// /* eslint-disable indent */
// import { Column, Entity, PrimaryColumn } from "typeorm";
// import { IGameInventory } from "../../../types/database/schema/game.inventory";

// @Entity({ name: "gameInventory" })
// class GameInventory implements IGameInventory {
//   @PrimaryColumn({ type: "bigint" })
//   id!: IGameInventory[`id`];

//   @Column({ type: "jsonb", default: {} })
//   invetory?: IGameInventory[`invetory`];

//   @Column({ type: "int", default: 25 })
//   max_inv_size!: IGameInventory[`max_inv_size`];

//   @Column({ type: "bigint", default: 0 })
//   max_inv_weight!: IGameInventory[`max_inv_weight`];
// }

// export { GameInventory, IGameInventory };
