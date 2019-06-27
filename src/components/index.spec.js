import React from 'react';
import { shallow } from 'enzyme';
import App from './index';

describe('test App component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<App/>);
  })

  it('should render h1', () => {
    expect(wrapper.find('h1').length).toBe(1);
  });

  it('should render text correctly', () => {
    expect(wrapper.find('h1').text()).toEqual('This app works!');
  });
})