import {ConnectX} from "@/engine/ConnectX";
import {Connect4Error, Player} from "./types";

export class RandomPlayer implements Player {
  type = "computer" as const;
  #game: ConnectX;
  #color: string;
  name: string;

  constructor(game: ConnectX, name: string, color: string) {
    this.#game = game;
    this.name = name;
    this.#color = color;
  }

  get color() {
    return this.#color;
  }

  async move() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (this.#game.gameState.status !== "play") {
      throw new Connect4Error("Game is not in play state");
    }

    const availableColumns: number[] = [];

    for (let col = 0; col < this.#game.gameState.board.cols; col += 1) {
      if (
        this.#game.gameState.board.grid[col].length <
        this.#game.gameState.board.rows
      ) {
        availableColumns.push(col);
      }
    }

    // Return random available column
    if (availableColumns.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableColumns.length);
      return Promise.resolve(availableColumns[randomIndex]);
    }

    throw new Connect4Error("No available columns");
  }
}
