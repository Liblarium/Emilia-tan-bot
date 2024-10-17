// /* eslint-disable indent */
// import { Column, Entity, PrimaryColumn } from "typeorm";
// import { IGameItems } from "../../../types/database/schema/game.items";

// @Entity({ name: "gameItems" })
// class GameItems implements IGameItems {
//   @PrimaryColumn({ type: "bigint" })
//   id!: IGameItems[`id`];

//   @Column({ type: "text" })
//   name!: IGameItems[`name`];

//   @Column({ type: "int" })
//   weight!: IGameItems[`weight`];

//   @Column({ type: "int" })
//   price!: IGameItems[`price`];

//   @Column({ type: "boolean", default: true })
//   isDrop?: IGameItems[`isDrop`];  // выпадает ли предмет с врагов. Мб изменю имя позже

//   @Column({ type: "boolean", default: true })
//   isSale?: IGameItems[`isSale`]; // покупаемый ли предмет

//   @Column({ type: "boolean", default: false })
//   isCraft?: IGameItems[`isCraft`]; // можно ли скрафтить

//   @Column({ type: "boolean", default: false })
//   isQuest?: IGameItems[`isQuest`]; // квестовый ли предмет
// }

// export { GameItems, IGameItems };
