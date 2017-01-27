export default function gameState(state={
  locations: buildLocations(4, 6),
  rows: 4,
  columns: 6,
  guess : 0,
  turn : 0,
  matches: 0,
  totalMatches: 12,
  guesses : []
}, action) {
  switch(action.type) {
    case "ADVANCE_TURN": {
      let newState = advanceTurnCleanup({...state});
      newState.turn++;
      newState.guess = 0;
      return newState;
    }
    case "NEW_GAME": {
      const rows = action.payload.rows || state.rows;
      const columns = action.payload.columns || state.columns;
      let newState = {...state,
        rows,
        columns,
        locations: buildLocations(rows, columns),
        totalMatches: Math.floor((rows * columns) / 2),
        matches : 0,
  			guess : 0,
  			turn : 0,
        guesses : []
      };
      return newState;
    }
    case "NEW_GUESS": {
      let newState = {...state, ...action.payload};
      return newState;
    }
    case "CLEANUP": {
      let newState = {...state};
      return advanceTurnCleanup(newState);
    }
    default:
      return state;
  }
}


function advanceTurnCleanup(gameState) {
  let { locations, matches, totalMatches } = gameState;
	//if you win, show all cards
	if (totalMatches === matches) {
		locations.forEach(function(row) {
			row.forEach(function(box) {
				box.visible = true;
				box.faded = false;
			});
		});
	} else {
    gameState.guesses.forEach(function(box) {
      if (box.guessed) {
        box.visible = false;
        box.faded = true;
      } else {
        box.visible = false;
      }
      locations[box.row-1][box.column-1] = box;
    });
	}
  gameState.locations = locations;
  return gameState;
}

// returns a matrix of locations
// size based on the input height and width
// each location is a config object used for its state
function buildLocations(rows, columns) {
  //create an array of the values used in the game
  //
  let matchOptions = [];
  for (let x=1;x<=(Math.ceil(rows*columns/2));x++) {
    matchOptions.push(x, x);
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
