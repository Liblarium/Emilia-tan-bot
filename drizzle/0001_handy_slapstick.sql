ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "clan" DROP CONSTRAINT "clan_master_user_id_fk";
--> statement-breakpoint
ALTER TABLE "clanMember" DROP CONSTRAINT "clanMember_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_dostup_dostup_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_global_level_global_level_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_local_level_global_level_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clan" ADD CONSTRAINT "clan_master_users_id_fk" FOREIGN KEY ("master") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clanMember" ADD CONSTRAINT "clanMember_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_dostup_dostup_id_fk" FOREIGN KEY ("dostup") REFERENCES "public"."dostup"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_global_level_global_level_id_fk" FOREIGN KEY ("global_level") REFERENCES "public"."global_level"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_local_level_global_level_id_fk" FOREIGN KEY ("local_level") REFERENCES "public"."global_level"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
