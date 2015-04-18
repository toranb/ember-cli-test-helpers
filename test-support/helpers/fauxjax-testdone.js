import Ember from "ember";
import TestDone from "./test-done";

var testDone = function(details) {
    TestDone.create(details).testDoneCallback();
    Ember.$.fauxjax.clear();
};

export default testDone;
