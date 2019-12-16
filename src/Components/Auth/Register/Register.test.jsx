import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Register from './Register';

configure({adapter: new Adapter()});

describe('Register component', () => {
  it('renders without crashing', () => {
    shallow(<Register />);
  });
});
