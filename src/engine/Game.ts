import {Board} from "./Board";
import {HumanPlayer} from "./HumanPlayer";
import {RandomPlayer} from "./RandomPlayer";
import {Connect4Error, GameState} from "./types";

const initialState: GameState = {status: "play", history: []};

export class Game {
  #turn: number = 0;
  #gameState: GameState = {status: "ready"};
  numCols = 7;
  numRows = 6;
  players = [new HumanPlayer("1", "#ff010b"), new RandomPlayer("2", "#ffd918")];
  board = new Board(this.numCols, this.numRows, this.players);

  get currentPlayer() {
    return this.players[this.#turn % this.players.length];
  }

  async start() {
    this.#turn = 0;
    this.#gameState = initialState;
    this.board = new Board(this.numCols, this.numRows, this.players);

    const gameGenerator = this.turnGenerator();
    for await (const turnResult of gameGenerator) {
      console.log(turnResult);
    }

    console.log(this.#gameState);
    return this.#gameState;
  }

  async *turnGenerator() {
    while (this.#gameState.status === "play") {
      try {
        const player = this.currentPlayer;

        const col = await player.move(this.board);
        console.log("Player", player.name, "inserted in column", col);
        console.log(this.board.toString());
        this.insert(col);

        yield {player, col, gameState: this.#gameState};
      } catch (error) {
        console.error("Error during move:", error);
        break;
      }
    }
  }

  insert(col: number): GameState {
    if (this.#gameState.status !== "play") {
      throw new Connect4Error("Game is already finished");
    }

    this.board.insert(col, this.currentPlayer);
    const move = {col, player: this.currentPlayer};
    this.#gameState.history.push(move);
    this.#turn++;

    const win = this.board.checkWin(move);
    if (win) {
      this.#gameState = {
        ...this.#gameState,
        status: "win",
        winner: win.winner,
        discsCoordinates: win.discsCoordinates,
      };
    } else if (this.board.isBoardFull()) {
      this.#gameState = {...this.#gameState, status: "draw"};
    }

    return this.#gameState;
  }
}
