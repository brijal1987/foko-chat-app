import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Groupchat from './Groupchat';

configure({adapter: new Adapter()});

describe('Groupchat component', () => {
  it('renders without crashing', () => {
    shallow(<Groupchat />);
  });
});
