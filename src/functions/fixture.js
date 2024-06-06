export function generateFix(clubs) {
  const clubsId = clubs.map((club) => club.name);
  // const clubsId = [1, 2, 3, 4, 5];

  if (clubsId.length % 2 !== 0) clubsId.push('descanso');

  const fechas = clubsId.length - 1;
  const fixture = [];

  // Generar las rotaciones de acuerdo al algoritmo round-robin
  const emparejamientos = generateRoundRobin(clubsId);

  for (let fecha = 0; fecha < fechas; fecha++) {
    const matches = emparejamientos[fecha];
    matches.sort(function () {
      return Math.random() - 0.5;
    });
    matches.forEach((match) => {
      if (match[0] === 'descanso' || match[1] === 'descanso') return;
      fixture.push({ team1: match[0], team2: match[1], fecha: fecha + 1 });
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
