import {ConnectX} from "@/engine/ConnectX";
import {Connect4Error, Move, Player} from "./types";

export class Board {
  readonly #numCols: number;
  readonly #numRows: number;
  readonly #game: ConnectX;

  constructor(game: ConnectX, numCols: number, numRows: number) {
    this.#numRows = numRows;
    this.#numCols = numCols;
    this.#game = game;
  }

  /**
   * Return a complete 2D representation of the grid where each cell contains a Player or null
   */
  get fullGrid() {
    const fullGrid: (Player | undefined)[][] = Array.from(
      {length: this.#numRows},
      () => Array(this.#numCols).fill(null),
    );

    for (let c = 0; c < this.#numCols; c += 1) {
      for (let r = 0; r < this.#numRows; r += 1) {
        fullGrid[r][c] = this.#game.getGameState().board.grid[c][r] ?? null;
      }
    }

    return fullGrid;
  }

  init() {
    const initGrid: Player[][] = [];
    for (let c = 0; c < this.#numCols; c += 1) {
      initGrid[c] = [];
    }

    this.#game.setGameState((state) => {
      state.board = {cols: this.#numCols, rows: this.#numRows, grid: initGrid};
    });
  }

  insert(col: number, player: Player) {
    if (col < 0 || col >= this.#numCols || col !== Math.floor(col)) {
      throw new Connect4Error(`Invalid column index ${col}`);
    }

    if (this.#game.getGameState().board.grid[col].length >= this.#numRows) {
      throw new Connect4Error(`Column ${col} is full`);
    }

    this.#game.setGameState((state) => {
      state.board.grid[col].push(player);
    });
    console.log("insert", this.#game.getGameState().board.grid);
  }

  checkWin(
    lastMove: Move,
  ): {winner: Player; discsCoordinates: [number, number][]} | null {
    const checkSeries = (
      delta: [number, number],
    ): [col: number, row: number][] | undefined => {
      const {col, player} = lastMove;
      const row = this.#game.getGameState().board.grid[col].length - 1;
      let series: [col: number, row: number][] = [];

      for (let i = -3; i <= series.length; i++) {
        const deltaX = delta[0] * i;
        const deltaY = delta[1] * i;

        if (
          this.#game.getGameState().board.grid?.[col + deltaX]?.[
            row + deltaY
          ] === player
        ) {
          series.push([col + deltaX, row + deltaY]);
        } else {
          series = [];
        }

        if (series.length === 4) {
          return series;
        }
      }
    };

    // top-left tot bottom-right
    let win = checkSeries([1, -1]);
    if (win) {
      return {winner: lastMove.player, discsCoordinates: win};
    }
    // bottom-left tot top-right
    win = checkSeries([1, 1]);
    if (win) {
      return {winner: lastMove.player, discsCoordinates: win};
    }
    // horizontal
    win = checkSeries([1, 0]);
    if (win) {
      return {winner: lastMove.player, discsCoordinates: win};
    }
    // vertical
    win = checkSeries([0, 1]);
    if (win) {
      return {winner: lastMove.player, discsCoordinates: win};
    }

    return null;
  }

  isBoardFull(): boolean {
    return this.#game
      .getGameState()
      .board.grid.every((column) => column.length === this.#numRows);
  }

  toString() {
    const asciiGrid = Array.from({length: this.#numRows}, () =>
      Array(this.#numCols).fill("."),
    );
    for (let c = 0; c < this.#numCols; c += 1) {
      for (let r = 0; r < this.#numRows; r += 1) {
        asciiGrid[this.#numRows - r - 1][c] = this.#game.getGameState().board
          .grid[c][r]
          ? this.#game.getGameState().board.grid[c][r].name
          : ".";
      }
    }
    return asciiGrid.map((row) => row.join(" ")).join("\n");
  }
}
