import { prisma } from '../database/database.js';

export async function addStats(data, winner) {
  const { match, playersOnMatch } = data;

  const data1 = {
    played: {
      increment: 1
    },
    goals: {
      increment: match.firstTeamGoals
    },
    conceed: {
      increment: match.secondTeamGoals
    },
    yellows: {
      increment: playersOnMatch.team1.reduce((sum, player) => sum + player.yellows, 0)
    },
    reds: {
      increment: playersOnMatch.team1.reduce((sum, player) => sum + player.reds, 0)
    }
  };

  const data2 = {
    played: {
      increment: 1
    },
    goals: {
      increment: match.secondTeamGoals
    },
    conceed: {
      increment: match.firstTeamGoals
    },
    yellows: {
      increment: playersOnMatch.team2.reduce((sum, player) => sum + player.yellows, 0)
    },
    reds: {
      increment: playersOnMatch.team2.reduce((sum, player) => sum + player.reds, 0)
    }
  };

  if (winner == match.firstTeamId) {
    //gana el 1
    data1.points = { increment: 3 };
    data1.win = { increment: 1 };

    data2.loose = { increment: 1 };
  } else if (winner == match.secondTeamId) {
    //gana el 2
    data2.points = { increment: 3 };
    data2.win = { increment: 1 };

    data1.loose = { increment: 1 };
  } else if (winner == -1) {
    //empate
    data1.points = { increment: 1 };
    data2.points = { increment: 1 };

    data1.draw = { increment: 1 };
    data2.draw = { increment: 1 };
  }

  await prisma.clubStats.update({
    where: {
      clubId: match.firstTeamId
    },
    data: data1
  });

  await prisma.clubStats.update({
    where: {
      clubId: match.secondTeamId
    },
    data: data2
  });
}
