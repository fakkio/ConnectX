import type {Board} from "./Board";
import type {Player} from "./types";

export class RandomPlayer implements Player {
  #color: string;
  name: string;

  constructor(name: string, color: string) {
    this.name = name;
    this.#color = color;
  }

  get color() {
    return this.#color;
  }

  move(board: Board) {
    return Promise.resolve(Math.floor(Math.random() * board.numRows));
  }
}
