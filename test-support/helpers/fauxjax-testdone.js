import Ember from "ember";
import TestDone from "./test-done";

var testDone = function(details) {
    var url = "https://github.com/toranb/ember-cli-test-helpers/blob/master/test-support/helpers/module.js";
    var message = "This QUnit.testDone callback has been deprecated in favor of failing the test via the new module wrapper.";
    Ember.deprecate(message, false, {url: url});
    TestDone.create(details).testDoneCallback();
    Ember.$.fauxjax.clear();
};

export default testDone;
