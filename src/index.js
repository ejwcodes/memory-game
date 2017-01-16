import React from 'react';
import ReactDOM from 'react-dom';

import Board from './Board.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './App.css';



class Game extends React.Component {
  render() {
    return (
		<Board />
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
