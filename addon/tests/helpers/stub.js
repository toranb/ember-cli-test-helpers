import Ember from "ember";

var stubEndpointForHttpRequest = function(url, json, verb, status, post_data) {
    return Ember.$.fauxjax.new({
        type: verb || "GET",
        url: url,
        status: status || 200,
        dataType: "json",
        contentType: "application/json",
        responseText: json,
        data: post_data,
        cache: false
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
