import Ember from "ember";

var TestDone = Ember.Object.extend({
    testDoneCallback: function() {
        var incorrectMocks = this.get("incorrectMocks").length;
        var allThree = incorrectMocks > 0 && (incorrectMocks !== this.get("unfired") || incorrectMocks !== this.get("unhandled"));
        if(allThree) {
            this.incorrectlyMocked();
            this.overMocked();
            this.underMocked();
            return "incorrect, unfired, and unhandled";
        }
        if(this.get("incorrectMocks").length > 0) {
            this.incorrectlyMocked();
            return "incorrect";
        }
        if(this.get("unfiredError") && this.get("unhandledError")) {
            this.overMocked();
            this.underMocked();
            return "unfired and unhandled";
        }
        if(this.get("unfiredError")) {
            this.overMocked();
            return "unfired";
        }
        if(this.get("unhandledError")) {
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
    unhandled: function() {
        return $.fauxjax.unhandled().length;
    }.property(),
    unfired: function() {
        return $.fauxjax.unfired().length;
    }.property(),
    unhandledError: function() {
        return $.fauxjax.unhandled().length !== 0;
    }.property(),
    unfiredError: function() {
        return $.fauxjax.unfired().length !== 0;
    }.property(),
    overMocked: function() {
        $.fauxjax.unfired().forEach(function(request){
            this.createMessage(request, "FIRED");
        });
        ok(false, "Overmocked requests for %@.".fmt(this.get("name")));
    },
    underMocked: function() {
        $.fauxjax.unhandled().forEach(function(request){
            this.createMessage(request, "MOCKED");
        });
        ok(false, "Unmocked requests for %@.".fmt(this.get("name")));
    },
    incorrectlyMocked: function() {
        // this.get("incorrectMocks").forEach(function(request){
        //     console.log(request);
        // });
        ok(false, "Incorrectly mocked requests for %@.".fmt(this.get("name")));
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
