import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Login from './Login';

configure({adapter: new Adapter()});

describe('Login component', () => {
  it('renders without crashing', () => {
    shallow(<Login />);
  });
});
