import type {PlayerConfigBase} from "./types";
import {ConnectX} from "@/engine/ConnectX";
import {Player, Connect4Error} from "./types";

// Config interface local to MonteCarloTreeSearchPlayer module
export interface MonteCarloPlayerConfig extends PlayerConfigBase {
  type: "monte-carlo";
  timeLimitMS?: number;
  simulations?: number;
}

export class MonteCarloTreeSearchPlayer implements Player {
  type = "computer" as const;
  #game: ConnectX;
  #color: string;
  name: string;
  #timeLimitMS: number;

  constructor(game: ConnectX, config: MonteCarloPlayerConfig) {
    this.#game = game;
    this.name = config.name;
    this.#color = config.color;
    this.#timeLimitMS = config?.timeLimitMS ?? 1000;
  }

  get color() {
    return this.#color;
  }

  async move() {
    // Placeholder: respect time limit if provided
    const timeMs = this.#timeLimitMS;
    await new Promise((resolve) => setTimeout(resolve, timeMs));

    if (this.#game.gameState.status !== "play") {
      throw new Connect4Error("Game is not in play state");
    }

    // TODO: implement MCTS using time limit
    //  For now return first available column
    for (let col = 0; col < this.#game.gameState.board.cols; col += 1) {
      if (
        this.#game.gameState.board.grid[col].length <
        this.#game.gameState.board.rows
      ) {
        return col;
      }
    }

    return 0;
  }
}
