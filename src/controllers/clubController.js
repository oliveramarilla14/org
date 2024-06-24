import { prisma } from '../database/database.js';
import { waitTime } from '../helpers/timer.js';
import { stringBoolean } from '../helpers/casting.js';

export async function getClubs(req, res) {
  try {
    const clubs = await prisma.club.findMany();

    return res.json(clubs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getClub(req, res) {
  // posicion en tabla, goles, proximo partido, jugadores(goles,partidos,jugados,cuota,tarjetas)
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(406).json({ message: 'Id invalido' });
  }

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
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe el club' });
    return res.status(500).json({ message: error.message });
  }
}

export async function createClub(req, res) {
  const data = req.body;

  try {
    const club = await prisma.club.create({
      data: {
        name: data.name,
        badge: req.file && req.file.filename,
        inscriptionPayment: stringBoolean(data.payment),
        Stats: {
          create: {}
        }
      },
      include: {
        Stats: true
      }
    });
    return res.status(201).json(club);
  } catch (error) {
    if (error.name === 'PrismaClientValidationError') return res.status(409).json({ message: 'Datos invalidos' });
    if (error.code === 'P2002')
      return res.status(409).json({ message: `Ya existe el equipo con el nombre ${data.name}` });
    return res.status(500).json({ message: error.message });
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

    return res.status(202).json(club);
  } catch (error) {
    if (error.name === 'PrismaClientValidationError') return res.status(409).json({ msg: 'Datos invalidos' });
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No existe el club' });
    if (error.code === 'P2002') return res.status(409).json({ msg: `Ya existe el equipo con el nombre ${data.name}` });

    res.status(500).json(error);
  }
}

export async function deleteClub(req, res) {
  const id = parseInt(req.params.id);

  try {
    const club = await prisma.club.delete({ where: { id } });

    return res.status(202).json(club);
  } catch (error) {
    if (error.name === 'PrismaClientValidationError') return res.status(409).json({ msg: 'Datos inválidos' });
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No existe el club' });

    res.status(500).json(error);
  }
}

export async function clubPositions(req, res) {
  //posición - equipo(link al perfil del equipo)- Puntos - Partidos (jugados - GEP - GF -GC -DF
  try {
    const stats = await prisma.clubStats.findMany({
      include: {
        Club: {
          select: {
            name: true,
            badge: true
          }
        }
      }
    });

    return res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error al intentar obtener las posiciones',
      debugMessage: error.message
    });
  }
}
