import Ember from "ember";
import TestDone from "./test-done";
import {module as qunitModule} from "qunit";

var module = function(name, settings){
    var settings = settings || {};
    qunitModule(name, {
        beforeEach: function() {
            if(typeof settings.beforeEach === 'function') {
                return settings.beforeEach.apply(this, arguments);
            }
        },
        afterEach: function(assert) {
            TestDone.create({
                name: assert.test.testName,
                module: assert.test.module.name,
                assert: assert
            }).testDoneCallback();
            Ember.$.fauxjax.clear();
            if(typeof settings.afterEach === 'function') {
                return settings.afterEach.apply(this, arguments);
            }
        }
    });
};

export default module;
