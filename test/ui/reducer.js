'use strict';

import { assert } from 'chai';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { is, Map } from 'immutable';
import ReactTestUtils from 'react-dom/test-utils';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

import ui, { reducer } from '../../src';
import { store, storeImmutableJS, render, renderAndFind } from '../utils/render.js';

const reducerTests = (mapImplementation) => {
  class Parent extends Component {
    render = () => <div>{ this.props.children }</div>
  }

  // Create a UI component that listens to the 'CUSTOM' type and updates
  // UI variables
  let parentReducer;
  if (mapImplementation === Object) {
    parentReducer = (state, action) => {
      if (action.type === 'CUSTOM') {
        return {
          ...state,
          name: 'parentOverride'
        }
      }
      return state;
    };
  } else {
    parentReducer = (state, action) => {
      if (action.type === 'CUSTOM') {
        return state.set('name', 'parentOverride');
      }
      return state;
    };
  }

  const UIParent = ui({
    key: 'parent',
    state: {
      name: 'parent'
    },
    reducer: parentReducer
  })(Parent);

  it('adds a custom reducer on mount and removes at unmount', () => {
    const c = renderAndFind(<UIParent />, Parent, mapImplementation);
    let reducers = mapImplementation === Object ? store.getState().ui.__reducers : storeImmutableJS.getState().ui.get('__reducers');
    assert.equal(mapImplementation === Object ? Object.keys(reducers).length : reducers.size, 1);
    assert.equal(mapImplementation === Object ? reducers.parent && reducers.parent.func : reducers.get('parent') && reducers.get('parent').func, parentReducer);

    // Unmount and this should be gone
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(c).parentNode);
    reducers = mapImplementation === Object ? store.getState().ui.__reducers : storeImmutableJS.getState().ui.get('__reducers');
    assert.equal(mapImplementation === Object ? Object.keys(reducers).length : reducers.size, 0);
  });

  it('updates props as expected', () => {
    const c = renderAndFind(<UIParent />, Parent, mapImplementation);
    assert.equal(c.props.ui.name, 'parent');
    c.props.updateUI('name', 'foo');
    assert.equal(c.props.ui.name, 'foo');

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(c).parentNode);
  });

  it('responds to actions using a custom reducer', () => {
    const c = renderAndFind(<UIParent />, Parent, mapImplementation);

    let applicableStore = mapImplementation === Object ? store : storeImmutableJS;
    applicableStore.dispatch({ type: 'CUSTOM' });
    assert.equal(c.props.ui.name, 'parentOverride');

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(c).parentNode);
  });

  describe('with children', () => {
    // This will be set when the reducer is called, allowing us to test what
    // state the reducer is given.
    //
    // We should only be given state for our current component.
    let reducerState;

    // Create a UI component that listens to the 'CUSTOM' type and updates
    // UI variables
    let childReducer;
    if (mapImplementation === Object) {
      childReducer = (state = {}, action) => {
        reducerState = state;
        if (action.type === 'CUSTOM') {
          return {
            ...state,
            foo: 'childOverride'
          }
        }
        return state;
      };
    } else {
      childReducer = (state = {}, action) => {
        reducerState = state;
        if (action.type === 'CUSTOM') {
          return state.set('foo', 'childOverride');
        }
        return state;
      };
    }

    class Child extends Component {
      render = () => <p>child</p>
    }

    const UIChild = ui({
      key: 'child',
      state: { foo: 'bar' },
      reducer: childReducer
    })(Child);

    it('is given UI state for the current component only', () => {
      const tree = render(<UIParent><UIChild /></UIParent>, mapImplementation);
      const parent = ReactTestUtils.findRenderedComponentWithType(tree, Parent);
      const child = ReactTestUtils.findRenderedComponentWithType(tree, Child);

      let applicableStore = mapImplementation === Object ? store : storeImmutableJS;
      applicableStore.dispatch({ type: 'CUSTOM' });
      // The reducerState should equal the default reducer state for our child
      // component
      assert.isTrue(mapImplementation === Object ? typeof reducerState.name === 'undefined' && reducerState.foo === 'bar' : is(reducerState, new mapImplementation({ foo: 'bar' })));
      assert.equal(parent.props.ui.name, 'parentOverride');
      assert.equal(child.props.ui.foo, 'childOverride');

      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(parent).parentNode);
    });
  });
};

describe('A Custom Reducer', () => {
  describe('with Immutable.JS state', reducerTests.bind(undefined, Map));
  describe('with POJO state', reducerTests.bind(undefined, Object));
});
