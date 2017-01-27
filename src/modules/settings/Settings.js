import React from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import * as Actions from '../../actions/gameStateActions.js'

import './Settings.css'

class Settings extends React.Component {

  constructor(props) {
    super(props);
    let rows = props.rows;
		let columns = props.columns;

    this.state = {
      rows : rows,
      columns : columns
    }

  }
  componentWillReceiveProps(props) {
    let rows = props.rows;
		let columns = props.columns;

    this.setState({
      rows : rows,
      columns : columns
    });
	}

  cancelSettings() {
    hashHistory.push('/game')
  }

	startGameFromSettings() {
		var columns = this.state.columns;
		var rows = this.state.rows;
    //this.props.route.newGame(newRows, newColumns);
    this.props.dispatch(Actions.newGame({
      columns : columns,
      rows : rows
    }));

    hashHistory.push('/game')
	}

  handleSettingsChange(e) {
    var val = e.currentTarget.value;
    var stateName = e.currentTarget.id || e.currentTarget.name;
    var stateSettings = Object.assign({}, this.state);

    stateSettings[stateName] = val;
    this.setState(stateSettings);
  }

  render() {
    var numberOfSquares = this.state.rows * this.state.columns;
    var oddAmountOfSquares = (numberOfSquares % 2 === 1);
    var showOddWarning = {
      visibility : oddAmountOfSquares ? null : 'hidden'
    };

    return (
      <div>
        <form className="settings-form">
          <div className="form-group">
            <label  htmlFor="rows">Rows:</label>
            <input  type="number"
                id="rows"
                min="2"
                max="9"
                pattern="\d*"
                value={this.state.rows}
                onChange={this.handleSettingsChange.bind(this)}
                />
          </div>
          <div className="form-group">
            <label htmlFor="columns">Columns:</label>
            <input 	type="number"
                id="columns"
                min="2"
                max="9"
                pattern="\d*"
                value={this.state.columns}
                onChange={this.handleSettingsChange.bind(this)}/>
          </div>

        </form>
        <div className="warning-box center-align" style={showOddWarning}>
          <div className="">Games with an odd number of cards will have one unmatched card</div>
        </div>
        <div className="nav-bar">
          <button onClick={this.cancelSettings.bind(this)}>Cancel</button>
          <button onClick={this.startGameFromSettings.bind(this)}>New Game</button>
        </div>
      </div>
    )
  }
}

export default connect((store) => {
	console.log(store);
	return {...store.gameState}
})(Settings);
