import { prisma } from '../database/database.js';

export async function getCuotas(req, res) {
  // jugador - equipo - cuotas (pagadas/pendientes)
  //fitro de busqueda para nombre de jugador y nombre de club
  const queryParams = req.query;
  //refactor esta parte como amonestation controller

  let noPaid = false;

  const whereClause = {
    type: 'cuota'
  };

  if (queryParams.name) whereClause.Player = { name: { contains: queryParams.name } };
  if (queryParams.club) whereClause.Club = { name: { contains: queryParams.club } };

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

    return res.json(cuotas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createCuota(req, res) {
  const config = await prisma.config.findFirst({ where: { id: 1 } });
  const data = req.body;
  const precio = config.monthSocialPrice;
  const vencimiento = new Date(`${config.monthSocialPayDay}-${data.month}-2024`);

  try {
    const cuota = await prisma.payment.create({
      data: {
        clubId: data.club,
        playerId: data.player,
        type: 'cuota',
        deadline: vencimiento,
        price: precio
      }
    });
    return res.status(201).json(cuota);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    if (error.message === 'La cuota ya se encuentra pagada') return res.status(409).json({ message: error.message });

    return res.status(500).json({ message: error.message });
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
    if (error.code === 'P2025') return res.status(404).json({ message: 'No se encuentra la cuota' });
    if (error.message === 'La cuota aun no se pago') return res.status(409).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
}

export async function getMultas(req, res) {
  const queryParams = req.query;
  //refactor esta parte como amonestation controller

  let noPaid = false;

  const whereClause = {
    NOT: {
      type: 'cuota'
    }
  };
  if (queryParams.name) whereClause.Player = { name: { contains: queryParams.name } };
  if (queryParams.club) whereClause.Club = { name: { contains: queryParams.club } };

  if (noPaid) {
    whereClause.paid = false;
  }

  try {
    const multas = await prisma.payment.findMany({
      where: whereClause,
      include: {
        Club: true,
        Player: true
      }
    });

    return res.json(multas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getMulta(req, res) {
  const { id } = req.params;

  try {
    const multas = await prisma.payment.findFirst({
      where: {
        id: parseInt(id)
      },
      include: {
        Club: true,
        Player: true
      }
    });

    return res.json(multas);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe el pago' });
    return res.status(500).json({ message: error.message });
  }
}

export async function createMulta(req, res) {
  const data = req.body;

  try {
    const multa = await prisma.payment.create({
      data: {
        ...data
      }
    });

    return res.status(201).json(multa);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function editMulta(req, res) {
  const id = parseInt(req.params.id);
  const data = req.body;

  try {
    const multa = await prisma.payment.update({
      where: { id },
      data
    });

    return res.status(202).json(multa);
  } catch (error) {
    if (error.name === 'PrismaClientValidationError') return res.status(409).json({ message: 'Datos invalidos' });
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe el club' });
    res.status(500).json({ message: error.message });
  }
}

export async function deleteMulta(req, res) {
  const id = parseInt(req.params.id);
  try {
    const multa = await prisma.payment.delete({ where: { id } });

    return res.status(202).json(multa);
  } catch (error) {
    if (error.name === 'PrismaClientValidationError') return res.status(409).json({ message: 'Datos invalidos' });
    if (error.code === 'P2025') return res.status(404).json({ message: 'No existe' });

    res.status(500).json({ message: error.message });
  }
}
export async function payMulta(req, res) {
  const id = parseInt(req.params.id);
  try {
    const multa = await prisma.$transaction(async (prisma) => {
      const check = await prisma.payment.findUniqueOrThrow({
        where: { id }
      });

      if (check.paid) {
        throw new Error('La multa ya se encuentra pagada');
      }

      return await prisma.payment.update({
        where: { id },
        data: {
          paid: true,
          paydate: new Date()
        }
      });
    });

    return res.status(202).json(multa);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No se encuentra la multa' });
    if (error.message === 'La multa ya se encuentra pagada') return res.status(409).json({ msg: error.message });

    res.status(500).json({ message: error.message });
  }
}

export async function cancelPayMulta(req, res) {
  const id = parseInt(req.params.id);

  try {
    const multa = await prisma.$transaction(async (prismaT) => {
      const check = await prismaT.payment.findUniqueOrThrow({
        where: { id }
      });

      if (!check.paid) throw new Error('La multa aun no se pago');

      return prismaT.payment.update({
        where: { id },
        data: {
          paid: false,
          paydate: null
        }
      });
    });

    return res.status(202).json({ multa });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ msg: 'No se encuentra la multa' });
    if (error.message === 'La multa aun no se pago') return res.status(409).json({ msg: error.message });
    res.status(500).json(error);
  }
}
