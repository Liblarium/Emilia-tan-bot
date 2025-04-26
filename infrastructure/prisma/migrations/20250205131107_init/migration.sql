-- CreateEnum
CREATE TYPE "ClanTypeEnum" AS ENUM ('CLAN', 'GUILD', 'CULT', 'SECT');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "username" TEXT NOT NULL,
    "perms" INTEGER NOT NULL DEFAULT 0,
    "bio" TEXT NOT NULL DEFAULT 'Вы можете изменить информацию о пользователе с помощью /newinfo',
    "potion" INTEGER NOT NULL DEFAULT 0,
    "pechenie" INTEGER NOT NULL DEFAULT 0,
    "pol" TEXT NOT NULL DEFAULT 'неизвестно',
    "clanId" BIGINT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clan" (
    "id" BIGSERIAL NOT NULL,
    "type" "ClanTypeEnum" NOT NULL,
    "masterId" BIGINT NOT NULL,
    "positions" JSONB NOT NULL DEFAULT '{}',
    "positionMax" INTEGER NOT NULL DEFAULT 150,
    "limit" INTEGER NOT NULL DEFAULT 50,
    "deputuMax" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "Clan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClanMember" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "clanId" BIGINT NOT NULL,
    "roleId" BIGINT NOT NULL,
    "attributes" JSONB NOT NULL DEFAULT '{ "owner": false, "elite": false, "deputu": false }',

    CONSTRAINT "ClanMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClanRole" (
    "id" BIGSERIAL NOT NULL,
    "clanId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "permission" INTEGER NOT NULL,

    CONSTRAINT "ClanRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalLevel" (
    "id" BIGSERIAL NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,
    "maxXp" INTEGER NOT NULL DEFAULT 150,
    "nextXp" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "GlobalLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalLevel" (
    "id" BIGSERIAL NOT NULL,
    "guildId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,
    "maxXp" INTEGER NOT NULL DEFAULT 150,
    "nextXp" BIGINT NOT NULL,

    CONSTRAINT "LocalLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" BIGINT NOT NULL,
    "prefix" JSONB NOT NULL DEFAULT '{ "default": "++", "now": "++" }',
    "voiceChannel" BIGINT NOT NULL,
    "voiceCategory" BIGINT NOT NULL,
    "addInBD" BOOLEAN NOT NULL DEFAULT false,
    "logModule" BOOLEAN NOT NULL DEFAULT false,
    "levelModule" BOOLEAN NOT NULL DEFAULT false,
    "logIntents" INTEGER NOT NULL DEFAULT 0,
    "message" JSONB NOT NULL DEFAULT '{}',
    "channel" JSONB NOT NULL DEFAULT '{}',
    "guild" JSONB NOT NULL DEFAULT '{}',
    "member" JSONB NOT NULL DEFAULT '{}',
    "emoji" JSONB NOT NULL DEFAULT '{}',
    "role" JSONB NOT NULL DEFAULT '{}',
    "voice" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateVoice" (
    "id" BIGINT NOT NULL,
    "ownerId" BIGINT NOT NULL,
    "guildId" BIGINT NOT NULL,

    CONSTRAINT "PrivateVoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Baka" (
    "id" BIGSERIAL NOT NULL,
    "uname" TEXT NOT NULL,
    "test" JSONB NOT NULL,

    CONSTRAINT "Baka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" BIGSERIAL NOT NULL,
    "codes" JSONB NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dostup" (
    "id" BIGINT NOT NULL,
    "base" TEXT NOT NULL DEFAULT 'Гость',
    "reader" TEXT NOT NULL DEFAULT 'F',
    "additionalAccess" JSONB NOT NULL DEFAULT '[]',
    "maxRank" INTEGER NOT NULL DEFAULT 9,

    CONSTRAINT "Dostup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClanRoles" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_ClanRoles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserClanMembers" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_UserClanMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ClanRoleMembers" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_ClanRoleMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserLocalLevels" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_UserLocalLevels_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GuildLocalLevels" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_GuildLocalLevels_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Clan_masterId_key" ON "Clan"("masterId");

-- CreateIndex
CREATE UNIQUE INDEX "ClanMember_userId_clanId_key" ON "ClanMember"("userId", "clanId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalLevel_userId_key" ON "GlobalLevel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateVoice_id_key" ON "PrivateVoice"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Dostup_id_key" ON "Dostup"("id");

-- CreateIndex
CREATE INDEX "_ClanRoles_B_index" ON "_ClanRoles"("B");

-- CreateIndex
CREATE INDEX "_UserClanMembers_B_index" ON "_UserClanMembers"("B");

-- CreateIndex
CREATE INDEX "_ClanRoleMembers_B_index" ON "_ClanRoleMembers"("B");

-- CreateIndex
CREATE INDEX "_UserLocalLevels_B_index" ON "_UserLocalLevels"("B");

-- CreateIndex
CREATE INDEX "_GuildLocalLevels_B_index" ON "_GuildLocalLevels"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "id_dostup" FOREIGN KEY ("id") REFERENCES "Dostup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clan" ADD CONSTRAINT "Clan_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClanMember" ADD CONSTRAINT "ClanMember_clanId_fkey" FOREIGN KEY ("clanId") REFERENCES "Clan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClanMember" ADD CONSTRAINT "ClanMember_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "ClanRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClanMember" ADD CONSTRAINT "ClanMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClanRole" ADD CONSTRAINT "ClanRole_clanId_fkey" FOREIGN KEY ("clanId") REFERENCES "Clan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalLevel" ADD CONSTRAINT "GlobalLevel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalLevel" ADD CONSTRAINT "LocalLevel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalLevel" ADD CONSTRAINT "LocalLevel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClanRoles" ADD CONSTRAINT "_ClanRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Clan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClanRoles" ADD CONSTRAINT "_ClanRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "ClanRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserClanMembers" ADD CONSTRAINT "_UserClanMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "ClanMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserClanMembers" ADD CONSTRAINT "_UserClanMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClanRoleMembers" ADD CONSTRAINT "_ClanRoleMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "ClanMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClanRoleMembers" ADD CONSTRAINT "_ClanRoleMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "ClanRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLocalLevels" ADD CONSTRAINT "_UserLocalLevels_A_fkey" FOREIGN KEY ("A") REFERENCES "LocalLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLocalLevels" ADD CONSTRAINT "_UserLocalLevels_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuildLocalLevels" ADD CONSTRAINT "_GuildLocalLevels_A_fkey" FOREIGN KEY ("A") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuildLocalLevels" ADD CONSTRAINT "_GuildLocalLevels_B_fkey" FOREIGN KEY ("B") REFERENCES "LocalLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
