import { prisma } from '../database/database.js';
import { generatePlayerCuota } from '../functions/generateCuotas.js';

export async function playerStats(req, res) {
  //Jugador - equipo - cantidad (amarillas goles goles en contra) - partidos jugados - promedio cantidad/partido
  try {
    const stats = await prisma.playerStats.findMany({
      include: {
        Player: {
          select: {
            name: true,
            Club: {
              select: { name: true, id: true }
            }
          }
        }
      }
    });

    return res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createPlayer(req, res) {
  const players = req.body;
  const documentNumbers = players.map((player) => player.documentNumber);

  try {
    const existingPlayers = await prisma.player.findMany({
      where: {
        documentNumber: {
          in: documentNumbers
        }
      }
    });
    if (existingPlayers.length > 0) {
      const existingDocumentNumbers = existingPlayers.map((player) => player.documentNumber);
      return res
        .status(409)
        .json({ message: `Los números de documento ${existingDocumentNumbers.join(', ')} ya existen` });
    }

    const createdPlayers = await Promise.all(
      players.map(async (player) => {
        return await prisma.player.create({
          data: {
            name: player.name,
            teamId: player.teamId,
            documentNumber: player.documentNumber,
            promYear: player.promYear,
            phoneNumber: player.phoneNumber,
            Stats: {
              create: {}
            }
          },
          include: {
            Stats: true
          }
        });
      })
    );

    createdPlayers.forEach(async (player) => await generatePlayerCuota(player.id));

    return res.status(201).json(createdPlayers);
  } catch (error) {
    if (error.name === 'PrismaClientValidationError') return res.status(409).json({ message: 'Datos invalidos' });

    return res.status(500).json({ message: error.message });
  }
}

export async function deletePlayer(req, res) {
  const id = parseInt(req.params.id);

  try {
    const player = await prisma.player.delete({ where: { id } });

    return res.status(202).json(player);
  } catch (error) {
    if (error.name === 'PrismaClientValidationError') return res.status(409).json({ message: 'Datos inválidos' });
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe el jugador' });

    res.status(500).json({ message: error.message });
  }
}

export async function Player(req, res) {}
