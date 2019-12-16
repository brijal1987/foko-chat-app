import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Creategroup from './Creategroup';

configure({adapter: new Adapter()});

describe('Creategroup component', () => {
  it('renders without crashing', () => {
    shallow(<Creategroup />);
  });
});
