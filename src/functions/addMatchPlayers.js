import { prisma } from '../database/database.js';

export async function addMatchPlayers(data) {
  const values1 = data.playersOnMatch.team1.map((stat) => ({
    playerId: parseInt(stat.id),
    clubId: data.match.firstTeamId,

    matchId: data.match.id,
    goals: stat.goals,
    yellow: stat.yellows,
    red: stat.reds
  }));

  const values2 = data.playersOnMatch.team2.map((stat) => ({
    playerId: parseInt(stat.id),
    clubId: data.match.secondTeamId,
    matchId: data.match.id,
    goals: stat.goals,
    yellow: stat.yellows,
    red: stat.reds
  }));

  await prisma.playersOnMatch.createMany({
    data: [...values1, ...values2]
  });
}
