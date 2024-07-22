import { prisma } from '../database/database.js';
import { handleCreateAmonestations } from '../functions/addAmonestations.js';
import { addMatchPlayers } from '../functions/addMatchPlayers.js';
import addPlayerStats from '../functions/addPlayerStats.js';
import { calcClubPositions, calcGoalscorerPositions } from '../functions/generatePositions.js';
import { addStats } from '../functions/stats.js';

export async function getMatches(req, res) {
  try {
    const matches = await prisma.match.findMany({
      include: {
        FirstTeam: true,
        SecondTeam: true
      }
    });

    return res.json(matches);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//deberia crear un paid en amonestations, para poder filtrar bien
export async function getMatch(req, res) {
  const id = parseInt(req.params.id);
  const today = new Date();

  const teamQuery = {
    include: {
      players: {
        include: {
          payments: {
            where: {
              paid: false,
              deadline: {
                lt: today
              }
            }
          },
          amonestations: {
            where: {
              paid: false
            }
          }
        }
      }
    }
  };
  try {
    const match = await prisma.match.findFirstOrThrow({
      where: { id },
      include: {
        FirstTeam: teamQuery,
        SecondTeam: teamQuery
      }
    });

    if (match.result) {
      const playersOnMatch = await prisma.playersOnMatch.findMany({
        where: {
          matchId: match.id
        },
        include: {
          Player: true
        }
      });

      const team1 = playersOnMatch.filter((player) => player.clubId === match.firstTeamId);
      const team2 = playersOnMatch.filter((player) => player.clubId === match.secondTeamId);

      match.team1 = team1;
      match.team2 = team2;
    }

    return res.json(match);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe el partido' });
    return res.status(500).json({ message: error.message });
  }
}

export async function createMatch(req, res) {
  const data = req.body;

  try {
    const match = await prisma.match.create({ data });

    return res.status(201).json({ match });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
export async function editMatch(req, res) {
  const id = parseInt(req.params.id);
  const data = req.body;
  try {
    const match = await prisma.match.update({
      where: { id },
      data
    });
    return res.status(202).json(match);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe el partido' });
    return res.status(500).json({ message: error.message });
  }
}
export async function deleteMatch(req, res) {
  const id = parseInt(req.params.id);

  try {
    const match = await prisma.match.delete({ where: { id } });
    return res.status(202).json({ match });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe el partido' });
    return res.status(500).json({ message: error.message });
  }
}

export async function finishMatch(req, res) {
  const data = req.body;
  const { match } = data;
  let winner;

  if (match.firstTeamGoals === match.secondTeamGoals) {
    winner = -1;
  } else {
    winner = match.firstTeamGoals > match.secondTeamGoals ? match.firstTeamId : match.secondTeamId;
  }

  try {
    const partido = await prisma.match.update({
      where: {
        id: match.id
      },
      data: {
        firstTeamGoals: match.firstTeamGoals,
        secondTeamGoals: match.secondTeamGoals,
        result: winner
      }
    });

    await addStats(data, winner);
    await addMatchPlayers(data);
    await addPlayerStats(data, winner);
    await handleCreateAmonestations(data);
    await calcClubPositions();
    await calcGoalscorerPositions();

    return res.status(202).json(partido);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
