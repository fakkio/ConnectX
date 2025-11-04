import {Board} from "@/engine/Board";
import {ConnectX} from "@/engine/ConnectX";
import {Tree} from "@/engine/Tree";
import type {Move, PlayerConfigBase} from "./types";
import {Connect4Error, Player} from "./types";

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
    const endTime = Date.now() + this.#timeLimitMS;

    if (this.#game.gameState.status !== "play") {
      throw new Connect4Error("Game is not in play state");
    }

    interface NodeData {
      lastCol: number | null;
      lastPlayer: Player | null;
      played: number;
      wins: number;
    }
    const searchTree = new Tree<NodeData>({
      lastCol: null,
      lastPlayer: null,
      played: 0,
      wins: 0,
    }) as Readonly<Tree<NodeData>>;
    const players = this.#game.players;

    while (Date.now() < endTime) {
      let randomMove: Move;
      let playerIndex = players.findIndex((p) => p === this);
      const board = new Board(
        this.#game.gameState.board.cols,
        this.#game.gameState.board.rows,
        this.#game.gameState.board.grid,
      );
      let currentNode = searchTree;

      do {
        const availableCols = board.availableColumns();
        const randomCol =
          availableCols[Math.floor(Math.random() * availableCols.length)];

        randomMove = board.insert(randomCol, players[playerIndex]);
        const treeNode =
          currentNode.children.find(({data}) => {
            return (
              data.lastCol === randomCol &&
              data.lastPlayer === players[playerIndex]
            );
          }) ??
          currentNode.addChild({
            lastCol: randomCol,
            lastPlayer: players[playerIndex],
            played: 0,
            wins: 0,
          });

        currentNode = treeNode;
        playerIndex = (playerIndex + 1) % players.length;
      } while (!board.isBoardFull() && !board.checkWin(randomMove));

      while (currentNode.parent) {
        currentNode.data.played += 1;
        if (
          board.checkWin(randomMove)?.winner === currentNode.data.lastPlayer
        ) {
          currentNode.data.wins += 1;
        }
        currentNode = currentNode.parent;
      }
    }

    const bestCol = searchTree.children.reduce((best, child) => {
      const childWinRate = child.data.wins / child.data.played;
      const bestWinRate = best.data.wins / best.data.played;

      return childWinRate > bestWinRate ? child : best;
    });
    return bestCol.data.lastCol!;
  }
}
