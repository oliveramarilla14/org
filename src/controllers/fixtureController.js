import { prisma } from '../database/database.js';
import { generateFix } from '../functions/fixture.js';

export async function getFecha(req, res) {
  const fecha = parseInt(req.params.fecha);
  try {
    const matches = await prisma.match.findMany({
      where: {
        fecha
      }
    });

    return res.json({ matches });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function generateFixture(req, res) {
  const clubs = await prisma.club.findMany();
  const config = await prisma.config.findFirst();

  const fixture = generateFix(clubs, config);

  res.json(fixture);
}
