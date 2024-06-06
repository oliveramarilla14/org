import { format, addMinutes, parse } from 'date-fns';

//leer documentacion
function addMinutesToTime(time, minutes) {
  const parsedTime = parse(time, 'HH:mm', new Date());
  const newTime = addMinutes(parsedTime, minutes);
  return format(newTime, 'HH:mm');
}

export function generateFix(clubs, config) {
  const clubsId = clubs.map((club) => club.name);
  console.log(config);

  if (clubsId.length % 2 !== 0) clubsId.push('descanso');

  const fechas = clubsId.length - 1;
  const fixture = [];
  const { matchStartTime, matchDuration } = config;

  const emparejamientos = generateRoundRobin(clubsId);

  for (let fecha = 0; fecha < fechas; fecha++) {
    let hora = matchStartTime - matchDuration;
    const matches = emparejamientos[fecha];
    matches.sort(function () {
      return Math.random() - 0.5;
    });
    matches.forEach((match) => {
      if (match[0] === 'descanso' || match[1] === 'descanso') return;
      hora = hora = addMinutesToTime(hora, matchDuration);

      fixture.push({ team1: match[0], team2: match[1], fecha: fecha + 1, hora });
    });
  }
  return fixture;
}

function generateRoundRobin(teams) {
  const n = teams.length;
  const partidos = n / 2;
  const emparejamientos = [];

  let teamsCopy = [...teams];

  for (let round = 0; round < n - 1; round++) {
    const roundMatches = [];

    for (let i = 0; i < partidos; i++) {
      roundMatches.push([teamsCopy[i], teamsCopy[n - 1 - i]]);
    }

    emparejamientos.push(roundMatches);

    // Rotar los equipos
    teamsCopy.splice(1, 0, teamsCopy.pop());
  }
  return emparejamientos;
}
