export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function numbersArray(numero) {
  const array = [];

  for (let i = 1; i <= numero; i++) {
    array.push(i);
  }

  return array;
}

export function randomFromArray(array) {
  if (!Array.isArray(array) || array.length === 0) {
    throw new Error('El parámetro debe ser un array no vacío');
  }

  const indiceAleatorio = Math.floor(Math.random() * array.length);

  return array[indiceAleatorio];
}
