import React from 'react';

import './Card.css'

function Card(props) {
	let className = 'square';
	let showTheBack = true;
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

	let onClick = props.onClick.bind(this);

	return (
		<div className={className}>
			<div className={"card" + (showTheBack ? " " : " flipped")}>
				<button className="face front" onClick={onClick}>
					{(props.visible || props.guessed) ? props.value : ' '}
				</button>
				<button className="face back" onClick={onClick} />
			</div>
		</div>
	);
}

export default Card;
