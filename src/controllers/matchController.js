import { prisma } from '../database/database.js';

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

export async function getMatch(req, res) {
  const id = parseInt(req.params.id);
  try {
    const match = await prisma.match.findFirstOrThrow({ where: { id } });

    return res.json({ match });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No existe el partido' });
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
