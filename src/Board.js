import React from 'react';
import Square from './Square.js';
import { Button } from 'react-bootstrap';

const game_height = 4;
const game_width = 6;
	
class Board extends React.Component {
	
	
	constructor() {
		super();
		
		var locations = this.buildLocations(game_height, game_width);
		var totalMatches = (game_height * game_width) / 2;
		this.state = {
			mode : 'GAME',
			rows : game_height,
			columns : game_width,
			settings : {
				rows : game_height,
				columns : game_width,
				difficult : 'EASY'
			},
			locations : locations,
			matches : 0,
			guess : 0,
			turn : 0,
			totalMatches : totalMatches,
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
	buildLocations(rows, columns) {
		//create an array of the values used in the game
		// 
		var matchOptions = [];
		for (var x=1;x<=(Math.ceil(rows*columns/2));x++) {
			matchOptions.push(x);
			matchOptions.push(x);
		}
		
		var locations = [];
		for (var i=1;i<=rows;i++) {
			var row = [];
			
			for (var j=1;j<=columns;j++) {
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
	
	//this gets called after a turn is guessed so that the user
	// sees the results of their guess for a little bit.
	advanceTurn() {
		var locations = this.state.locations;
		var turn = this.state.turn;
		locations = this.endturnCleanup(locations);	
		var matches = this.state.matches;
		
		
		if (this.state.totalMatches === matches) {
			locations.forEach(function(row) {
				row.forEach(function(box) {
					
					box.visible = true;
					box.faded = false;
				
				});
			});
		}
		turn++;
		this.setState({
			locations : locations,
			guess : 0,
			turn : turn
		});
	}
	
	handleClick(row, column) {
		var locations = this.state.locations;
		var location = Object.assign({}, locations[row-1][column-1]);
		var guessState = this.state.guess;
		var turn = this.state.turn;
		var matches = this.state.matches;
		
		//you have already won so exit here
		if (this.state.totalMatches === matches) {
			return;
		}
		//on first or second guess ignore the locations
		// already guessed
		if (location.guessed) {
			return;
		}
		
		if (guessState === 0 || guessState === 2) {
			if (guessState === 2) {
				//if you click again before the timer cleans up the second guess
				// cancel any events and clean it up now.
				this.advanceTurnTask && window.clearTimeout(this.advanceTurnTask);
				locations = this.endturnCleanup(locations);	
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
			
			this.advanceTurnTask = window.setTimeout(this.advanceTurn.bind(this), 700);
			
			
		}		
	}
	
	render() {
		
		const title = 'Matching Game';
		var matches = this.state.matches;
		var winner = false;
		var rows = this.state.rows;
		var columns = this.state.columns;
		
		if (this.state.totalMatches === matches) {
			winner = true;
		}
		
		var html = [];
		for (var i=1;i<=rows;i++) {
			var row = [];
			
			for (var j=1;j<=columns;j++) {
				var location = this.state.locations[i-1][j-1];
				var number = location.value;
				row.push(this.renderSquare({
					guessed : location.guessed,
					faded : location.faded,
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
		if (this.state.mode =='GAME') {
			return (
			  <div className="board-container">
				<div className="title">{title}</div>
					{winner ? 
						<div className="winning">Congratulations!</div>
						:
						<div className="info-container">
							<div className="instructions">Click a card to flip it over</div>
							<div className="instructions">Find cards with matching numbers</div>
						</div>
					}	
				<div className="game-area">				
					{html}
				</div>
				<fieldset>
						<label className="field-label">Turns:</label>
						<div className="field-value" >{this.state.turn}</div>

						<label className="field-label">Matches:</label>
						<div className="field-value" >{this.state.matches}/{this.state.totalMatches}</div>
				</fieldset>
				
				<div className="text-center nav-bar">
					<Button onClick={this.startGameOver.bind(this)}>Start Over</Button>
					<Button onClick={this.showSettings.bind(this)}>Settings</Button>
				</div>
				<div className="footer">
					<a href="https://github.com/hacocacyb/memory-game">View source on GitHub</a>
				</div>
				
			  </div>
			 );
		} else {
			var numberOfSquares = this.state.settings.rows * this.state.settings.columns;
			var numbersUsed = Math.ceil(numberOfSquares / 2);
			var oddAmountOfSquares = (numberOfSquares % 2 === 1);
			return (
				<div className="container">
					<div className="title">{title}</div>
					<div className="info-container">
						<div className="instructions">Settings</div>
						
					</div>
					<form className="form">
						<div className="form-group">
							<label  htmlFor="rows">Rows:</label>
							<input  type="number"
									id="rows" 
									min="2" 
									pattern="\d*"
									className="form-control col-xs-8"
									defaultValue={this.state.settings.rows}
									onChange={this.handleSettingsChange.bind(this)}
									/>
						</div>
						<div className="form-group">
							<label htmlFor="columns">Columns:</label>
							<input 	type="number" 
									id="columns" 
									min="2" 
									pattern="\d*"
									className="form-control col-xs-8"
									defaultValue={this.state.settings.columns}
									onChange={this.handleSettingsChange.bind(this)}/>
						</div>
						<div className="form-group">
							<label htmlFor="difficult">Number Difficulty:</label>
							<div>
								<label className="radio-inline">
									<input value="EASY" 
											type="radio" 
											
											name="difficult"
											checked={this.state.settings.difficult==='EASY'}
											onChange={this.handleSettingsChange.bind(this)}/>
											1 - {numbersUsed}
								</label>
								<label className="radio-inline">
									<input value="HARD" 
											type="radio" 
											name="difficult" 
											checked={this.state.settings.difficult==='HARD'}
											onChange={this.handleSettingsChange.bind(this)}/>
											1 - 999
								</label>
							</div>
						</div>
					</form>
					
					<div className="panel panel-default" style={{
							display : oddAmountOfSquares ? 'block' : 'none'
					}}>
						<div className="panel-body">Games with an odd number of cards will have one unmatched card</div>
					</div>
					<div className="text-center nav-bar">
						<Button onClick={this.cancelSettings.bind(this)}>Cancel</Button>
						<Button onClick={this.startGameFromSettings.bind(this)}>New Game</Button>
					</div>
					<div className="footer">
						<a href="https://github.com/hacocacyb/memory-game">View source on GitHub</a>
					</div>
				</div>
			)
		}
			 
	}

	endturnCleanup(locations) {
		
		locations.forEach(function(row) {
			row.forEach(function(box) {
				if (box.visible) {
					if (box.guessed) {
						box.visible = false;
						box.faded = true;
					} else {
						box.visible = false;	
					}
					
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
						faded={props.faded} 
						visible={visible}
						onClick={() => this.handleClick(row, column)}
				/>;
	}
	
		
	handleSettingsChange(e) {
		var val = e.currentTarget.value;
		var stateName = e.currentTarget.id || e.currentTarget.name;
		var stateSettings = Object.assign({}, this.state.settings);
		
		stateSettings[stateName] = val;
		console.log(stateSettings);
		this.setState({
			settings : stateSettings
		});
	}
	
	cancelSettings() {
		this.setState({
			mode : 'GAME',
			settings : {
				rows : this.state.rows,
				columns : this.state.columns,
				difficult : 'EASY'
			},
		});
	}
	
	showSettings() {
		
		this.setState({
			settings : {
				rows : this.state.rows,
				columns : this.state.columns,
				difficult : 'EASY'
			},
			mode : 'SETTINGS'
		});
	}
	
	startGameFromSettings() {
		var newColumns = this.state.settings.columns;
		var newRows = this.state.settings.rows;
		var locations = this.buildLocations(newRows, newColumns);
		this.advanceTurnTask && window.clearTimeout(this.advanceTurnTask);
		
		var totalMatches = Math.floor(newRows * newColumns / 2);
		
		this.setState({
			mode : 'GAME',
			locations : locations,
			matches : 0,
			guess : 0,
			turn : 0,
			rows : newRows,
			columns : newColumns,
			totalMatches : totalMatches
		});
	}
	
	startGameOver() {
		var locations = this.buildLocations(game_height, game_width);
		this.advanceTurnTask && window.clearTimeout(this.advanceTurnTask);
		this.setState({
			locations : locations,
			matches : 0,
			guess : 0,
			turn : 0
		});
	}
}




export default Board;