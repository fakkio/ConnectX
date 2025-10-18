import {produce} from "immer";
import {Board} from "./Board";
import {Connect4Error, GameState, Player} from "./types";

export class ConnectX {
  #subscribers: Set<() => void> = new Set();
  #gameState: GameState = {
    status: "ready",
    board: {cols: 7, rows: 6, grid: []},
    history: [],
    currentPlayer: null,
  };
  #numCols = 7;
  #numRows = 6;
  #players: Player[] = [];
  #board = new Board(this, this.#numCols, this.#numRows);

  getGameState(): GameState {
    return this.#gameState;
  }

  setGameState(updater: (draft: Omit<GameState, "currentPlayer">) => void) {
    this.#gameState = produce(this.#gameState, (draft) => {
      updater(draft);

      if (
        draft.status === "play" ||
        draft.status === "win" ||
        draft.status === "draw"
      ) {
        const turn = draft.history.length;
        draft.currentPlayer = this.#players[turn % this.#players.length];
      }
    });
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
    this.setGameState((draft) => {
      draft.status = "play";
      draft.history = [];
      draft.board = {cols: this.#numCols, rows: this.#numRows, grid: []};
    });
    this.#board.init();
    this.#notify();

    const gameGenerator = this.turnGenerator();
    for await (const turnResult of gameGenerator) {
      console.log(turnResult);
    }

    console.log(this.getGameState());
    this.#notify();
    return this.getGameState();
  }

  async *turnGenerator() {
    while (this.getGameState().status === "play") {
      try {
        const player = this.getGameState().currentPlayer;
        if (!player) {
          console.error("No player in current game state");
          break; // Exit the loop without throwing
        }

        const col = await player.move();
        console.log("Player", player.name, "inserted in column", col);
        this.insert(col);
        console.log(this.#board.toString());

        yield {player, col, gameState: this.getGameState()};
      } catch (error) {
        console.error("Error during move:", error);
        break;
      }
    }
  }

  insert(col: number): GameState {
    if (this.getGameState().status !== "play") {
      throw new Connect4Error("Game is already finished");
    }
    const currentPlayer = this.getGameState().currentPlayer;
    if (currentPlayer === null) {
      throw new Connect4Error("No player in current game state");
    }

    this.#board.insert(col, currentPlayer);
    const move = {col, player: currentPlayer};
    this.setGameState((state) => {
      state.history.push(move);
    });

    const win = this.#board.checkWin(move);
    if (win) {
      this.setGameState((state) => {
        state.status = "win";
        state.winner = win.winner;
        state.discsCoordinates = win.discsCoordinates;
      });
    } else if (this.#board.isBoardFull()) {
      this.setGameState((state) => {
        state.status = "draw";
      });
    }

    this.#notify();
    return this.#gameState;
  }
}
