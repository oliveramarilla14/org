import { prisma } from '../database/database.js';

export async function getConfig(req, res) {
  const config = await prisma.config.findFirst({ where: { id: 1 } });

  return res.json(config);
}

export async function createConfig(req, res) {
  const data = req.body;
  const config = await prisma.config.create({
    data
  });

  return res.status(201).json(config);
}

export async function editConfig(req, res) {
  const data = req.body;
  const config = await prisma.config.update({
    where: { id: 1 },
    data
  });

  return res.status(201).json(config);
}
