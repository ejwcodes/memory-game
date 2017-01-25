import React from 'react';
import { hashHistory } from 'react-router';
import Card from '../card/Card.js';
import GameStatus from '../GameStatus.js';
import './Board.css'


class Board extends React.Component {

	constructor(props) {
		super();
		let state = this.setupGame(props);
		this.state = state;
	}

	//if we change the url when we're on this components route, we come
	// through here but not through constructor
	componentWillReceiveProps(props) {
		//TODO move more state to parent to 'remember' the game when cancelling?
		if (props && props.params && props.params.cancelSettings) {

		} else {
			let state = this.setupGame(props);

			this.setState(state);
		}

	}

	setupGame(props) {
		let rows = 4, columns = 6;
		if (props && props.params) {
			rows = props.params.rows || rows;
			columns = props.params.columns || columns;
		}

		let locations = this.buildLocations(rows, columns);
		let totalMatches = Math.floor((rows * columns) / 2);
		return {
			rows : rows,
			columns : columns,
			locations : locations,
			matches : 0,
			guess : 0,
			turn : 0,
			totalMatches : totalMatches,
			firstGuess : null
		}
	}
	//this gets called in a delay after a turn is guessed so that the user
	// sees the results of their guess for a little bit.
	advanceTurn() {
		let locations = this.state.locations;
		let turn = this.state.turn;
		locations = this.advanceTurnCleanup(locations);

		turn++;
		this.setState({
			locations : locations,
			guess : 0,
			turn : turn
		});
	}

	advanceTurnCleanup(locations) {
		let matches = this.state.matches;

		//if you win, show all cards
		if (this.state.totalMatches === matches) {
			locations.forEach(function(row) {
				row.forEach(function(box) {

					box.visible = true;
					box.faded = false;

				});
			});
		} else {
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
		}

		return locations;
	}

	handleClick(row, column) {
		let locations = this.state.locations;
		let location = Object.assign({}, locations[row-1][column-1]);
		let guessState = this.state.guess;
		let turn = this.state.turn;
		let matches = this.state.matches;

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
				locations = this.advanceTurnCleanup(locations);
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
			let firstGuess = Object.assign({}, this.state.firstGuess);
			let firstGuessValue = firstGuess.value;
			let currentGuessValue = location.value;

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

			let firstRowIndex = firstGuess.row-1;
			let firstColumnIndex = firstGuess.column-1;
			locations[firstRowIndex][firstColumnIndex] = firstGuess;

			//after second guess, the timer or another click will turn the cards over
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
		let matches = this.state.matches;
		let rows = this.props.params.rows || 4;
		let columns = this.props.params.columns || 6;
		let hasWonClass = '';

		if (this.state.totalMatches === matches) {
			hasWonClass = ' has-won';
		}

		let html = [];
		for (let i=1;i<=rows;i++) {
			let row = [];

			for (let j=1;j<=columns;j++) {
				let location = this.state.locations[i-1][j-1];
				row.push(this.renderCard(location));
			}
			html.push(React.createElement('div', {
				key : 'row-' + i,
				className : 'board-row'
			}, row));

		}

		return (
		  <div className="board-container">
				<div className={"winner" + hasWonClass}>Congratulations!</div>
				<div className={"info-container" + hasWonClass}>
					<div>Click a card to flip it over</div>
					<div>Find cards with matching numbers</div>
				</div>
				<div className="center-align">
					{html}
				</div>

				<GameStatus {...this.state} />

				<div className="text-center nav-bar">
					<button onClick={this.startGameOver.bind(this)}>Start Over</button>
					<button onClick={this.showSettings.bind(this)}>Settings</button>
				</div>
		  </div>
		 );
	}

	renderCard(props) {
		return <Card key={props.key}	{...props} onClick={() => this.handleClick(props.row, props.column)} />;
	}

	showSettings() {
		hashHistory.push('/settings/' + this.state.rows + '/' + this.state.columns);
	}

	startGameOver() {
		let locations = this.buildLocations(this.state.rows, this.state.columns);
		//in case there was a timer going clear it
		this.advanceTurnTask && window.clearTimeout(this.advanceTurnTask);
		this.setState({
			locations : locations,
			matches : 0,
			guess : 0,
			turn : 0
		});
	}
	// returns a matrix of locations
	// size based on the input height and width
	// each location is a config object used for its state
	buildLocations(rows, columns) {
		//create an array of the values used in the game
		//
		let matchOptions = [];
		for (let x=1;x<=(Math.ceil(rows*columns/2));x++) {
			matchOptions.push(x);
			matchOptions.push(x);
		}

		let locations = [];
		for (let i=1;i<=rows;i++) {
			let row = [];

			for (let j=1;j<=columns;j++) {
				//make each Card by picking a number with Math.Random and
				// removing that item from the options array
				let numberIndex = Math.floor(Math.random() * matchOptions.length)
				let number = matchOptions[numberIndex];
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

}

export default Board;
