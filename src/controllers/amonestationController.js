import { validationResult } from 'express-validator';
import { prisma } from '../database/database.js';

export async function getAmonestations(req, res) {
  //jugador - equipo - razon - sancion (puntos, partidos, etc) - ya se cumplio- obs - pago -fecha creacion
  try {
    const amonestations = await prisma.amonestation.findMany({
      include: {
        Club: true,
        Player: true
      }
    });

    return res.json({ amonestations });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function createAmonestation(req, res) {
  const data = req.body;

  try {
    validationResult(req).throw();

    console.log(data);
    const amonestation = await prisma.amonestation.create({
      data: {
        ...data
      }
    });

    return res.json(amonestation);
  } catch (error) {
    return res.status(500).json({ error: error.mapped() });
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
        console.log('entra');
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
    console.log(error);
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No existe el club' });
    return res.status(500).json(error);
  }
}

export async function editAmonestation(req, res) {}

export async function Amonestation(req, res) {}
