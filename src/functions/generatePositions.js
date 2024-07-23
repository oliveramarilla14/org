import { prisma } from '../database/database.js';

export const calcClubPositions = async () => {
  const stats = await prisma.clubStats.findMany();
  console.log('entra');

  /*
  criterios
  - puntos
  - diferencia de goles
  - goles a favor
  - goles en contra
  */
  stats.sort((a, b) => {
    if (a.points !== b.points) {
      return b.points - a.points;
    } else if (a.goals - a.conceed !== b.goals - b.conceed) {
      return b.goals - b.conceed - (a.goals - a.conceed);
    } else if (a.goals !== b.goals) {
      return b.goals - a.goals;
    } else {
      return a.conceed - b.conceed;
    }
  });
  stats.forEach(async (team, index) => {
    const position = index + 1;
    const newStat = await prisma.clubStats.update({
      where: { clubId: team.clubId },
      data: {
        position
      }
    });

    console.log(newStat);
  });
};

export const calcGoalscorerPositions = async () => {
  const stats = await prisma.playerStats.findMany();

  stats.sort((a, b) => {
    if (a.goals !== b.goals) {
      return b.goals - a.goals;
    } else {
      return a.played - b.played;
    }
  });

  stats.forEach(async (player, index) => {
    const position = index + 1;
    await prisma.playerStats.update({
      where: { playerId: player.playerId },
      data: {
        goalscorer: position
      }
    });
  });
};
