import type {PlayerConfigBase} from "./types";
import {ConnectX} from "@/engine/ConnectX";
import {Player} from "./types";

// Config interface local to HumanPlayer module
export interface HumanPlayerConfig extends PlayerConfigBase {
  type: "human";
}

export class HumanPlayer implements Player {
  type = "human" as const;
  #game: ConnectX;
  #color: string;
  name: string;
  #resolveMove: (col: number) => void = () => {};

  constructor(game: ConnectX, config: HumanPlayerConfig) {
    this.#game = game;
    this.name = config.name;
    this.#color = config.color;
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
