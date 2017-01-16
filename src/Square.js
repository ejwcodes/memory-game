import React from 'react';

function Square(props) {
	var className = 'square';
	if (props.guessed) {
		className +=  ' guessed';
	}
	return (
	  <button 	className={className} 
				onClick={props.onClick.bind(this)}>
		
		{props.visible ? props.value : null}
	  </button>
	);
}

export default Square;