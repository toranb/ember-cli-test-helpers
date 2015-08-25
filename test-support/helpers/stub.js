import Ember from "ember";

var setupRequest = function setupRequest(request) {
    request = request || {};
    // request must have url set
    if(!request.url) {
        throw Error("Please provide a url for the request");
    }
    // set some reasonable defaults that can be overridden
    request.cache = request.cache || false;
    request.method = request.method || "GET";
    if(request.data) {
        var contentType = "application/json";
    } else {
        var contentType = "application/x-www-form-urlencoded";
    }
    request.contentType = request.contentType || contentType;
    return request;
};

var setupResponse = function setupResponse(response) {
    response = response || {};
    // set some reasonable defaults that can be overridden
    response.status = response.status || 200;
    return response;
};

var stubRequest = function(request, response) {
    var fauxRequest = setupRequest(request);
    var fauxResponse = setupResponse(response);
    return Ember.$.fauxjax.new({
        request: fauxRequest,
        response: fauxResponse
    });
};

var stubEndpointForHttpRequest = function(url, json, verb, status, post_data) {
    var request = {
        url: url,
        method: verb || "GET",
        data: post_data,
        cache: false,
        contentType: "application/x-www-form-urlencoded"
    };
    if(post_data) {
        request.contentType = "application/json";
    }
    return Ember.$.fauxjax.new({
        request: request,
        response: {
            status: status || 200,
            content: json
        }
    });
};

var clearStubRequests = function(id) {
    clearStubHttpRequests(id);
};

var clearStubHttpRequests = function(id) {
    if (typeof id !== "undefined") {
        Ember.$.fauxjax.remove(id);
    } else {
        Ember.$.fauxjax.clear();
    }
};

export { stubEndpointForHttpRequest, clearStubHttpRequests, stubRequest, clearStubRequests };
