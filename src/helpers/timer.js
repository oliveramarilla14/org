export function waitTime(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok');
    }, time);
  });
}
