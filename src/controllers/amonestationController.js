import { prisma } from '../database/database.js';

export async function getAmonestations(req, res) {
  //jugador - equipo - razon - sancion (puntos, partidos, etc) - ya se cumplio- obs - pago -fecha creacion
  const queryParams = req.query;

  const whereClause = {};
  if (queryParams.name) whereClause.Player = { name: { contains: queryParams.name } };
  if (queryParams.club) whereClause.Club = { name: { contains: queryParams.club } };
  if (queryParams.type) whereClause.type = { contains: queryParams.type };

  try {
    const amonestations = await prisma.amonestation.findMany({
      where: whereClause,
      include: {
        Club: true,
        Player: true
      }
    });
    return res.json(amonestations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createAmonestation(req, res) {
  const data = req.body;

  try {
    const amonestation = await prisma.amonestation.create({
      data: {
        ...data
      }
    });

    return res.status(201).json(amonestation);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function payAmonestation(req, res) {
  const id = parseInt(req.params.id);

  try {
    const amonestation = await prisma.$transaction(async (prismaT) => {
      const actual = await prismaT.amonestation.findFirst({ where: { id: id } });

      if (actual.pointsDeducted && actual.matchesPaid < 1) {
        await prismaT.clubStats.update({
          where: { clubId: actual.clubId },
          data: { points: { decrement: actual.pointsDeducted } }
        });

        const updated = await prismaT.amonestation.update({
          where: { id: actual.id },
          data: {
            matchesToPay: 1,
            matchesPaid: 1
          }
        });

        return updated;
      }

      if (!actual.pointsDeducted && actual.matchesToPay > 0 && actual.matchesPaid < actual.matchesToPay) {
        const updated = await prismaT.amonestation.update({
          where: { id: actual.id },
          data: {
            matchesPaid: { increment: 1 }
          }
        });

        return updated;
      }
    });
    return res.json({ amonestation });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No existe el registro' });
    return res.status(500).json(error);
  }
}

export async function getAmonestation(req, res) {
  const id = parseInt(req.params.id);

  try {
    const amonestation = await prisma.amonestation.findFirst({
      where: { id }
    });

    return res.json(amonestation);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe el registro' });
    return res.status(500).json({ message: error.message });
  }
}

export async function editAmonestation(req, res) {
  const id = parseInt(req.params.id);
  const data = req.body;

  try {
    const amonestation = await prisma.amonestation.update({
      where: { id },
      data: {
        ...data
      }
    });
    return res.json({ amonestation });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe el registro' });
    return res.status(500).json({ message: error.message });
  }
}

export async function deleteAmonestation(req, res) {
  const id = parseInt(req.params.id);

  try {
    const amonestation = await prisma.amonestation.delete({ where: { id } });

    return res.status(202).json(amonestation);
  } catch (error) {
    if (error.name === 'PrismaClientValidationError') return res.status(409).json({ message: 'Datos invalidos' });
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe' });

    res.status(500).json({ message: error.message });
  }
}
