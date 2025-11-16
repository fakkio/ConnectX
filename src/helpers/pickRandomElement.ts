export const pickRandomElement = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];
