import Ember from "ember";
import TestDone from "ember-cli-test-helpers/tests/helpers/test-done";

var testDone = function(details) {
    TestDone.create(details).testDoneCallback();
    Ember.$.fauxjax.clear();
};

export default testDone;
