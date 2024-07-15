import { prisma } from '../database/database.js';

export default async function addPlayerStats({ playersOnMatch, match }, winner) {
  playersOnMatch.team1.forEach(async (player) => {
    const update = {
      played: { increment: 1 },
      goals: { increment: player.goals },
      conceed: { increment: match.secondTeamGoals },
      yellows: { increment: player.yellows },
      reds: { increment: player.reds }
    };

    const create = {
      playerId: parseInt(player.id),
      played: 1,
      goals: player.goals,
      conceed: match.secondTeamGoals,
      yellows: player.yellows,
      reds: player.reds
    };

    if (winner == match.firstTeamId) {
      //gana el 1
      update.win = { increment: 1 };
      create.win = 1;
    } else if (winner == match.secondTeamId) {
      //gana el 2
      update.loose = { increment: 1 };
      create.loose = 1;
    } else if (winner == -1) {
      //empate
      update.draw = { increment: 1 };
      create.draw = 1;
    }
    await prisma.playerStats.upsert({
      where: { playerId: parseInt(player.id) },
      update: update,
      create: create
    });
  });

  playersOnMatch.team2.forEach(async (player) => {
    const update = {
      played: { increment: 1 },
      goals: { increment: player.goals },
      conceed: { increment: match.firstTeamGoals },
      yellows: { increment: player.yellows },
      reds: { increment: player.reds }
    };

    const create = {
      playerId: parseInt(player.id),
      played: 1,
      goals: player.goals,
      conceed: match.firstTeamGoals,
      yellows: player.yellows,
      reds: player.reds
    };

    if (winner == match.secondTeamId) {
      //gana el 2
      update.win = { increment: 1 };
      create.win = 1;
    } else if (winner == match.firstTeamId) {
      //gana el 1
      update.loose = { increment: 1 };
      create.loose = 1;
    } else if (winner == -1) {
      //empate
      update.draw = { increment: 1 };
      create.draw = 1;
    }
    await prisma.playerStats.upsert({
      where: { playerId: parseInt(player.id) },
      update: update,
      create: create
    });
  });
}
