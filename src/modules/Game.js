import React from 'react';
import { Router, hashHistory } from 'react-router'

import Board from './board/Board.js'
import Settings from './settings/Settings.js'

const routes = {
  path: '/',
  indexRoute: { onEnter: (nextState, replace) => replace('/game')},
  childRoutes: [{
    path: '/game',
    component : Board
  }, {
    path: '/settings',
    component: Settings
  }]
}

class Game extends React.Component {

  render() {
    return (
      <div>
        <div className="title">Matching Game</div>
        <Router history={hashHistory} routes={routes} />
        <div className="footer">
          <a href="https://github.com/hacocacyb/memory-game">View source on GitHub</a>
        </div>
      </div>
    )
  }
}

export default Game
