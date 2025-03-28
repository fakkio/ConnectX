import {ConnectX} from "@/engine/ConnectX";
import {Player} from "./types";

export class HumanPlayer implements Player {
  #game: ConnectX;
  #color: string;
  name: string;
  #resolveMove: (col: number) => void = () => {};

  constructor(game: ConnectX, name: string, color: string) {
    this.#game = game;
    this.name = name;
    this.#color = color;
  }

  get color() {
    return this.#color;
  }

  async move() {
    return new Promise<number>((resolve) => {
      this.#resolveMove = resolve;
    });
  }

  handleColumnClick(col: number) {
    this.#resolveMove(col);
  }
}
