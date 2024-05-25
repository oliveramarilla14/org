import { json } from 'express';
import { prisma } from '../database/database.js';

export async function getClubs(req, res) {
  try {
    const clubs = await prisma.club.findMany();

    return res.json({ clubs });
  } catch (error) {
    return res.json({ error });
  }
}

export async function getClub(req, res) {
  // posicion en tabla, goles, proximo partido, jugadores(goles,partidos,jugados,cuota,tarjetas)
  const id = parseInt(req.params.id);
  const today = new Date();
  try {
    const club = await prisma.club.findFirstOrThrow({
      where: { id },
      include: {
        Stats: true,
        players: {
          include: {
            Stats: true,
            payments: {
              where: {
                type: 'cuota',
                paid: false,
                deadline: {
                  lt: today
                }
              }
            }
          }
        }
      }
    });

    return res.json(club);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No existe el club' });
    return res.json(error);
  }
}

export async function createClub(req, res) {
  const data = req.body;

  try {
    const club = await prisma.club.create({
      data: {
        name: data.name,
        badge: data?.badge,
        inscriptionPayment: data.inscriptionPayment,
        Stats: {
          create: {}
        }
      },
      include: {
        Stats: true
      }
    });
    return res.json(club);
  } catch (error) {
    if (error.name === 'PrismaClientValidationError') return res.status(409).json({ msg: 'Datos invalidos' });
    if (error.code === 'P2002') return res.status(409).json({ msg: `Ya existe el equipo con el nombre ${data.name}` });
    return res.json(error);
  }
}

export async function updateClub(req, res) {
  const id = parseInt(req.params.id);
  const data = req.body;

  try {
    const club = await prisma.club.update({
      where: { id },
      data
    });

    return res.json(club);
  } catch (error) {
    if (error.name === 'PrismaClientValidationError') return res.status(409).json({ msg: 'Datos invalidos' });
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No existe el club' });
    if (error.code === 'P2002') return res.status(409).json({ msg: `Ya existe el equipo con el nombre ${data.name}` });

    res.json(error);
  }
}

export async function deleteClub(req, res) {
  const id = parseInt(req.params.id);

  try {
    const club = await prisma.club.delete({ where: { id } });

    return res.json(club);
  } catch (error) {
    if (error.name === 'PrismaClientValidationError') return res.status(409).json({ msg: 'Datos invalidos' });
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No existe el club' });

    res.json(error);
  }
}
