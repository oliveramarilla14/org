import { prisma } from '../database/database.js';
import { calcClubPositions } from '../functions/generatePositions.js';

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
  ``;
  try {
    if (data.pointsDeducted > 0) {
      await prisma.clubStats.update({
        where: { clubId: data.clubId },
        data: { points: { decrement: data.pointsDeducted } }
      });

      data.paid = true;

      await calcClubPositions();
    }
    const amonestation = await prisma.amonestation.create({
      data: {
        ...data
      }
    });

    return res.status(201).json(amonestation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//Actualizar con nueva columna paid
export async function payAmonestation(req, res) {
  const id = parseInt(req.params.id);

  try {
    const check = await prisma.amonestation.findUniqueOrThrow({
      where: { id }
    });

    if (check.paid) throw new Error('La amonestacion ya se cumplio');
    if (!check.pointsDeducted) throw new Error('No hay puntos para deducir');

    const amonestation = await prisma.$transaction(async (prismaT) => {
      await prismaT.clubStats.update({
        where: {
          clubId: check.clubId
        },
        data: {
          points: {
            decrement: check.pointsDeducted
          }
        }
      });

      return prismaT.amonestation.update({
        where: { id: check.id },
        data: {
          paid: true
        }
      });
    });
    await calcClubPositions();

    return res.json(amonestation);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No existe el registro' });
    return res.status(500).json(error);
  }
}

export async function cancelPayAmonestation(req, res) {
  const id = parseInt(req.params.id);

  try {
    const check = await prisma.amonestation.findUniqueOrThrow({
      where: { id }
    });

    if (!check.paid) throw new Error('La amonestacion aun no se cumplio ');
    if (!check.pointsDeducted) throw new Error('Solo se puede cancelar la deduccion de puntos');

    const amonestation = await prisma.$transaction(async (prismaT) => {
      await prismaT.clubStats.update({
        where: {
          clubId: check.clubId
        },
        data: {
          points: {
            increment: check.pointsDeducted
          }
        }
      });

      return prismaT.amonestation.update({
        where: { id: check.id },
        data: {
          paid: false
        }
      });
    });
    await calcClubPositions();

    return res.json(amonestation);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe el registro' });
    return res.status(500).json({ message: error.message });
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
