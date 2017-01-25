import React from 'react'

import './Settings.css'

class Settings extends React.Component {

  constructor(props) {
    super();
    var rows = 4, columns = 6;
		rows = props.params.rows || rows;
		columns = props.params.columns || columns;

    this.state = {
      initialRows : rows,
      initialColumns : columns,
      rows : rows,
      columns : columns
    }

  }
  componentWillReceiveProps(props) {
    var rows = 4, columns = 6;
		rows = props.params.rows || rows;
		columns = props.params.columns || columns;

	   this.setState({
       rows : rows,
       columns : columns
     });

	}

  cancelSettings() {
    this.props.route.cancelSettings(this.state.initialRows, this.state.initialColumns);
  }

	startGameFromSettings() {
		var newColumns = this.state.columns;
		var newRows = this.state.rows;
    this.props.route.newGame(newRows, newColumns);
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

export default Settings;
