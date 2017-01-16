import React from 'react';
import Square from './Square.js';
import { Button } from 'react-bootstrap';

const game_height = 4;
const game_width = 6;
	
class Board extends React.Component {
	
	
	constructor() {
		super();
		
		var locations = this.buildLocations(game_height, game_width);
		
		this.state = {
			locations : locations,
			matches : 0,
			guess : 0,
			turn : 1,
			firstGuess : null
		}
	}
	
	// returns a matrix of locations
	// size based on the input height and width
	// each location is a config object used for its state
	//   value, row, column, visible, guessed
	
	//guessed means the card pair has been located
	// not to be confused with being 'guessed' during a turn, 
	// where the cards will be 'visible' though guessed would be
	// false
	buildLocations(game_height, game_width) {
		//create an array of the values used in the game
		// 
		var matchOptions = [];
		for (var x=1;x<13;x++) {
			matchOptions.push(x);
			matchOptions.push(x);
		}
		
		var locations = [];
		for (var i=1;i<=game_height;i++) {
			var row = [];
			
			for (var j=1;j<=game_width;j++) {
				//make each square by picking a number with Math.Random and 
				// removing that item from the options array
				var numberIndex = Math.floor(Math.random() * matchOptions.length)
				var number = matchOptions[numberIndex];
				matchOptions.splice(numberIndex, 1);
				
				row.push({
					value : number,
					row : i,
					column : j,
					key : '' + i + j,
					visible : false,
					guessed : false
				});
				
			}
			locations.push(row);
			
		}
		
		return locations;
	}
	
	
	handleClick(row, column) {
		var locations = this.state.locations;
		var location = Object.assign({}, locations[row-1][column-1]);
		var guessState = this.state.guess;
		var turn = this.state.turn;

		if (guessState === 0 || guessState === 2) {
			if (guessState === 2) {
				locations = this.hideUnguessedVisibleCards(locations);	
				turn++;
			}
			
			location.visible = true;
			location.firstGuess = true;
			locations[row-1][column-1] = location;
			this.setState({
				locations : locations,
				guess : 1,
				firstGuess : location,
				turn : turn
			});
		} else if (guessState === 1) {
			var firstGuess = Object.assign({}, this.state.firstGuess);
			var firstGuessValue = firstGuess.value;
			var currentGuessValue = location.value;
			var matches = this.state.matches;
			if (firstGuess.key === location.key) {
				return;
			}
			
			location.visible = true;
			
			if (firstGuessValue === currentGuessValue) {
				location.guessed = true;
				firstGuess.guessed = true;
				matches++;
			}
			
			//update current guess location
			locations[row-1][column-1] = location;
			
			var firstRowIndex = firstGuess.row-1;
			var firstColumnIndex = firstGuess.column-1;
			locations[firstRowIndex][firstColumnIndex] = firstGuess;
			
			//guess is 2 now to leave both visible, 
			//one more click to go to next guess
			this.setState({
				locations : locations,
				guess : 2,
				firstGuess : null,
				matches : matches
			});
			
			
		}		
	}
	
	render() {
		let status;
		status = 'Welcome to the Matching Game!';
		var html = [];
		for (var i=1;i<=game_height;i++) {
			var row = [];
			
			for (var j=1;j<=game_width;j++) {
				var location = this.state.locations[i-1][j-1];
				var number = location.value;
				row.push(this.renderSquare({
					guessed : location.guessed,
					value : number, 
					row : i, 
					column : j
				}));
				
			}
			html.push(React.createElement('div', {
				key : 'row-' + i,
				className : 'board-row' 
			}, row));
			
		}
		
		return (
		  <div>
			<div className="title">{status}</div>
			<div className="instructions">Click a box to see what number it has.</div>
			<div className="instructions">Try to find the matching boxes.</div>
			{html}

			<fieldset>
				<div className="field-row">
					<label className="field-label">Turn:</label>
					<div className="field-value" >{this.state.turn}</div>
				</div>
				<div className="field-row">
					<label className="field-label">Guessed Right:</label>
					<div className="field-value" >{this.state.matches}</div>
				</div>
			</fieldset>
			
			<div className="nav-bar">
				<Button onClick={this.startGameOver.bind(this)}>Start Over</Button>
			</div>
		
			
		  </div>
		);
	}
	
	hideUnguessedVisibleCards(locations) {
		
		locations.forEach(function(row) {
			row.forEach(function(box) {
				if (box.visible && !box.guessed) {
					box.visible = false;
				}
			});
		});
		
		return locations;
	}
		
	renderSquare(props) {
		var row = props.row;
		var column = props.column;
		var visible = this.state.locations[row-1][column-1].visible;
		
		return <Square 	key={'' + props.row + props.column} 
						value={props.value}
						row={props.row} 
						column={props.column} 
						guessed={props.guessed} 
						visible={visible}
						onClick={() => this.handleClick(row, column)}
				/>;
	}
	
	startGameOver() {
		var locations = this.buildLocations(game_height, game_width);
		
		this.setState({
			locations : locations,
			matches : 0,
			guess : 0,
			turn : 1
		});
	}
}




export default Board;