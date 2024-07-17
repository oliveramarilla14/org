import { prisma } from '../database/database.js';
import { generateFix } from '../functions/fixture.js';

export async function getFecha(req, res) {
  const fecha = parseInt(req.params.fecha);
  try {
    const matches = await prisma.match.findMany({
      where: {
        fecha
      },
      include: {
        FirstTeam: {
          include: {
            players: true
          }
        },
        SecondTeam: {
          include: {
            players: true
          }
        }
      }
    });

    return res.json(matches);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function generateFixture(req, res) {
  const body = req.body;
  const clubs = await prisma.club.findMany();
  const config = await prisma.config.findFirst();

  try {
    if (!config) throw new Error('No existe configuracion');
    if (body.force) {
      await prisma.match.deleteMany();
    } else {
      const matches = await prisma.match.findMany();
      if (matches.length > 0) {
        throw new Error('Ya existen Partidos');
      }
    }

    const fixture = generateFix(clubs, config);
    await prisma.match.createMany({ data: fixture });
    return res.status(201).json(fixture);
  } catch (error) {
    if (error.message === 'Ya existen Partidos') return res.status(409).json({ message: error.message });
    return res.status(500).json({ message: error.message });
  }
}

export async function deleteFixture(req, res) {
  try {
    const deleted = await prisma.match.deleteMany({});

    return res.json(deleted);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}
