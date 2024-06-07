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
  const body = req.body;
  const clubs = await prisma.club.findMany();
  const config = await prisma.config.findFirst();

  try {
    if (body.force) {
      await prisma.match.deleteMany();
    } else {
      const matches = await prisma.match.findMany();
      if (matches.length > 0) throw new Error('Ya existe un fixture');
    }

    const fixture = generateFix(clubs, config);
    await prisma.match.createMany({ data: fixture });
    return res.status(201).json(fixture);
  } catch (error) {
    if ((error.message = 'Ya existe un fixture')) return res.status(409).json({ error: error.message });
    return res.status(500).json({ error });
  }
}
