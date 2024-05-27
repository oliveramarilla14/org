import { prisma } from '../database/database.js';

export async function getCuotas(req, res) {
  // jugador - equipo - cuotas (pagadas/pendientes)
  //fitro de busqueda para nombre de jugador y nombre de club
  const queryParams = req.query;
  let name = '';
  let club = '';
  let noPaid = false;

  if (queryParams.name) name = queryParams.name;
  if (queryParams.club) club = queryParams.club;

  const whereClause = {
    type: 'cuota',
    Player: { name: { contains: name } },
    Club: { name: { contains: club } }
  };

  if (noPaid) {
    whereClause.paid = false;
  }

  try {
    const cuotas = await prisma.payment.findMany({
      where: whereClause,
      include: {
        Club: true,
        Player: true
      }
    });

    return res.json({ cuotas });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function payCuota(req, res) {
  const id = parseInt(req.params.id);
  try {
    const cuota = await prisma.$transaction(async (prisma) => {
      const check = await prisma.payment.findUniqueOrThrow({
        where: { id }
      });

      if (check.paid) {
        throw new Error('La cuota ya se encuentra pagada');
      }

      return await prisma.payment.update({
        where: { id },
        data: {
          paid: true,
          paydate: new Date()
        }
      });
    });

    return res.status(202).json(cuota);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No se encuentra la cuota' });
    if (error.message === 'La cuota ya se encuentra pagada') return res.status(409).json({ msg: error.message });

    return res.status(500).json(error);
  }
}

export async function cancelPayCuota(req, res) {
  const id = parseInt(req.params.id);

  try {
    const cuota = await prisma.$transaction(async (prismaT) => {
      const check = await prismaT.payment.findUniqueOrThrow({
        where: { id }
      });

      if (!check.paid) throw new Error('La cuota aun no se pago');

      return prismaT.payment.update({
        where: { id },
        data: {
          paid: false,
          paydate: null
        }
      });
    });

    return res.status(202).json({ cuota });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No se encuentra la cuota' });
    if (error.message === 'La cuota aun no se pago') return res.status(409).json({ msg: error.message });
    res.status(500).json(error);
  }
}

export async function getCuota(req, res) {}
