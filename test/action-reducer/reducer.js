'use strict';

import {
  reducer,
  reducerEnhancer,
  UPDATE_UI_STATE
} from '../../src/action-reducer.js';

import { assert } from 'chai';
import { is, Map } from 'immutable';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { defaultState } from '../../src/action-reducer.js';

const customReducer = (state, action) => {
  if (action.type === 'CUSTOM_ACTION_TYPE') {
    return {
      ...state,
      isHooked: true
    }
  }
  return state;
}

const customImmutableJSReducer = (state, action) => {
  if (action.type === 'CUSTOM_ACTION_TYPE') {
    return state.set('isHooked', true);
  }
  return state;
}

const reducerEnhancerTest = (reducerToTest, mapImplementation) => {
  let enhancedStore;

  beforeEach( () => {
    enhancedStore = createStore(combineReducers({ ui: reducerToTest }));
  });

  it('delegates to the default reducer', () => {
    assert.isTrue(
      mapImplementation === Object ?
        is(enhancedStore.getState().ui, defaultState)
      :
        enhancedStore.getState().ui.size === 1 &&
        enhancedStore.getState().ui.get('__reducers') &&
        enhancedStore.getState().ui.get('__reducers').size === 0
    );

    enhancedStore.dispatch({
      type: UPDATE_UI_STATE,
      payload: {
        key: 'a',
        name: 'foo',
        value: 'bar'
      }
    });

    assert.isTrue(
      mapImplementation === Object ?
        enhancedStore.getState().ui.__reducers &&
        enhancedStore.getState().ui.a &&
        enhancedStore.getState().ui.a.foo === 'bar'
      :
        enhancedStore.getState().ui.get('__reducers') &&
        enhancedStore.getState().ui.get('__reducers').size === 0 &&
        enhancedStore.getState().ui.getIn(['a', 'foo']) === 'bar'
    );
  });

  it('intercepts custom actions', () => {
    assert.isTrue(
      mapImplementation === Object ?
        is(enhancedStore.getState().ui, defaultState)
      :
        enhancedStore.getState().ui.size === 1 &&
        enhancedStore.getState().ui.get('__reducers') &&
        enhancedStore.getState().ui.get('__reducers').size === 0
    );

    enhancedStore.dispatch({
      type: 'CUSTOM_ACTION_TYPE',
      payload: {
        foo: 'bar'
      }
    });

    assert.isTrue(
      mapImplementation === Object ?
        enhancedStore.getState().ui.__reducers &&
        enhancedStore.getState().ui.isHooked === true
      :
        enhancedStore.getState().ui.get('__reducers') &&
        enhancedStore.getState().ui.get('__reducers').size === 0 &&
        enhancedStore.getState().ui.get('isHooked') === true
    );
  });

  it('updates ui state by updater', () => {
    assert.isTrue(
      mapImplementation === Object ?
        is(enhancedStore.getState().ui, defaultState)
      :
        enhancedStore.getState().ui.size === 1 &&
        enhancedStore.getState().ui.get('__reducers') &&
        enhancedStore.getState().ui.get('__reducers').size === 0
    );

    enhancedStore.dispatch({
      type: UPDATE_UI_STATE,
      payload: {
        key: 'foo',
        name: 'bar',
        value: 'baz'
      }
    });

    enhancedStore.dispatch({
      type: UPDATE_UI_STATE,
      payload: {
        key: 'foo',
        name: 'bar',
        value: baz => baz.toUpperCase()
      }
    });

    assert.isTrue(
      mapImplementation === Object ?
        enhancedStore.getState().ui.__reducers &&
        enhancedStore.getState().ui.foo &&
        enhancedStore.getState().ui.foo.bar === 'BAZ'
      :
        enhancedStore.getState().ui.get('__reducers') &&
        enhancedStore.getState().ui.get('__reducers').size === 0 &&
        enhancedStore.getState().ui.getIn(['foo', 'bar']) === 'BAZ'
    );
  });
};

describe('reducerEnhancer', () => {
  describe('with ImmutableJS state', reducerEnhancerTest.bind(undefined, reducerEnhancer(customImmutableJSReducer, Map), Map));
  describe('with POJO state', reducerEnhancerTest.bind(undefined, reducerEnhancer(customReducer), Object));
});
