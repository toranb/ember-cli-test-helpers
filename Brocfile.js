/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var app = new EmberAddon();

/*
  This Brocfile specifes the options for the dummy test app of this
  addon, located in `/tests/dummy`

  This Brocfile does *not* influence how the addon or the app using it
  behave. You most likely want to be modifying `./index.js` or app's Brocfile
*/

app.import('bower_components/foundation/js/foundation.min.js');
app.import('bower_components/fauxjax/dist/fauxjax.min.js');

module.exports = app.toTree();
