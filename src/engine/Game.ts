import {Board} from "./Board";
import {HumanPlayer} from "./HumanPlayer";
import {RandomPlayer} from "./RandomPlayer";
import {Connect4Error, MovesHistory, Player} from "./types";

export class Game {
  #turn: number = 0;
  #history: MovesHistory = [];
  #winner: Player | null = null;
  numCols = 7;
  numRows = 6;
  players = [new HumanPlayer("1", "#ff010b"), new RandomPlayer("2", "#ffd918")];
  board = new Board(this.numCols, this.numRows, this.players);

  get currentPlayer() {
    return this.players[this.#turn % this.players.length];
  }

  insert(col: number) {
    if (this.#winner) {
      throw new Connect4Error("Game is already finished");
    }

    this.board.insert(col, this.currentPlayer);
    const move = {col, player: this.currentPlayer};
    this.#history.push(move);
    this.#turn++;

    const win = this.board.checkWin(move);
    console.log(this.board.toString());
    console.log("win?", this.board.checkWin(move));
    if (win) {
      this.#winner = win.winner;
      console.log(this.#history);
    }

    return win;
  }
}
