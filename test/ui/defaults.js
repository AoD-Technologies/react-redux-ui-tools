'use strict';

import { assert } from 'chai';
import React, { Component } from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { Map } from 'immutable';

import ui, { reducer } from '../../src';
import { render, renderAndFind } from '../utils/render.js';

const hocTest = (mapImplementation) => {
  // Set up closures which we can use to check that the uiState func is passed
  // expected props.
  let calcProps, calcState;

  class Test extends Component {
    render() { return <p>Hi</p>; }
  }
  const uiState = {
    calculated: (props, state) => {
      calcProps = props;
      calcState = state;
      return props.passedProp
    },
    isValid: true
  };
  const UITest = ui({ state: uiState })(Test);

  it('component is given expected props', () => {
    const c = renderAndFind(<UITest passedProp='foo' />, Test);
    assert.equal(c.props.ui.calculated, 'foo');
    assert.equal(calcProps.passedProp, 'foo');
    assert.equal(typeof calcState.ui, typeof mapImplementation());
  });
};

describe('Default UI state variables', () => {
  describe('when HOC is passed props and state to calculate defaults', () => {
    describe('with ImmutableJS state', hocTest.bind(undefined, Map));
    describe('with POJO state', hocTest.bind(undefined, Object));
  });
});
