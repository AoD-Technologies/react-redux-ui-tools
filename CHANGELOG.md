# v1.0.9
- Add package-lock.json to version control.
- Move Redux and React-Redux out of dependencies to devDependencies and peerDependencies.

# v1.0.8
- Update README.md to reference the new repository owner in the CircleCI status badge.
- Move React back out of dependencies to devDependencies and peerDependencies (thanks @krzysiek1507)

# v1.0.7
- Fix Immutable.JS example in README.md (add missing `import { Map } from 'immutable'` statement).
- Fix README.md grammar (remove extra period).
- Change github.com references in package.json to reflect the transfer of repository ownership to the AoD Technologies organization.

# v1.0.6
- Fix #1 - Add `transform-runtime` plugin to .babelrc.
- Further .babelrc cleanup:
   - Remove `babel-preset-stage-0` preset.
   - Add `transform-object-rest-spread` plugin.
   - Add `transform-function-bind` plugin.
   - Add `transform-class-properties` plugin.
- Remove React warning regarding requestAnimationFrame polyfill during unit test execution.

# v1.0.5
- Update README.md to reference the new repository name in the CircleCI status badge.

# v1.0.4
- Version bump to sync github and npm releases.

# v1.0.3
- Update package.json with the new repository, etc. URLs.

# v1.0.2
- Fix a few references to the old package name.
- Export the MASS_UPDATE_UI_STATE, UPDATE_UI_STATE, and SET_DEFAULT_UI_STATE action types from the main library entry point.

# v1.0.1
- Rename package to react-redux-ui-tools

# v1.0.0
- Remove run-time dependency on Immutable.JS

# v0.1.2
- Add option to use POJOs for UI state
- Fix the build system so that published updates get properly installed
- Install react as a dependency (thanks @j4k)
- Add missing closing div tag to README.md examples (thanks @Eksapsy)
- Properly wrap displayName according to [best practices](https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) (thanks @skeate)
- Remove redundant references to $(npm_bin) (also fixes Windows builds) (thanks @baerrach)
- Add ability to specify a function of props to return dynamic keys (thanks @dfguo)
- Avoid creating new functions at each render pass (thanks @gcazaciuc)

# v0.1.1
- Add customReducer decorator API documentation to README.md

# v0.1.0
- Update dependencies to work with React 15 (thanks @kurtfunai)
- Allow functions inside updateUI (`this.props.updateUI('username', v => v.toUpperCase());`)

# v0.0.15
- Add: Allow `options` and `mergeProps` to be passed to `@connect()`
- Add: Expose `uiPath` in `this.props.uiPath`
- Fix state evaluation when parents call resetUI
- Fix state evaluation when child call resetUI

# v0.0.14
- Fix: update package.json for react 15

# v0.0.13
- republish of 0.0.12 due to npm error

# v0.0.12
- Add support for redux-immutable

# v0.0.11
- Change: Upgrade to babel 6
- Improve: Throw an error when custom reducers return no state

# v0.0.9
- Fix: issue where componentWillReceiveProps could break derived state from
  functions within opts.state

# v0.0.8
- Add: allow default state to be set from an evaulated function with the
  signature (props, state).

# v0.0.7
- Add: Custom per-component reducers for local UI state modification
- Fix: Fix react warnings from setting props in constructor

# v0.0.6
- Fix: no longer deeply convert UI defalts to immutableJS
- Change: Set default UI state in constructor
- Change: Delay wiping UI state on unmount in `requestAnimationFrame`

# v0.0.5
- Work around issue in `componentWillMount` in React. See commit
  `5f9ab5c44fc7941e6f78fa9470ab8a04b7487997` for more info.

# v0.0.4
- Fix invariant import in reducer

# v0.0.3
- Add transpiled source to package

# v0.0.2
- Fix dependencies

# v0.0.1
- Initial version with scoping of contexts from parent to child
