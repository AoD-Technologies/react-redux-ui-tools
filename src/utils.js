'use strict';

import invariant from 'invariant';

const DONE_STEP = {
  done: true
};

class ForcedIterator {
  constructor(value) {
    Object.assign(this, {
      __source: value,
      currentPosition: -1
    });
  }

  next() {
    const done = this.currentPosition === this.__source.length - 1;
    if (done) return DONE_STEP;
    this.currentPosition++;
    const value = done ? undefined : this.__source[this.currentPosition];
    return Object.assign({}, {
      done,
      value
    })
  }
}

// TODO: Make this truly Mutable
class Mutable {
  constructor(state) {
    Object.assign(this, {
      state
    });
  }

  get(key) {
    return __get(this.state, key);
  }

  getIn(searchKeyPath, notSetValue) {
    return __getIn(this.state, searchKeyPath, notSetValue);
  }

  updateIn(keyPath, notSetValue, updater) {
    this.state = __updateIn(this.state, keyPath, notSetValue, updater);
  }

  setIn(keyPath, v) {
    this.state = __setIn(this.state, keyPath, v);
  }

  deleteIn(keyPath) {
    this.state = __deleteIn(this.state, keyPath);
  }

  withMutations(fn) {
    this.state = __withMutations(this.state, fn);
  }
}

const isArrayLike = (value) => {
  return value && typeof value.length === 'number';
}

const forceIterator = (keyPath) => {
  if (!isArrayLike(keyPath)) {
    throw new TypeError('Expected iterable or array-like: ' + keyPath);
  }

  return new ForcedIterator(keyPath);
}

const updateInDeepMap = (existing, keyPathIter, notSetValue, updater) => {
  const isNotSet = typeof existing === 'undefined';
  const step = keyPathIter.next();
  if (step.done) {
    const existingValue = isNotSet ? notSetValue : existing;
    const newValue = updater(existingValue);
    return newValue === existingValue ? existing : newValue;
  }
  invariant(
    isNotSet || (existing && Object(existing) === existing),
    'invalid keyPath'
  );
  const key = step.value;
  const nextExisting = isNotSet ? undefined : existing[key];
  const nextUpdated = updateInDeepMap(
    nextExisting,
    keyPathIter,
    notSetValue,
    updater
  );
  if (nextUpdated === nextExisting) {
    return existing;
  } else if (typeof nextUpdated === 'undefined') {
    let result = {
      ...existing
    };
    delete result[key];
    return result;
  } else {
    return isNotSet ? {
        [key]: nextUpdated
      } : {
        ...existing,
        [key]: nextUpdated
      };
  }
}

const __get = (state, key) => {
  return state[key];
}

const __getIn = (state, searchKeyPath, notSetValue) => {
  var nested = state;
  for (var key of searchKeyPath) {
    nested = nested ? nested[key] : undefined;
    if (typeof nested === 'undefined') {
      return notSetValue;
    }
  }
  return nested;
}

const __updateIn = (state, keyPath, notSetValue, updater) => {
  if (!updater) {
    updater = notSetValue;
    notSetValue = undefined;
  }

  let updatedValue = updateInDeepMap(
    state,
    forceIterator(keyPath),
    notSetValue,
    updater
  );

  return updatedValue;
}

const __setIn = (state, keyPath, v) => {
  return __updateIn(state, keyPath, undefined, () => v)
}

const __deleteIn = (state, keyPath) => {
  return __updateIn(state, keyPath, () => undefined);
}

const __withMutations = (state, fn) => {
  let mutable = new Mutable(state);
  fn(mutable);
  return mutable.state;
}

/**
 * getUIState inspects redux' global state store and returns the UI state node.
 *
 * This checks to see whether state is an immutable map or a POJO.
 */
export const getUIState = (state) => {
  if (typeof state.get === 'function') {
    return state.get('ui');
  }
  return state.ui;
}

/**
 * get behaves similarly to Immutable.JS' Map's get function.
 *
 * This checks to see whether state is an immutable map or a POJO.
 */
export const get = (state, key) => {
  if (typeof state.get === 'function') {
    return state.get(key);
  }

  return __get(state, key);
}

/**
 * getIn behaves similarly to Immutable.JS' Map's getIn function.
 *
 * This checks to see whether state is an immutable map or a POJO.
 */
export const getIn = (state, searchKeyPath, notSetValue) => {
  if (typeof state.getIn === 'function') {
    return state.getIn(searchKeyPath, notSetValue);
  }

  return __getIn(state, searchKeyPath, notSetValue)
}

/**
 * setIn behaves similarly to Immutable.JS' Map's setIn function.
 *
 * This checks to see whether state is an immutable map or a POJO.
 */
export const setIn = (state, keyPath, v) => {
  if (typeof state.setIn === 'function') {
    return state.setIn(keyPath, v);
  }

  return __setIn(state, keyPath, v);
}

/**
 * deleteIn behaves similarly to Immutable.JS' Map's deleteIn function.
 *
 * This checks to see whether state is an immutable map or a POJO.
 */
export const deleteIn = (state, keyPath) => {
  if (typeof state.deleteIn === 'function') {
    return state.deleteIn(keyPath);
  }

  return __deleteIn(state, keyPath);
}

/**
 * updateIn behaves similarly to Immutable.JS' Map's updateIn function.
 *
 * This checks to see whether state is an immutable map or a POJO.
 */
export const updateIn = (state, keyPath, notSetValue, updater) => {
  if (typeof state.updateIn === 'function') {
    return state.updateIn(keyPath, notSetValue, updater);
  }

  return __updateIn(state, keyPath, notSetValue, updater);
}

/**
 * withMutations behaves similarly to Immutable.JS' Map's withMutations function.
 *
 * This checks to see whether state is an immutable map or a POJO.
 */
export const withMutations = (state, fn) => {
  if (typeof state.withMutations === 'function') {
    return state.withMutations(fn);
  }

  return __withMutations(state, fn);
}
