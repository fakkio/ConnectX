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

    const availableColumns: number[] = [];
    for (let col = 0; col < this.#game.getGameState().board.cols; col += 1) {
      if (
        this.#game.getGameState().board.grid[col].length <
        this.#game.getGameState().board.rows
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
