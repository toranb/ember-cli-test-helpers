import Ember from "ember";

var stubRequest = function(request, response) {
    request = request || {};
    response = response || {};
    if(!request.url) {
        throw Error("Please provide a url for the request");
    }
    request.cache = request.cache || false;
    request.method = request.method || "GET";
    response.status = response.status || 200;
    return Ember.$.fauxjax.new({
        request: request,
        response: response
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
