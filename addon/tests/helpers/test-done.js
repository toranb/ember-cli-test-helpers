import Ember from "ember";

var TestDone = Ember.Object.extend({
    testDoneCallback: function() {
        if(this.get("allThree")) {
            this.incorrectlyMocked();
            this.overMocked();
            this.underMocked();
            return "incorrect, unfired, and unhandled";
        }
        if(this.get("incorrect")) {
            this.incorrectlyMocked();
            return "incorrect";
        }
        if(this.get("unfired") && this.get("unhandled")) {
            this.overMocked();
            this.underMocked();
            return "unfired and unhandled";
        }
        if(this.get("unfired")) {
            this.overMocked();
            return "unfired";
        }
        if(this.get("unhandled")) {
            this.underMocked();
            return "unhandled";
        }
    },
    incorrectMocks: function() {
        var incorrect = [];
        $.fauxjax.unfired().forEach(function(unfired){
            $.fauxjax.unhandled().forEach(function(unhandled){
                if(unfired.url === unhandled.url && unfired.type === unhandled.type) {
                    incorrect.push({
                        unfired: unfired,
                        unhandled: unhandled
                    });
                }
            });
        });
        return incorrect;
    }.property(),
    allThree: function() {
        var incorrect = this.get("incorrect");
        return incorrect &&
            (incorrect !== this.get("unfired") ||
             incorrect !== this.get("unhandled"));
    }.property(),
    incorrect: function() {
        return this.get("incorrectMocks").length;
    }.property(),
    unhandled: function() {
        return $.fauxjax.unhandled().length;
    }.property(),
    unfired: function() {
        return $.fauxjax.unfired().length;
    }.property(),
    overMocked: function() {
        var self = this;
        $.fauxjax.unfired().forEach(function(request){
            self.createMessage(request, "FIRED");
        });
        ok(false, "Overmocked requests for %@.".fmt(this.get("name")));
    },
    underMocked: function() {
        var self = this;
        $.fauxjax.unhandled().forEach(function(request){
            self.createMessage(request, "MOCKED");
        });
        ok(false, "Unmocked requests for %@.".fmt(this.get("name")));
    },
    incorrectlyMocked: function() {
        var self = this;
        this.get("incorrectMocks").forEach(function(request){
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
        for(var key in data) {
            if(data.hasOwnProperty(key)) {
                console.log(name + " data:");
                console.log(key + ": " + data[key]);
            }
        }
    },
    createMessage: function(request, verb) {
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
