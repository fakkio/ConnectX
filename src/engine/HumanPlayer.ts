import type {Player} from "./types";

export class HumanPlayer implements Player {
  #color: string;
  name: string;

  constructor(name: string, color: string) {
    this.name = name;
    this.#color = color;
  }

  get color() {
    return this.#color;
  }

  move() {
    return new Promise<number>((resolve) => {
      process.stdin.once("data", (chunk) => {
        const col = Number(chunk.toString());
        resolve(col);
      });
    });
  }
}
