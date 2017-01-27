import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import Game from './modules/Game.js'
import store from './store.js'
import './App.css'

// ========================================

ReactDOM.render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById('root')
);
