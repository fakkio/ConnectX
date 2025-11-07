import {debugLog} from "@/helpers/debugLog";
import {produce} from "immer";
import {Board} from "./Board";
import {
  Connect4Error,
  GameState,
  GameStateDraw,
  GameStatePlay,
  GameStateWin,
  Player,
} from "./types";

export class ConnectX {
  #subscribers: Set<() => void> = new Set();
  #gameState: GameState = {
    status: "ready",
  };
  #numCols = 7;
  #numRows = 6;
  #players: Player[] = [];
  #board: Board = null!;

  get gameState(): Readonly<GameState> {
    return this.#gameState;
  }

  private set gameState(
    updater: (
      draft: Omit<GameState, "currentPlayer">,
    ) => void | Omit<GameState, "currentPlayer">,
  ) {
    this.#gameState = produce(
      this.#gameState,
      (draft: Omit<GameState, "currentPlayer">) => {
        const maybeReplacement = updater(draft);

        if (maybeReplacement !== undefined) {
          if (
            maybeReplacement.status === "play" ||
            maybeReplacement.status === "win" ||
            maybeReplacement.status === "draw"
          ) {
            const turn = (maybeReplacement as GameStatePlay).history.length;
            (maybeReplacement as GameStatePlay).currentPlayer =
              this.#players[turn % this.#players.length];
          }
          return maybeReplacement;
        }

        if (
          draft.status === "play" ||
          draft.status === "win" ||
          draft.status === "draw"
        ) {
          const turn = (draft as GameStatePlay | GameStateWin | GameStateDraw)
            .history.length;
          (
            draft as GameStatePlay | GameStateWin | GameStateDraw
          ).currentPlayer = this.#players[turn % this.#players.length];
        }
      },
    );
    this.#notify();
  }

  get players(): Readonly<Player[]> {
    return this.#players;
  }

  subscribe(callback: () => void) {
    this.#subscribers.add(callback);
    return () => {
      this.#subscribers.delete(callback);
    };
  }

  #notify() {
    for (const callback of this.#subscribers) {
      callback();
    }
  }

  async start(players: Player[]) {
    this.#players = players;
    this.gameState = () => {
      this.#board = new Board(this.#numCols, this.#numRows);
      return {
        status: "play",
        history: [],
        players: players,
        board: this.#board.state,
      } as Omit<GameState, "currentPlayer">;
    };

    const gameGenerator = this.turnGenerator();
    for await (const turnResult of gameGenerator) {
    }

    return this.#gameState;
  }

  async *turnGenerator() {
    while (this.#gameState.status === "play") {
      try {
        const player = this.#gameState.currentPlayer;
        if (!player) {
          console.error("No player in current game state");
          break; // Exit the loop without throwing
        }

        const col = await player.move();
        debugLog("Player", player.name, "inserted in column", col);
        this.insert(col);
        debugLog(this.#board.toConsole());

        yield {player, col, gameState: this.#gameState};
      } catch (error) {
        console.error("Error during move:", error);
        break;
      }
    }
  }

  availableColumns(): number[] {
    return this.#board.availableColumns();
  }

  insert(col: number): GameState {
    if (this.#gameState.status !== "play") {
      throw new Connect4Error("Game is already finished");
    }
    const currentPlayer = this.#gameState.currentPlayer;
    if (currentPlayer === null) {
      throw new Connect4Error("No player in current game state");
    }

    const move = this.#board.insert(col, currentPlayer);
    this.gameState = (state) => {
      (state as GameStatePlay).board = this.#board.state;
      (state as GameStatePlay).history.push(move);
    };

    const win = this.#board.checkWin(move);
    if (win) {
      this.gameState = (state) => {
        return {
          ...state,
          status: "win",
          winner: win.winner,
          discsCoordinates: win.discsCoordinates,
        };
      };
    } else if (this.#board.isBoardFull()) {
      this.gameState = (state) => {
        state.status = "draw";
      };
    }

    return this.#gameState;
  }
}
