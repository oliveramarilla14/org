import { prisma } from '../database/database.js';

export async function generateMonthlyCuota() {
  const config = await prisma.config.findFirst({ where: { id: 1 } });
  const actualMonth = new Date().getMonth() + 1;

  const precio = config.monthSocialPrice;
  const vencimiento = new Date(`${actualMonth}-${config.monthSocialPayDay}-2024`);

  try {
    const players = await prisma.player.findMany();

    const data = players.map((player) => ({
      clubId: player.teamId,
      playerId: player.id,
      type: 'cuota',
      deadline: vencimiento,
      price: precio
    }));

    await prisma.payment.createMany({
      data
    });
  } catch (error) {
    console.log(error);
  }
}

export async function generatePlayerCuota(playerId) {
  const config = await prisma.config.findFirst({ where: { id: 1 } });
  const player = await prisma.player.findFirst({ where: { id: playerId } });
  const actualMonth = new Date().getMonth() + 1;
  const precio = config.monthSocialPrice;
  const data = [];

  for (let i = 0; i < 6; i++) {
    //genera 6 cuotas
    const cuota = {
      clubId: player.teamId,
      playerId: player.id,
      type: 'cuota',
      deadline: new Date(`${actualMonth + i}-${config.monthSocialPayDay}-2024`),
      price: precio
    };

    data.push(cuota);
  }
  await prisma.payment.createMany({
    data
  });
}
