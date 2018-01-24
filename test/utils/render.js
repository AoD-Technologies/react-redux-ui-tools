'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { Map } from 'immutable';
import ui, { reducer } from '../../src';
import ReactTestUtils from 'react-dom/test-utils';

const store = createStore(combineReducers({ ui: reducer }));
const storeImmutableJS = createStore(combineReducers({ ui: (state, action) => reducer(state, action, Map) }));

/**
 * Wrap given JSX with a provider containing a store with the UI reducer
 */
const wrapWithProvider = (jsx, mapImplementation = Object) => (
  <Provider store={ mapImplementation === Object ? store : storeImmutableJS }>
    { jsx }
  </Provider>
);

const render = (jsx, mapImplementation = Object) => {
  return ReactTestUtils.renderIntoDocument(
    wrapWithProvider(jsx, mapImplementation)
  );
}

const renderAndFind = (jsx, type, mapImplementation = Object) => {
  if (type === undefined) {
    type = jsx;
    jsx = <jsx />
  }
  const tree = render(jsx, mapImplementation);
  return ReactTestUtils.findRenderedComponentWithType(tree, type);
}

export {
  store,
  storeImmutableJS,
  wrapWithProvider,
  render,
  renderAndFind
}
