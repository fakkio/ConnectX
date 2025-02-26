import type {Player} from "./types";

export class HumanPlayer implements Player {
  #name: string;
  #color: string;

  constructor(name: string, color: string) {
    this.#name = name;
    this.#color = color;
  }

  get color() {
    return this.#color;
  }

  move() {
    return new Promise<number>((resolve) => {
      resolve(2);
    });
  }
}
