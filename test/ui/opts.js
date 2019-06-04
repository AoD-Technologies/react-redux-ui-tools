"use strict";

import { assert } from "chai";
import React, { Component } from "react";

import ui from "../../src";
import { renderAndFind } from "../utils/render.js";

describe("Options", () => {
  class Child extends Component {
    render = () => <p>Child</p>;
  }

  it("allows you to pass 'mergeProps' into @connect", () => {
    // Poor mans spying
    let called = false;
    const mergeProps = (stateProps, dispatchProps, ownProps) => {
      called = true;
      return Object.assign({}, ownProps, stateProps, dispatchProps);
    };

    const UIChild = ui({
      state: { name: "child" },
      mergeProps: mergeProps
    })(Child);

    const c = renderAndFind(<UIChild />, Child);
    assert.isTrue(called);
  });
});
