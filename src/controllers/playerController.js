import { prisma } from '../database/database.js';

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

    return res.status(200).json({ stats });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function Player(req, res) {}
