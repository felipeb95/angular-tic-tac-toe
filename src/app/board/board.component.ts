import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  squares: any[];
  xIsNext: boolean;
  winner: string;

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
    this.aiMoves();
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number) {
    if (!this.squares[idx] && !this.winner) {
      this.squares.splice(idx, 1, this.player);
      this.winner = this.calculateWinner(this.squares);
      this.xIsNext = !this.xIsNext;
    }
    if (this.xIsNext && !this.winner) {
      this.aiMoves();
      this.winner = this.calculateWinner(this.squares);
    }
  }

  aiMoves() {
    let bestScore = -Infinity;
    let bestMove: number;
    let idx = 0;
    for (const square of this.squares) {
      if (!square) {
        this.squares.splice(idx, 1, this.player);
        const score = this.minimax([...this.squares], 0, false);
        this.squares.splice(idx, 1, null);
        if (score > bestScore) {
          bestScore = score;
          bestMove = idx;
        }
      }
      idx++;
    }
    this.squares.splice(bestMove, 1, this.player);
    this.xIsNext = !this.xIsNext;
  }

  minimax(squares: any[], depth: number, isMaximizing: boolean): number {
    const winner = this.calculateWinner(squares);
    if (winner === 'X') {
      return 10;
    }
    if (winner === 'O') {
      return -10;
    }
    if (winner === 'tie') {
      return 0;
    }
    if (isMaximizing) {
      let idx = 0;
      let bestScore = -Infinity;
      for (const square of squares) {
        if (!square) {
          squares[idx] = 'X';
          const score = this.minimax([...squares], depth + 1, false);
          squares[idx] = null;
          if (score > bestScore) {
            bestScore = score;
          }
        }
        idx++;
      }
      return bestScore;
    } else {
      let idx = 0;
      let bestScore = Infinity;
      for (const square of squares) {
        if (!square) {
          squares[idx] = 'O';
          const score = this.minimax([...squares], depth + 1, true);
          squares[idx] = null;
          if (score < bestScore) {
            bestScore = score;
          }
        }
        idx++;
      }
      return bestScore;
    }
  }

  calculateWinner(squares: any[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) {
      return 'tie';
    }
    return null;
  }

}
