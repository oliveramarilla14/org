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
