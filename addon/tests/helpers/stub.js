var stubEndpointForHttpRequest = function(url, json, verb, status, post_data) {
    return $.fauxjax.new({
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
        $.fauxjax.remove(id);
    } else {
        $.fauxjax.clear();
    }
};

export { stubEndpointForHttpRequest, clearStubHttpRequests };
