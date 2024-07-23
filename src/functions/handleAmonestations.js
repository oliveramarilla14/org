import { add } from 'date-fns';
import { prisma } from '../database/database.js';

export async function handleCreateAmonestations({ playersOnMatch, match }) {
  playersOnMatch.team1.forEach(async (player) => await handleCards(player, match, 'firstTeamId'));
  playersOnMatch.team2.forEach(async (player) => await handleCards(player, match, 'secondTeamId'));
}

export async function handleMatchesAmonestations({ match }) {
  const players1 = await prisma.player.findMany({
    where: {
      teamId: match.firstTeamId
    },
    include: {
      amonestations: {
        where: {
          paid: false
        }
      }
    }
  });

  const players2 = await prisma.player.findMany({
    where: {
      teamId: match.secondTeamId
    },
    include: {
      amonestations: {
        where: {
          paid: false
        }
      }
    }
  });
  const allPlayers = [...players1, ...players2];

  allPlayers.forEach((player) => {
    player.amonestations.forEach(async (amonestation) => {
      if (amonestation.matchesToPay > 0 && amonestation.matchesPaid < amonestation.matchesToPay) {
        const newMatchPaid = amonestation.matchesPaid + 1;
        const data = {
          matchesPaid: newMatchPaid
        };

        if (newMatchPaid === amonestation.matchesToPay) {
          data.paid = true;
        }

        await prisma.amonestation.update({
          where: { id: amonestation.id },
          data
        });
      }
    });
  });
}

async function handleCards(player, match, team) {
  const config = await prisma.config.findFirst();

  const tomorrow = add(new Date(), { days: 1 });
  const playerYellows = await prisma.payment.findMany({
    where: {
      playerId: parseInt(player.id),
      type: 'amarilla'
    }
  });

  if (player.yellows > 0) {
    let payment;
    for (let index = 0; index < player.yellows; index++) {
      payment = await prisma.payment.create({
        data: {
          type: 'amarilla',
          clubId: match[team],
          playerId: parseInt(player.id),
          price: config.yellowCardPrice,
          deadline: tomorrow
        }
      });
    }

    if (playerYellows.length > 0 && (playerYellows.length + player.yellows) % config.yellowAmountToMatch === 0) {
      await prisma.amonestation.create({
        data: {
          playerId: parseInt(player.id),
          clubId: match[team],
          paymentId: payment.id,
          type: 'amarilla',
          matchesToPay: config.yellowCardMatches
        }
      });
    }
  }

  if (player.reds > 0) {
    const payment = await prisma.payment.create({
      data: {
        type: 'roja',
        clubId: match[team],
        playerId: parseInt(player.id),
        price: config.redCardPrice,
        deadline: tomorrow
      }
    });

    await prisma.amonestation.create({
      data: {
        playerId: parseInt(player.id),
        clubId: match[team],
        paymentId: payment.id,
        type: 'roja',
        matchesToPay: config.redCardMatches
      }
    });
  }
}
