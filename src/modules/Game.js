import React from 'react';

import { Router, Route, hashHistory, IndexRoute } from 'react-router'

import Board from './board/Board.js'
import Settings from './settings/Settings.js'

class Game extends React.Component {
  constructor() {
    super();

    this.state = {
      rows: 4,
      columns: 6
    }
  }

  render() {
    return (
      <div>
        <div className="title">Matching Game</div>
        <Router history={hashHistory} foo="bar">
          <Route path="/">
            <IndexRoute component={Board} />
          </Route>
          <Route path="/game/:rows/:columns" component={Board}/>
          <Route path="/settings/:rows/:columns"
                component={Settings}
                {...this.state}
                cancelSettings={this.cancelSettings.bind(this)}
                newGame={this.newGameFromSettings.bind(this)}
          />
        </Router>
        <div className="footer">
          <a href="https://github.com/hacocacyb/memory-game">View source on GitHub</a>
        </div>
      </div>
    )
  }

  newGameFromSettings(newRows, newColumns) {
    this.advanceTurnTask && window.clearTimeout(this.advanceTurnTask);

    this.rows = newRows;
    this.columns = newColumns;
    hashHistory.push('/game/' + newRows + '/' + newColumns)
  }

  cancelSettings(rows, columns) {
    rows = rows|| 4;
    columns = columns || 6;

    hashHistory.push('/game/' + rows + '/' + columns);
  }
}

export default Game;
