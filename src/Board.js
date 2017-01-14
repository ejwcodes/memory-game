import React from 'react';
import Square from './Square.js';

class Board extends React.Component {
	constructor() {
		super();
		this.state = {
			xIsNext : true,
			squares: Array(9).fill(null)
		}
	}
	handleClick(i) {
		
		const squares = this.state.squares.slice();
		const winner = calculateWinner(squares);
		//if someone won or if a square has a value, return 
		if (winner || squares[i]) {
			return;
		}
		let xIsNext = this.state.xIsNext;
		squares[i] = xIsNext ? 'X' : 'O';
		this.setState({
			squares: squares,
			xIsNext : !this.state.xIsNext
		});
	}
	
	renderSquare(i) {
		return <Square value={this.state.squares[i]} 
						onClick={() => this.handleClick(i)}/>;
	}
	
	startGameOver() {
		this.setState({
			squares: Array(9).fill(null)
		});
	}
	
	render() {
		const squares = this.state.squares.slice();
		const winner = calculateWinner(squares);
		let status;
		if (winner) {
			status = 'Winner: ' + winner;
			
		} else {
			status = 'Next player: ';
			if (this.state.xIsNext) {
				status += 'X';
			} else {
				status += 'O';
			}
		}
		
		
		return (
		  <div>
			<div className="status">{status}</div>
			<div className="board-row">
			  {this.renderSquare(0)}
			  {this.renderSquare(1)}
			  {this.renderSquare(2)}
			</div>
			<div className="board-row">
			  {this.renderSquare(3)}
			  {this.renderSquare(4)}
			  {this.renderSquare(5)}
			</div>
			<div className="board-row">
			  {this.renderSquare(6)}
			  {this.renderSquare(7)}
			  {this.renderSquare(8)}
			</div>
			<button hidden={!winner} 
				onClick={this.startGameOver.bind(this)}>Start Over</button>
		  </div>
		);
	}
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Board;