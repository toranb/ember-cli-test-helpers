import Ember from "ember";

var stubRequest = function(request, response) {
    return Ember.$.fauxjax.new({
        request: {
            url: request.url,
            data: request.data,
            method: request.method || "GET",
            cache: false
        },
        response: {
            status: response.status || 200,
            content: response.json
        }
    });
};

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

var clearRequests = function(id) {
    if (id) {
        Ember.$.fauxjax.remove(id);
    } else {
        Ember.$.fauxjax.clear();
    }
};

var clearStubHttpRequests = function(id) {
    if (id) {
        Ember.$.fauxjax.remove(id);
    } else {
        Ember.$.fauxjax.clear();
    }
};

export { stubEndpointForHttpRequest, clearStubHttpRequests, stubRequest, clearRequests };
