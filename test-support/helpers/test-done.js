import Ember from "ember";
import QUnit from "qunit";

var fauxjax = Ember.$.fauxjax;

var TestDone = Ember.Object.extend({
    testDoneCallback: function() {
        this._findAndLogIncorrectAndUnfired();
        this._findAndLogUnhandled();
    },
    _findAndLogIncorrectAndUnfired: function() {
        var self = this;
        fauxjax.unfired().forEach(function(unfired){
            var found = fauxjax.unhandled().filter(function(unhandled){
                return self._unfiredAndUnhandledMatch(unfired, unhandled);
            });
            if(found.length === 0) {
                self._logUnfiredRequests(unfired.request);
            } else {
                self._logIncorrectRequests({
                    unfired: unfired.request,
                    unhandled: found[0]
                });
            }
        });
    },
    _findAndLogUnhandled: function() {
        var self = this;
        fauxjax.unhandled().forEach(function(unhandled){
            var found = fauxjax.unfired().filter(function(unfired){
                return self._unfiredAndUnhandledMatch(unfired, unhandled);
            });
            if(found.length === 0) {
                self._logUnhandledRequests(unhandled);
            }
        });
    },
    _unfiredAndUnhandledMatch: function(unfired, unhandled) {
        return unfired.request.url === unhandled.url &&
            unfired.request.type === unhandled.type;
    },
    _logUnfiredRequests: function(request) {
        this._createMessage(request, "FIRED");
        this.get("qunitAssert").ok(false, "Overmocked requests for " + this.get("name"));
    },
    _logUnhandledRequests: function(request) {
        this._createMessage(request, "MOCKED");
        this.get("qunitAssert").ok(false, "Unmocked requests for " + this.get("name"));
    },
    _logIncorrectRequests: function(request) {
        this._incorrectMessage(request.unfired, request.unhandled);
        this.get("qunitAssert").ok(false, "Incorrectly mocked requests for " + this.get("name"));
    },
    qunitAssert: Ember.computed({
        get(key) {
            return this.get("assert") || QUnit.assert;
        },
        set(key, value) {
            this.set("assert", value);
            return this.get("assert") || QUnit.assert;
        }
    }),
    _incorrectMessage: function(unfired, unhandled) {
        this._createMessage(unfired, "CORRECT");
        if(unfired.data && !unhandled.data || _.some(_.compact([unfired.data, unhandled.data])) && !_.isEqual(unhandled.data, unfired.data)) {
            this._logObjectData("Mocked data:", unfired.data);
            this._logObjectData("Real Request data:", unhandled.data);
        }
        if(!_.isEqual(unfired.headers, unhandled.headers)) {
            this._logObjectData("Mocked headers:", unfired.headers);
            this._logObjectData("Real Request headers:", unhandled.headers);
        }
    },
    _logObjectData: function(name, data) {
        console.warn(name);
        if(typeof data === "string") {
            data = JSON.parse(data);
        }
        if(!data || Object.keys(data).length === 0) {
            console.warn("no data");
        }
        for(var key in data) {
            if(data.hasOwnProperty(key)) {
                var value = JSON.stringify(data[key]);
                console.warn(key + ": " + value);
            }
        }
    },
    _createMessage: function(request, verb) {
        var testNameMessage = [
            this.get("module"),
            this.get("name")
        ];
        console.warn(testNameMessage.join(" "));
        var message = [
            "Request:",
            request.type || request.method,
            "to",
            request.url,
            "not",
            verb
        ];
        console.warn(message.join(" "));
    }
});

export default TestDone;
