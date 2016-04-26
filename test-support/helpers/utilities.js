import Ember from "ember";
import config from "../../config/environment";

var APP_TIMEOUT = config.APP.defaultWaitForTimeout;
var DEFAULT_TIMEOUT = APP_TIMEOUT !== undefined ? APP_TIMEOUT : 500;

var waitFor = function(assert, callback, timeout) {
    timeout = timeout || DEFAULT_TIMEOUT;
    var done = assert.async();
    Ember.run.later(function(){
        callback();
        done();
    }, timeout);
};

export {waitFor};
