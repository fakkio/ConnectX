import {Board} from "@/engine/Board";
import {ConnectX} from "@/engine/ConnectX";
import {Tree} from "@/engine/Tree";
import {debugLog} from "@/helpers/debugLog";
import {runTimeSliced} from "@/helpers/timeSlicer";
import chalk from "chalk";
import type {GameStatePlay, Move, PlayerConfigBase} from "./types";
import {Connect4Error, Player} from "./types";

export interface MonteCarloUCTPlayerConfig extends PlayerConfigBase {
  type: "monte-carlo-uct";
  timeLimitMS?: number;
  explorationParameter?: number;
}

interface NodeData {
  lastCol: number | null;
  lastPlayer: Player | null;
  played: number;
  wins: number;
}

export class MonteCarloTreeSearchPlayerV2 implements Player {
  type = "monte-carlo-uct" as const;
  readonly name: string;
  readonly #game: ConnectX;
  readonly #color: string;
  readonly #timeLimitMS: number;
  readonly #explorationParameter: number;

  constructor(game: ConnectX, config: MonteCarloUCTPlayerConfig) {
    this.#game = game;
    this.name = config.name;
    this.#color = config.color;
    this.#timeLimitMS = config.timeLimitMS ?? 1000;
    this.#explorationParameter = config.explorationParameter ?? Math.sqrt(2);
  }

  get color() {
    return this.#color;
  }

  #expandNode(
    node: Readonly<Tree<NodeData>>,
    playerIndex: number,
    board: Board,
  ) {
    const availableCols = board.availableColumns();
    for (const col of availableCols) {
      node.addChild({
        lastCol: col,
        lastPlayer: this.#game.players[playerIndex],
        played: 0,
        wins: 0,
      });
    }
  }

  #selectChildByUCT(node: Readonly<Tree<NodeData>>) {
    // UCT Selection
    // (wins / played) + explorationParameter * sqrt(ln(totalSimulations) / played)
    const totalSimulations = node.data.played;
    const uctValues = node.children.map((child) => {
      if (child.data.played === 0) {
        return Infinity;
      }

      const winRate = child.data.wins / child.data.played;
      const explorationTerm = Math.sqrt(
        Math.log(totalSimulations) / child.data.played,
      );

      return winRate + this.#explorationParameter * explorationTerm;
    });

    const maxUct = Math.max(...uctValues);
    const bestChildren = node.children.filter(
      (_, index) => uctValues[index] === maxUct,
    );
    return bestChildren[Math.floor(Math.random() * bestChildren.length)];
  }

  #backpropagate(
    node: Readonly<Tree<NodeData>> | null,
    winResult: {winner: Player; discsCoordinates: [number, number][]} | null,
  ) {
    let current = node;
    while (current) {
      current.data.played += 1;
      if (winResult?.winner === current.data.lastPlayer) {
        current.data.wins += 1;
      }
      current = current.parent;
    }
  }

  #getBestMove(root: Readonly<Tree<NodeData>>): Readonly<Tree<NodeData>> {
    return root.children.reduce((best, child) => {
      const childWinRate =
        child.data.played > 0 ? child.data.wins / child.data.played : -1;
      const bestWinRate =
        best.data.played > 0 ? best.data.wins / best.data.played : -1;

      if (childWinRate > bestWinRate) {
        return child;
      }
      if (childWinRate < bestWinRate) {
        return best;
      }

      // Tie-breaker 1: prefer more simulations
      if (child.data.played > best.data.played) {
        return child;
      }
      if (child.data.played < best.data.played) {
        return best;
      }

      // Tie-breaker 2: random
      return Math.random() < 0.5 ? child : best;
    });
  }

  async move() {
    const startTime = Date.now();
    let iterations = 0;

    if (this.#game.gameState.status !== "play") {
      throw new Connect4Error("Game is not in play state");
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

    const gameStatePlay = this.#game.gameState as GameStatePlay;
    const initialBoardState = gameStatePlay.board;

    const iterate = async () => {
      iterations += 1;

      const board = Board.fromState(initialBoardState);

      let currentNode = searchTree;
      let playerIndex = selfIndex;
      let lastMove: Move | null = null;
      let winResult: {
        winner: Player;
        discsCoordinates: [number, number][];
      } | null = null;

      do {
        // Create child nodes for all possible moves if not already created
        if (currentNode.children.length === 0) {
          this.#expandNode(currentNode, playerIndex, board);
        }

        // select next child via UCT
        currentNode = this.#selectChildByUCT(currentNode);

        // Play the selected move
        lastMove = board.insert(
          currentNode.data.lastCol!,
          players[playerIndex],
        );

        winResult = board.checkWin(lastMove);
        playerIndex = (playerIndex + 1) % players.length;
      } while (!board.isBoardFull() && !winResult);

      this.#backpropagate(currentNode, winResult);
    };

    await runTimeSliced(iterate, this.#timeLimitMS);
    debugLog(searchTree);

    const bestChild = this.#getBestMove(searchTree);

    debugLog(
      Array(this.#game.gameState.board.cols)
        .fill("")
        .map((_, index) => {
          const nthChild = searchTree.children.find(
            (child) => child.data.lastCol === index,
          );
          if (!nthChild) {
            return "---";
          }

          const score = nthChild.data.wins / nthChild.data.played;
          const bestScore = bestChild.data.wins / bestChild.data.played;

          return score === bestScore
            ? chalk.underline(score.toFixed(2))
            : score.toFixed(2);
        })
        .join(" "),
    );
    debugLog(
      `Computed ${iterations} iterations in ${Date.now() - startTime} ms`,
    );

    return bestChild.data.lastCol!;
  }
}
