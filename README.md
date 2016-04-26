# ember-cli-test-helpers

[![Build Status](https://travis-ci.org/toranb/ember-cli-test-helpers.svg?branch=master)](https://travis-ci.org/toranb/ember-cli-test-helpers)
[![NPM Downlaads](https://img.shields.io/npm/dm/ember-cli-test-helpers.svg)](https://www.npmjs.org/package/ember-cli-test-helpers)

## Description
Ember-cli-test-helpers is a collection of test helpers

## Installation
Starting with 2.0, this addon only supports Ember 2.1 and later versions.

```
# install via npm
$ npm install ember-cli-test-helpers --save-dev
```

## Build
```
$ npm install
$ bower install
$ ember test
```

## Usage
Example usage of helpers can be found in usage-test.js.

The wait for helper waits half a second by default, but you can configure this value.

```js
module.exports = function(/* environment, appConfig */) {
  return {
    APP: {
      defaultWaitForTimeout: 1
    }
  };
};
```

The `QUnit.testDone` callback function found in
`test-support/helpers/fauxjax-testdone.js` is to be used
with 1.X versions of the [fauxjax] library. For older
versions of fauxjax < 1.0.0, please use a version less
than or equal to 0.7.0 of ember-cli-test-helpers.

## License

Copyright © 2015 Toran Billups

Licensed under the MIT License

[fauxjax]: https://github.com/jarrodctaylor/fauxjax
