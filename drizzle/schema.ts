import { pgTable, serial, text, bigint, jsonb, foreignKey, uuid, integer, boolean } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const drizzleMigrationProfile = pgTable("drizzle_migration_profile", {
	id: serial("id").primaryKey().notNull(),
	hash: text("hash").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }),
});

export const test = pgTable("test", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	codes: jsonb("codes"),
});

export const users = pgTable("users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	username: text("username").notNull(),
	dostup: uuid("dostup").notNull(),
	perms: integer("perms").default(0),
	bio: text("bio").default('Вы можете изменить информацию о пользователе с помощью /newinfo'),
	potion: integer("potion").default(0),
	pechenie: integer("pechenie").default(0),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	globalLevel: bigint("global_level", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	localLevel: bigint("local_level", { mode: "number" }),
	clan: uuid("clan"),
},
(table) => {
	return {
		usersDostupDostupIdFk: foreignKey({
			columns: [table.dostup],
			foreignColumns: [dostup.id],
			name: "users_dostup_dostup_id_fk"
		}),
		usersGlobalLevelGlobalLevelIdFk: foreignKey({
			columns: [table.globalLevel],
			foreignColumns: [globalLevel.id],
			name: "users_global_level_global_level_id_fk"
		}),
		usersLocalLevelGlobalLevelIdFk: foreignKey({
			columns: [table.localLevel],
			foreignColumns: [globalLevel.id],
			name: "users_local_level_global_level_id_fk"
		}),
	}
});

export const clan = pgTable("clan", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	type: text("type").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	master: bigint("master", { mode: "number" }).notNull(),
	positions: jsonb("positions").default({}),
	positionMax: integer("position_max").default(150),
	limit: integer("limit").default(50),
	deputuMax: integer("deputu_max").default(2),
},
(table) => {
	return {
		clanMasterUsersIdFk: foreignKey({
			columns: [table.master],
			foreignColumns: [users.id],
			name: "clan_master_users_id_fk"
		}),
	}
});

export const clanMember = pgTable("clanMember", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	perms: integer("perms"),
	atribytes: jsonb("atribytes"),
},
(table) => {
	return {
		clanMemberPermsClanRoleIdFk: foreignKey({
			columns: [table.perms],
			foreignColumns: [clanRole.id],
			name: "clanMember_perms_clanRole_id_fk"
		}),
		clanMemberUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "clanMember_user_id_users_id_fk"
		}),
	}
});

export const clanRole = pgTable("clanRole", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	permission: integer("permission").notNull(),
});

export const dostup = pgTable("dostup", {
	id: uuid("id").primaryKey().notNull(),
	base: text("base").default('Гость').notNull(),
	reader: text("reader").default('F').notNull(),
	additionalAccess: jsonb("additional_access").default([]),
	maxRank: integer("max_rank").default(9),
});

export const globalLevel = pgTable("global_level", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	xp: integer("xp"),
	level: integer("level"),
	maxXp: integer("max_xp").default(150),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	nextXp: bigint("next_xp", { mode: "number" }),
});

export const baka = pgTable("baka", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	uname: text("uname"),
	test: jsonb("test"),
});

export const guild = pgTable("guild", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	prefix: jsonb("prefix").default({"now":"++","default":"++"}),
	addInBd: boolean("addInBD").default(false),
	logModule: boolean("log_module").default(false),
	message: jsonb("message").default({"id":"0","bit_int":0}),
	channel: jsonb("channel").default({"id":"0","bit_int":0}),
	guild: jsonb("guild").default({"id":"0","bit_int":0}),
	member: jsonb("member").default({"id":"0","bit_int":0}),
	emoji: jsonb("emoji").default({"id":"0","bit_int":0}),
	role: jsonb("role").default({"id":"0","bit_int":0}),
});

export const privateVoice = pgTable("private_voice", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	ownerId: bigint("owner_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	guildId: bigint("guild_id", { mode: "number" }).notNull(),
});