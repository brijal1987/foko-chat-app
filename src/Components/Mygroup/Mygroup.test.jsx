import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Mygroup from './Mygroup';

configure({adapter: new Adapter()});

describe('Mygroup component', () => {
  it('renders without crashing', () => {
    shallow(<Mygroup />);
  });
});
