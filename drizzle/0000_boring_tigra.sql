CREATE TABLE IF NOT EXISTS "baka" (
	"id" bigint PRIMARY KEY NOT NULL,
	"uname" text,
	"test" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"master" bigint NOT NULL,
	"positions" jsonb DEFAULT '{}'::jsonb,
	"position_max" integer DEFAULT 150,
	"limit" integer DEFAULT 50,
	"deputu_max" integer DEFAULT 2
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clanMember" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" bigint,
	"perms" integer,
	"atribytes" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clanRole" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"permission" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dostup" (
	"id" uuid PRIMARY KEY NOT NULL,
	"base" text DEFAULT 'Гость' NOT NULL,
	"reader" text DEFAULT 'F' NOT NULL,
	"additional_access" jsonb DEFAULT '[]'::jsonb,
	"max_rank" integer DEFAULT 9
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guild" (
	"id" bigint PRIMARY KEY NOT NULL,
	"prefix" jsonb DEFAULT '{"default":"++","now":"++"}'::jsonb,
	"addInBD" boolean DEFAULT false,
	"log_module" boolean DEFAULT false,
	"message" jsonb DEFAULT '{"id":"0","bit_int":0}'::jsonb,
	"channel" jsonb DEFAULT '{"id":"0","bit_int":0}'::jsonb,
	"guild" jsonb DEFAULT '{"id":"0","bit_int":0}'::jsonb,
	"member" jsonb DEFAULT '{"id":"0","bit_int":0}'::jsonb,
	"emoji" jsonb DEFAULT '{"id":"0","bit_int":0}'::jsonb,
	"role" jsonb DEFAULT '{"id":"0","bit_int":0}'::jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "global_level" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"xp" integer,
	"level" integer,
	"max_xp" integer DEFAULT 150,
	"next_xp" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "private_voice" (
	"id" bigint PRIMARY KEY NOT NULL,
	"owner_id" bigint NOT NULL,
	"guild_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "test" (
	"id" bigint PRIMARY KEY NOT NULL,
	"codes" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" bigint PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"dostup" uuid NOT NULL,
	"perms" integer DEFAULT 0,
	"bio" text DEFAULT 'Вы можете изменить информацию о пользователе с помощью /newinfo',
	"potion" integer DEFAULT 0,
	"pechenie" integer DEFAULT 0,
	"global_level" bigint NOT NULL,
	"local_level" bigint,
	"clan" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clan" ADD CONSTRAINT "clan_master_user_id_fk" FOREIGN KEY ("master") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clanMember" ADD CONSTRAINT "clanMember_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clanMember" ADD CONSTRAINT "clanMember_perms_clanRole_id_fk" FOREIGN KEY ("perms") REFERENCES "public"."clanRole"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_dostup_dostup_id_fk" FOREIGN KEY ("dostup") REFERENCES "public"."dostup"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_global_level_global_level_id_fk" FOREIGN KEY ("global_level") REFERENCES "public"."global_level"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_local_level_global_level_id_fk" FOREIGN KEY ("local_level") REFERENCES "public"."global_level"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
