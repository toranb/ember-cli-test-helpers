import Ember from "ember";
import TestDone from "./test-done";
import {module as qunitModule} from "qunit";
import startApp from "dummy/tests/helpers/start-app";
import destroyApp from "dummy/tests/helpers/destroy-app";

const { RSVP: { Promise } } = Ember;

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

export var moduleAcceptance = function(name, settings){
    var settings = settings || {};
    qunitModule(name, {
        beforeEach: function() {
            this.application = startApp();
            if(typeof settings.beforeEach === 'function') {
                return settings.beforeEach.apply(this, arguments);
            }
        },
        afterEach: function(assert) {
            Ember.$.fauxjax.clear();
            var afterEach = settings.afterEach && settings.afterEach.apply(this, arguments);
            return Promise.resolve(afterEach).then(() => destroyApp(this.application));
        }
    });
};

export default module;
