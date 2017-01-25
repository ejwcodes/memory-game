import React from 'react'

function GameStatus(props) {

  var turn = props.turn;
  var matches = props.matches;
  var totalMatches = props.totalMatches;

  return (
    <div className="game-status center-align">
        <label className="field-label">Turns:</label>
        <div className="field-value" >{turn}</div>
        <label className="field-label">Matches:</label>
        <div className="field-value" >{matches}/{totalMatches}</div>
    </div>
  )
}

export default GameStatus
