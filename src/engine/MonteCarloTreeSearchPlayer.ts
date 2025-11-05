import {Board} from "@/engine/Board";
import {ConnectX} from "@/engine/ConnectX";
import {Tree} from "@/engine/Tree";
import type {Move, PlayerConfigBase} from "./types";
import {Connect4Error, Player} from "./types";

// Config interface local to MonteCarloTreeSearchPlayer module
export interface MonteCarloPlayerConfig extends PlayerConfigBase {
  type: "monte-carlo";
  timeLimitMS?: number;
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
    if (this.#game.gameState.status !== "play") {
      throw new Connect4Error("Game is not in play state");
    }

    interface NodeData {
      lastCol: number | null;
      lastPlayer: Player | null;
      played: number;
      wins: number;
    }

    const rootData: NodeData = {
      lastCol: null,
      lastPlayer: null,
      played: 0,
      wins: 0,
    };

    const searchTree = new Tree<NodeData>(rootData) as Readonly<Tree<NodeData>>;
    const players = this.#game.players;

    const selfIndex = players.findIndex((p) => p === this);
    if (selfIndex === -1) {
      throw new Connect4Error("Player not found in game players array");
    }

    const startTime = Date.now();
    const endTime = startTime + this.#timeLimitMS;

    const pickRandom = <T>(arr: T[]) =>
      arr[Math.floor(Math.random() * arr.length)];

    while (Date.now() < endTime) {
      const board = new Board(
        this.#game.gameState.board.cols,
        this.#game.gameState.board.rows,
        this.#game.gameState.board.grid,
      );

      let currentNode = searchTree;
      let playerIndex = selfIndex;
      let lastMove: Move | null = null;
      let winResult: {
        winner: Player;
        discsCoordinates: [number, number][];
      } | null = null;

      do {
        const availableCols = board.availableColumns();

        const randomCol = pickRandom(availableCols);
        lastMove = board.insert(randomCol, players[playerIndex]);

        const existingChild = currentNode.children.find(({data}) => {
          return (
            data.lastCol === randomCol &&
            data.lastPlayer === players[playerIndex]
          );
        });

        const treeNode =
          existingChild ??
          currentNode.addChild({
            lastCol: randomCol,
            lastPlayer: players[playerIndex],
            played: 0,
            wins: 0,
          });

        currentNode = treeNode;

        winResult = board.checkWin(lastMove);
        playerIndex = (playerIndex + 1) % players.length;
      } while (!board.isBoardFull() && !winResult);

      while (currentNode.parent) {
        currentNode.data.played += 1;
        if (winResult?.winner === currentNode.data.lastPlayer) {
          currentNode.data.wins += 1;
        }
        currentNode = currentNode.parent;
      }
    }

    const rootChildren = searchTree.children;

    const bestChild = rootChildren.reduce((best, child) => {
      const childPlayed = child.data.played;
      const bestPlayed = best.data.played;

      const childWinRate = childPlayed > 0 ? child.data.wins / childPlayed : 0;
      const bestWinRate = bestPlayed > 0 ? best.data.wins / bestPlayed : 0;

      if (childWinRate > bestWinRate) {
        return child;
      }
      if (childWinRate < bestWinRate) {
        return best;
      }

      // Tie-breaker: prefer the one with more simulations (played)
      if (childPlayed > bestPlayed) {
        return child;
      }
      if (childPlayed < bestPlayed) {
        return best;
      }

      // Final tie-breaker: random
      return Math.random() < 0.5 ? child : best;
    });

    return bestChild.data.lastCol;
  }
}
