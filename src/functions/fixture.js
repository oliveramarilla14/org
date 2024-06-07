import { UTCDate } from '@date-fns/utc';
import { format, addMinutes, parse, sub } from 'date-fns';

//leer
function addMinutesToTime(time, minutes) {
  const parsed = parse(time, 'HH:mm', new UTCDate());
  const timeZone = new Date().getTimezoneOffset() / 60;
  const date = sub(parsed, { hours: timeZone });
  const newTime = addMinutes(date, minutes);
  return format(newTime, 'HH:mm');
}

export function generateFix(clubs, config) {
  const clubsId = clubs.map((club) => club.id);
  const { matchStartTime, matchDuration } = config;

  if (clubsId.length % 2 !== 0) clubsId.push('descanso');

  const fechas = clubsId.length - 1;
  const fixture = [];

  const emparejamientos = generateRoundRobin(clubsId);

  for (let fecha = 0; fecha < fechas; fecha++) {
    let hora = matchStartTime;
    const matches = emparejamientos[fecha];
    matches.sort(function () {
      return Math.random() - 0.5;
    });
    matches.forEach((match) => {
      if (match[0] === 'descanso' || match[1] === 'descanso') return;

      fixture.push({ firstTeamId: match[0], secondTeamId: match[1], fecha: fecha + 1, hora });

      hora = addMinutesToTime(hora, matchDuration);
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
