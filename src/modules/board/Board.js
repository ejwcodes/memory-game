import React from 'react';
import { connect } from 'react-redux'
import { hashHistory } from 'react-router';
import Card from '../card/Card.js';
import GameStatus from '../GameStatus.js';
import * as Actions from '../../actions/gameStateActions.js'
import './Board.css'

class Board extends React.Component {

	//this gets called in a delay after a turn is guessed so that the user
	// sees the results of their guess for a little bit.
	advanceTurn() {
		this.props.dispatch(Actions.advanceTurn());
	}

	handleClick(row, column) {
		let { locations, guess, turn, matches, totalMatches } = this.props.gameState;
		let location = {...locations[row-1][column-1]};

		//on first or second guess ignore the locations already guessed
		//or you have already won so exit here
		if (location.guessed || totalMatches === matches) {
			return;
		}

		if (guess === 0 || guess === 2) {
			if (guess === 2) {
				//if you click again before the timer cleans up the second guess
				// cancel any events and clean it up now.
				this.advanceTurnTask && window.clearTimeout(this.advanceTurnTask);
				this.props.dispatch(Actions.cleanup());
				turn++;
			}

			location.visible = true;
			locations[row-1][column-1] = location;
			this.props.dispatch(Actions.guess({
				locations : locations,
				guess : 1,
				guesses : [location],
				turn
			}))

		} else if (guess === 1) {
			let firstGuess = this.props.gameState.guesses[0];
			let firstGuessValue = firstGuess.value;
			let currentGuessValue = location.value;

			if (firstGuess.key === location.key) {
				return;
			}

			location.visible = true;

			//was the guess right?
			if (firstGuessValue === currentGuessValue) {
				location.guessed = true;
				firstGuess.guessed = true;
				//first Guess updated to reflect correct
				locations[firstGuess.row-1][firstGuess.column-1] = firstGuess;
				matches++;
			}
			//update current guess location
			locations[row-1][column-1] = location;

			this.props.dispatch(Actions.guess({
				locations : locations,
				guess : 2,
				guesses : [firstGuess, location],
				matches
			}))

			//after a guess, let the cards show, then advance after a delay
			this.advanceTurnTask = window.setTimeout(this.advanceTurn.bind(this), 700);
		}
	}

	renderCard(props) {
		return <Card key={props.key}	{...props} onClick={() => this.handleClick(props.row, props.column)} />;
	}

	showSettings() {
		hashHistory.push('/settings');
	}

	startGameOver() {
		this.props.dispatch(Actions.newGame());
	}

	render() {
		let { matches, rows, columns, totalMatches } = this.props.gameState;
		let hasWonClass = (totalMatches === matches ? ' has-won' : '');

		//building the actual card components row by row
		let html = [];
		for (let i=1;i<=rows;i++) {
			let row = [];
			for (let j=1;j<=columns;j++) {
				let location = this.props.gameState.locations[i-1][j-1];
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

				<GameStatus {...this.props.gameState} />

				<div className="text-center nav-bar">
					<button onClick={this.startGameOver.bind(this)}>Start Over</button>
					<button onClick={this.showSettings.bind(this)}>Settings</button>
				</div>
		  </div>
		 );
	}

}

export default connect((store) => {
	return {...store};
})(Board);
