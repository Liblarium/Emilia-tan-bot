-- CreateTable
CREATE TABLE "Baka" (
    "id" BIGINT NOT NULL,
    "uname" TEXT,
    "test" JSONB,

    CONSTRAINT "Baka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clan" (
    "id" BIGSERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "info" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Clan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameClass" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "actiove" JSONB NOT NULL DEFAULT '{}',
    "passive" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "GameClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameInventory" (
    "id" BIGINT NOT NULL,
    "inventory" JSONB NOT NULL DEFAULT '{}',
    "inv_limits" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "GameInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameItem" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL,
    "isDrop" BOOLEAN DEFAULT true,
    "isSale" BOOLEAN DEFAULT true,
    "isCraft" BOOLEAN DEFAULT false,
    "isQuest" BOOLEAN DEFAULT false,

    CONSTRAINT "GameItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameProfileSkill" (
    "id" BIGINT NOT NULL,

    CONSTRAINT "GameProfileSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameProfile" (
    "id" BIGINT NOT NULL,
    "character" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "GameProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "characteristic" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "GameRace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSkill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "characteristic" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "GameSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameUser" (
    "id" BIGINT NOT NULL,
    "username" TEXT NOT NULL,
    "created" TEXT NOT NULL,
    "registered" TEXT NOT NULL,
    "perms" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "GameUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" BIGINT NOT NULL,
    "prefix" JSONB DEFAULT '{}',
    "addInBD" BOOLEAN DEFAULT false,
    "logs" JSONB DEFAULT '{}',

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateVoice" (
    "id" BIGINT NOT NULL,
    "owner" BIGINT NOT NULL,
    "guild" BIGINT NOT NULL,

    CONSTRAINT "PrivateVoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "info" JSONB DEFAULT '{}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameUser_username_key" ON "GameUser"("username");

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_id_fkey" FOREIGN KEY ("id") REFERENCES "GameUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameUser" ADD CONSTRAINT "GameUser_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
