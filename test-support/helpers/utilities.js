import Ember from "ember";
import QUnit from "qunit";
import config from '../../config/environment';

var DEFAULT_TIMEOUT = config.APP.defaultWaitForTimeout || 500;

var waitFor = function(callback, timeout) {
    timeout = timeout || DEFAULT_TIMEOUT;
    stop();
    Ember.run.later(function(){
        callback();
        start();
    }, timeout);
};

export {waitFor};
