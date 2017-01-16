import React from 'react';

function Square(props) {
	var className = 'square';
	var showTheBack = true;
	if (props.faded) {
		className += ' faded';
	}
	if (props.guessed) {
		className +=  ' guessed';
	}
	
	if (props.visible) {
		className += ' visible';
	}
	if (props.guessed || (props.visible && !props.faded)) {
		showTheBack = false;
	}
	return (
		<div className={className}>
			<div className={"card" + (showTheBack ? " " : " flipped")}>
				<button className="face front"
					onClick={props.onClick.bind(this)}>
						{(props.visible || props.guessed) ? props.value : ' '}
				</button>
				<button className="face back"
					onClick={props.onClick.bind(this)}>
					
				</button>
			</div>
		</div>
	);
}

export default Square;