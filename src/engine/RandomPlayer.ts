import type {PlayerConfigBase} from "./types";
import {ConnectX} from "@/engine/ConnectX";
import {Connect4Error, Player} from "./types";

// Config interface local to RandomPlayer module
export interface RandomPlayerConfig extends PlayerConfigBase {
  type: "random";
  delayMs?: number;
}

export class RandomPlayer implements Player {
  type = "random" as const;
  #game: ConnectX;
  #color: string;
  name: string;
  #delayMs: number;

  constructor(game: ConnectX, config: RandomPlayerConfig) {
    this.#game = game;
    this.name = config.name;
    this.#color = config.color;
    this.#delayMs = config?.delayMs ?? 300;
  }

  get color() {
    return this.#color;
  }

  async move() {
    await new Promise((resolve) => setTimeout(resolve, this.#delayMs));

    if (this.#game.gameState.status !== "play") {
      throw new Connect4Error("Game is not in play state");
    }

    const availableColumns = this.#game.availableColumns();

    // Return random available column
    if (availableColumns.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableColumns.length);
      return Promise.resolve(availableColumns[randomIndex]);
    }

    throw new Connect4Error("No available columns");
  }
}
