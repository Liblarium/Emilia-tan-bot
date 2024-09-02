import { relations } from 'drizzle-orm';
import { bigint, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { clan } from "./clan.core";
import { dostup } from "./dostup";
import { globalLevel } from "./level.global";
import { localLevel } from "./level.local";

export const users = pgTable('users', {
  id: bigint('id', { mode: "bigint" }).primaryKey(),
  username: text('username').notNull(),
  dostup: bigint('dostup', { mode: "bigint" }).notNull().references(() => dostup.id),
  perms: integer('perms').default(0),
  bio: text('bio').default('Вы можете изменить информацию о пользователе с помощью /newinfo'),
  potion: integer('potion').default(0), //от 0 до 100. Где 100 - повышение до чтеца. ниже -100 не может быть
  pechenie: integer('pechenie').default(0),
  globalLevel: bigint("global_level", { mode: "bigint" }).notNull().references(() => globalLevel.id),
  localLevel: bigint("local_level", { mode: "bigint"}).references(() => localLevel.id), // тип данных изменен на uuid
  clanId: uuid("clan")
});

export const userRelations = relations(users, ({ one }) => ({
  clan: one(clan, {
    fields: [users.clanId],
    references: [clan.id]
  })
}));


// 
// export const users = pgTable('users', {
//   id: serial('id').primaryKey(),
//   name: text('name'),
//   guildId: integer('guild_id').references(() => guilds.id),
//  });
 
//  export const usersRelations = relations(users, ({ one }) => ({
//   guild: one(guilds, {
//     fields: [users.guildId],
//     references: [guilds.id],
//   }),
//  }));
 
//  export const guilds = pgTable('guilds', {
//   id: serial('id').primaryKey(),
//   name: text('name'),
//  });
 
//  export const guildsRelations = relations(guilds, ({ many }) => ({
//   users: many(users),
//  }));



// import { Column, Entity, PrimaryColumn } from "typeorm";
// import { IUsers } from "../../../types/database/schema/users";

// export const defaultUsers: IUsers["info"] = {
//   username: "",
//   dostup: {
//     base: "Гость",
//     reader: "F",
//     additional_access: [],
//     max_rank: 9 // 9 == D-5
//   },
//   dn: 0,
//   pol: "Не выбран",
//   perms: 0,
//   tityl: [],
//   bio: "Вы можете изменить **Информация о пользователе** с помощью **/newinfo**",
//   potion: 0,
//   level: {
//     global: {
//       xp: 0, //опыт
//       level: 0, //уровень
//       max_xp: 300, //сколько до следующего уровня. Пока 300.
//       next_xp: (new Date().getTime() + 10 * 60 * 1000).toString(),
//     },
//     local: {}
//   },
//   pechenie: 0,
//   clan: 0
// };

// @Entity()
// class Users implements IUsers {
//   @PrimaryColumn({ type: "bigint" })
//   id!: IUsers["id"];

//   @Column({ type: "jsonb", nullable: true, default: defaultUsers })
//   info?: IUsers["info"];
// }

// export { Users, IUsers };
