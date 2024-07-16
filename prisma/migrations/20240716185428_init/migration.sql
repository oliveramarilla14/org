-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "badge" TEXT,
    "name" TEXT NOT NULL,
    "inscriptionPayment" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "ClubStats" (
    "clubId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,
    "played" INTEGER NOT NULL DEFAULT 0,
    "win" INTEGER NOT NULL DEFAULT 0,
    "draw" INTEGER NOT NULL DEFAULT 0,
    "loose" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "conceed" INTEGER NOT NULL DEFAULT 0,
    "yellows" INTEGER NOT NULL DEFAULT 0,
    "reds" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ClubStats_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "teamId" INTEGER,
    "documentNumber" INTEGER NOT NULL,
    "promYear" INTEGER NOT NULL,
    "phoneNumber" INTEGER,
    CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Club" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerStats" (
    "playerId" INTEGER NOT NULL,
    "goalscorer" INTEGER,
    "played" INTEGER NOT NULL DEFAULT 0,
    "win" INTEGER NOT NULL DEFAULT 0,
    "draw" INTEGER NOT NULL DEFAULT 0,
    "loose" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "conceed" INTEGER NOT NULL DEFAULT 0,
    "yellows" INTEGER NOT NULL DEFAULT 0,
    "reds" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstTeamId" INTEGER NOT NULL,
    "secondTeamId" INTEGER NOT NULL,
    "hora" TEXT,
    "firstTeamGoals" INTEGER,
    "secondTeamGoals" INTEGER,
    "fecha" INTEGER NOT NULL,
    "result" INTEGER,
    CONSTRAINT "Match_firstTeamId_fkey" FOREIGN KEY ("firstTeamId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_secondTeamId_fkey" FOREIGN KEY ("secondTeamId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayersOnMatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "goals" INTEGER,
    "yellow" INTEGER,
    "red" INTEGER,
    CONSTRAINT "PlayersOnMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayersOnMatch_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayersOnMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubId" INTEGER,
    "playerId" INTEGER,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "deadline" DATETIME NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "paydate" DATETIME,
    "observation" TEXT,
    CONSTRAINT "Payment_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Payment_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Amonestation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER,
    "clubId" INTEGER NOT NULL,
    "matchId" INTEGER,
    "paymentId" INTEGER,
    "type" TEXT NOT NULL,
    "observation" TEXT,
    "pointsDeducted" INTEGER,
    "matchesToPay" INTEGER,
    "matchesPaid" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Amonestation_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Amonestation_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Amonestation_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Amonestation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchStartTime" TEXT NOT NULL,
    "matchDuration" INTEGER NOT NULL,
    "matchInterval" TEXT NOT NULL,
    "matchPrice" INTEGER NOT NULL,
    "yellowCardPrice" INTEGER NOT NULL,
    "redCardPrice" INTEGER NOT NULL,
    "yellowCardMatches" INTEGER NOT NULL,
    "yellowAmountToMatch" INTEGER NOT NULL,
    "redCardMatches" INTEGER NOT NULL,
    "woAmonestation" BOOLEAN NOT NULL,
    "woPrice" INTEGER NOT NULL,
    "inscriptionPrice" INTEGER NOT NULL,
    "monthSocialPrice" INTEGER NOT NULL,
    "monthSocialPayDay" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Player_documentNumber_key" ON "Player"("documentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_playerId_key" ON "PlayerStats"("playerId");
