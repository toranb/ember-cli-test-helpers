import Ember from "ember";
import QUnit from "qunit";

var waitFor = function(callback, timeout) {
    timeout = timeout || 500;
    stop();
    Ember.run.later(function(){
        callback();
        start();
    }, timeout);
}

export {waitFor};
