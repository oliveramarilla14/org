-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "badge" TEXT,
    "name" TEXT NOT NULL,
    "inscriptionPayment" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubStats" (
    "clubId" INTEGER NOT NULL,
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

    CONSTRAINT "ClubStats_pkey" PRIMARY KEY ("clubId")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" INTEGER,
    "documentNumber" INTEGER NOT NULL,
    "promYear" INTEGER NOT NULL,
    "phoneNumber" INTEGER,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
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
    "reds" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "firstTeamId" INTEGER NOT NULL,
    "secondTeamId" INTEGER NOT NULL,
    "hora" TEXT,
    "firstTeamGoals" INTEGER,
    "secondTeamGoals" INTEGER,
    "fecha" INTEGER NOT NULL,
    "result" INTEGER,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayersOnMatch" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "goals" INTEGER,
    "yellow" INTEGER,
    "red" INTEGER,

    CONSTRAINT "PlayersOnMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER,
    "playerId" INTEGER,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "paydate" TIMESTAMP(3),
    "observation" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amonestation" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER,
    "clubId" INTEGER NOT NULL,
    "matchId" INTEGER,
    "paymentId" INTEGER,
    "type" TEXT NOT NULL,
    "observation" TEXT,
    "pointsDeducted" INTEGER,
    "matchesToPay" INTEGER,
    "matchesPaid" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Amonestation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
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
    "monthSocialPayDay" INTEGER NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "ClubStats" ADD CONSTRAINT "ClubStats_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_firstTeamId_fkey" FOREIGN KEY ("firstTeamId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_secondTeamId_fkey" FOREIGN KEY ("secondTeamId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersOnMatch" ADD CONSTRAINT "PlayersOnMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersOnMatch" ADD CONSTRAINT "PlayersOnMatch_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersOnMatch" ADD CONSTRAINT "PlayersOnMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amonestation" ADD CONSTRAINT "Amonestation_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amonestation" ADD CONSTRAINT "Amonestation_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amonestation" ADD CONSTRAINT "Amonestation_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amonestation" ADD CONSTRAINT "Amonestation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
