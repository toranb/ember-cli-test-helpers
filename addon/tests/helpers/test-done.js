import Ember from "ember";

var TestDone = Ember.Object.extend({
    testDoneCallback: function() {
        var lists = this._configureLists();
        var incorrect = lists.incorrect;
        var unfired = lists.unfired;
        var unhandled = lists.unhandled;
        if(this._allThree(lists)) {
            this._logIncorrectRequests(incorrect);
            this._logUnfiredRequests(unfired);
            this._logUnhandledRequests(unhandled);
            return "incorrect, unfired, and unhandled";
        }
        if(incorrect.length) {
            this._logIncorrectRequests(incorrect);
            return "incorrect";
        }
        if(unfired.length && unhandled.length) {
            this._logUnfiredRequests(unfired);
            this._logUnhandledRequests(unhandled);
            return "unfired and unhandled";
        }
        if(unfired.length) {
            this._logUnfiredRequests(unfired);
            return "unfired";
        }
        if(unhandled.length) {
            this._logUnhandledRequests(unhandled);
            return "unhandled";
        }
    },
    _configureLists: function() {
        var lists = {
            incorrect: [],
            unhandled: [],
            unfired: []
        };
        if($.fauxjax.unfired().length > 0 && $.fauxjax.unhandled().length > 0) {
            $.fauxjax.unfired().forEach(function(unfired){
                var found = $.fauxjax.unhandled().filter(function(unhandled){
                    return unfired.url === unhandled.url &&
                        unfired.type === unhandled.type;
                });
                if(found.length === 0) {
                    lists.unfired.push(unfired);
                } else {
                    lists.incorrect.push({
                        unfired: unfired,
                        unhandled: found[0]
                    });
                }
            });
            $.fauxjax.unhandled().forEach(function(unhandled){
                var found = $.fauxjax.unfired().filter(function(unfired){
                    return unfired.url === unhandled.url &&
                        unfired.type === unhandled.type;
                });
                if(found.length === 0) {
                    lists.unhandled.push(unhandled);
                }
            });
        } else {
            lists.unfired = $.fauxjax.unfired();
            lists.unhandled = $.fauxjax.unhandled();
        }
        return lists;
    },
    _allThree: function(lists) {
        return lists.incorrect.length > 0 &&
            lists.unfired.length > 0 &&
            lists.unhandled.length > 0;
    },
    _logUnfiredRequests: function(unfired) {
        var self = this;
        unfired.forEach(function(request){
            self._createMessage(request, "FIRED");
        });
        ok(false, "Overmocked requests for %@.".fmt(this.get("name")));
    },
    _logUnhandledRequests: function(unhandled) {
        var self = this;
        unhandled.forEach(function(request){
            self._createMessage(request, "MOCKED");
        });
        ok(false, "Unmocked requests for %@.".fmt(this.get("name")));
    },
    _logIncorrectRequests: function(incorrect) {
        var self = this;
        incorrect.forEach(function(request){
            self._incorrectMessage(request);
        });
        ok(false, "Incorrectly mocked requests for %@.".fmt(this.get("name")));
    },
    _incorrectMessage: function(request) {
        var output = [];
        var mockHandler = request.unhandled;
        var realRequestContext = request.unfired;
        if (mockHandler.data && !realRequestContext.data || _.some(_.compact([mockHandler.data, realRequestContext.data])) && !_.isEqual(mockHandler.data, realRequestContext.data)) {
            this._logObjectData("Stubbed", mockHandler.data);
            this._logObjectData("Real Request", realRequestContext.data);
            output.push({
                error: "data"
            });
        }
        return output;
    },
    _logObjectData: function(name, data) {
        console.log(name + " data:");
        for(var key in data) {
            if(data.hasOwnProperty(key)) {
                console.log(key + ": " + data[key]);
            }
        }
    },
    _createMessage: function(request, verb) {
        var message = [
            "Request:",
            request.type,
            "to",
            request.url,
            "not %@ for".fmt(verb),
            "'%@'".fmt(this.get("name")),
            "in",
            "'%@'".fmt(this.get("module"))
        ];
        console.warn(message.join(" "));
    }
});

export default TestDone;
