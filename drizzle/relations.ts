import { relations } from "drizzle-orm/relations";
import { dostup, users, globalLevel, clan, clanRole, clanMember } from "./schema";

export const usersRelations = relations(users, ({one, many}) => ({
	dostup: one(dostup, {
		fields: [users.dostup],
		references: [dostup.id]
	}),
	globalLevel_globalLevel: one(globalLevel, {
		fields: [users.globalLevel],
		references: [globalLevel.id],
		relationName: "users_globalLevel_globalLevel_id"
	}),
	globalLevel_localLevel: one(globalLevel, {
		fields: [users.localLevel],
		references: [globalLevel.id],
		relationName: "users_localLevel_globalLevel_id"
	}),
	clans: many(clan),
	clanMembers: many(clanMember),
}));

export const dostupRelations = relations(dostup, ({many}) => ({
	users: many(users),
}));

export const globalLevelRelations = relations(globalLevel, ({many}) => ({
	users_globalLevel: many(users, {
		relationName: "users_globalLevel_globalLevel_id"
	}),
	users_localLevel: many(users, {
		relationName: "users_localLevel_globalLevel_id"
	}),
}));

export const clanRelations = relations(clan, ({one}) => ({
	user: one(users, {
		fields: [clan.master],
		references: [users.id]
	}),
}));

export const clanMemberRelations = relations(clanMember, ({one}) => ({
	clanRole: one(clanRole, {
		fields: [clanMember.perms],
		references: [clanRole.id]
	}),
	user: one(users, {
		fields: [clanMember.userId],
		references: [users.id]
	}),
}));

export const clanRoleRelations = relations(clanRole, ({many}) => ({
	clanMembers: many(clanMember),
}));