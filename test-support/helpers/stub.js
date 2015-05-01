import Ember from "ember";

var stubEndpointForHttpRequest = function(url, json, verb, status, post_data) {
    return Ember.$.fauxjax.new({
        request: {
            url: url,
            method: verb || "GET",
            data: post_data,
            cache: false
        },
        response: {
            status: status || 200,
            content: json
        }
    });
};

var clearStubHttpRequests = function(id) {
    if (id) {
        Ember.$.fauxjax.remove(id);
    } else {
        Ember.$.fauxjax.clear();
    }
};

export { stubEndpointForHttpRequest, clearStubHttpRequests };
