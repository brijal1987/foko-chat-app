import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Startchat from './Startchat';

configure({adapter: new Adapter()});

describe('Startchat component', () => {
  it('renders without crashing', () => {
    shallow(<Startchat />);
  });
});
