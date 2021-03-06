import Ember from "ember";
import { test, module } from "qunit";
import {stubRequest, stubEndpointForHttpRequest} from "../helpers/stub";


module("Unit: Stub Tests", {
    afterEach: function() {
        Ember.$.fauxjax.clear();
    }
});

test("stubRequest requires a request.url", function(assert) {
    try {
        stubRequest({});
    } catch(e) {
        assert.equal(e.message, "Please provide a url for the request");
    }
});

test("stubRequest will set request.cache to false by default", function(assert) {
    stubRequest({url: "/wat", method: "GET"});
    var stub = Ember.$.fauxjax.unfired()[0];
    assert.equal(false, stub.request.cache);
});

test("stubRequest will respect request.cache if set", function(assert) {
    stubRequest({url: "/wat", method: "GET", cache: true});
    var stub = Ember.$.fauxjax.unfired()[0];
    assert.equal(true, stub.request.cache);
});

test("stubRequest will set request.method to 'GET' by default", function(assert) {
    stubRequest({url: "/wat"});
    var stub = Ember.$.fauxjax.unfired()[0];
    assert.equal("GET", stub.request.method);
});

test("stubRequest will respect request.method if set", function(assert) {
    stubRequest({url: "/wat", method: "POST"});
    var stub = Ember.$.fauxjax.unfired()[0];
    assert.equal("POST", stub.request.method);
});

test("stubRequest will respect request.contentType if set", function(assert) {
    stubRequest({url: "/wat", method: "POST", contentType: "text/plain"}, {status: 201});
    var stub = Ember.$.fauxjax.unfired()[0];
    assert.equal("text/plain", stub.request.contentType);
});

test("stubRequest will default request.contentType to 'application/x-www-form-urlencoded' if not set and no data", function(assert) {
    stubRequest({url: "/wat", method: "POST"}, {status: 201});
    var stub = Ember.$.fauxjax.unfired()[0];
    assert.equal("application/x-www-form-urlencoded", stub.request.contentType);
});

test("stubRequest will default request.contentType to 'application/json' if not set and there is request.data", function(assert) {
    stubRequest({url: "/wat", method: "POST", data: {}}, {status: 201});
    var stub = Ember.$.fauxjax.unfired()[0];
    assert.equal("application/json", stub.request.contentType);
});

test("stubRequest will set response.status to 200 by default", function(assert) {
    stubRequest({url: "/wat"});
    var stub = Ember.$.fauxjax.unfired()[0];
    assert.equal(200, stub.response.status);
});

test("stubRequest will respect response.status if set", function(assert) {
    stubRequest({url: "/wat", method: "POST"}, {status: 201});
    var stub = Ember.$.fauxjax.unfired()[0];
    assert.equal(201, stub.response.status);
});

test("stubEndpointForHttpRequest will set contentType to 'application/json' if post_data", function(assert) {
    stubEndpointForHttpRequest("/wat", {}, "POST", 201, {foo: "bar"});
    var stub = Ember.$.fauxjax.unfired()[0];
    assert.equal("application/json", stub.request.contentType);
});

test("stubEndpointForHttpRequest will default contentType to 'application/x-www-form-urlencoded' if no post_data", function(assert) {
    stubEndpointForHttpRequest("/wat", {}, "POST", 201);
    var stub = Ember.$.fauxjax.unfired()[0];
    assert.equal("application/x-www-form-urlencoded", stub.request.contentType);
});
