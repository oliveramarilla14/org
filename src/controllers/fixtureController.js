import { prisma } from '../database/database.js';
import { numbersArray, randomIntFromInterval } from '../helpers/math.js';

export async function getFecha(req, res) {
  const fecha = parseInt(req.params.fecha);
  try {
    const matches = await prisma.match.findMany({
      where: {
        fecha
      }
    });

    return res.json({ matches });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function generateFixture(req, res) {
  try {
    /* 
    requerimientos
  
    todos los equipos deben jugar contra todos
    por fecha un equipo puede jugar maximo 1 vez
    un equipo puede jugar contra otro solo 1 vez
    la hora de inicio se define por la configuracion
    el horario del partido de define por la hora de inicio y la duracion de cada partido
    */

    const config = await prisma.config.findFirst();
    const clubs = await prisma.club.findMany();

    const fixture = [];

    const fechas = clubs.length;
    const horario = parseInt(config.matchStartTime);
    const duracion = parseInt(config.matchDuration);

    for (let fecha = 1; fecha < fechas; fecha++) {
      let clubsId = clubs.map((club) => club.id);
      let hora = horario - duracion;

      do {
        //encuentra dos equipos al azar
        const team1 = clubsId[randomIntFromInterval(1, clubsId.length)];
        const team2 = clubsId[randomIntFromInterval(1, clubsId.length)];

        // revisa si existe ese partido
        if (!!fixture.find((match) => match.firstTeamId == team1 || match.secondTeamId == team2)) {
          //si existe no continua con ese emparejamiento y vuelve a iniciar el bucle
          continue;
        }

        console.log(team1);
        //borra del array ambos equipos, para no volver a generarle un partido en esta fecha
        clubsId.splice(clubsId.indexOf(team1), 1);
        clubsId.splice(clubsId.indexOf(team2), 1);

        fixture.push({
          firstTeamId: team1,
          secondTeamId: team2,
          fecha: fecha,
          hora: hora + duracion
        });

        hora = hora + duracion;
      } while (clubsId.length > 1);
    }

    res.json({ msg: fixture });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
