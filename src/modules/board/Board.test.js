import React from 'react'
import ReactDOM from 'react-dom'
import Board from './Board.js'
import { shallow } from 'enzyme'

it('renders without crashing', () => {
  const div = document.createElement('div');
  const params = {
    rows : 4,
    columns : 4
  }
  shallow(<Board params={params}/>, div);
});

it('renders rules snippet', () => {
  const params = {
    rows : 4,
    columns : 4
  }
  const div = shallow(<Board params={params}/>);
  const instructions = <div>Click a card to flip it over</div>;

  expect(div.contains(instructions)).toEqual(true)
})

it('builds locations', () => {
  const params = {
    rows : 4,
    columns : 4
  }
  const board = new Board();
  var locations = board.buildLocations(4, 6);
  expect(locations.length).toEqual(4)
  expect(locations[3].length).toEqual(6)
})
