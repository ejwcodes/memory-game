export function advanceTurn() {
  return {
    type: "ADVANCE_TURN"
  }
}

export function cleanup() {
  return {
    type: "CLEANUP"
  }
}
export function guess(newState) {
  return {
    type: "NEW_GUESS",
    payload: newState
  }
}

export function newGame(settings={}) {
  return {
    type: "NEW_GAME",
    payload: settings
  }
}

export function setSize(size) {
  console.log(size);
  return {
    type: "SET_BOARD_SIZE",
    payload: {
      rows: size.rows || 4,
      columns: size.columns || 6
    }
  }
}
