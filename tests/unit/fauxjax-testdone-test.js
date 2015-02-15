/*global ok:true */
import TestDone from "ember-cli-test-helpers/tests/helpers/test-done";

// mocking global ok and console.warn
var originalOk, originalWarn;
var warnMessages, done;

module("fauxjaxTestdone", {
    setup: function() {
        warnMessages = [];
        done = TestDone.create({
            module: "test module",
            name: "test name"
        });
        originalOk = ok;
        ok = function() {};
        originalWarn = console.warn;
        console.warn = function(message) { warnMessages.push(message); };
        $.fauxjax.unfired = function() { return []; };
        $.fauxjax.unhandled = function() { return []; };
    },
    teardown: function() {
        ok = originalOk;
        console.warn = originalWarn;
    }
});

test("no warn or log messages when no unfired requests and no unhandled requests", function(assert) {
    done.testDoneCallback();
    assert.equal(warnMessages.length, 0);
});

test("1 warn message when there is one unfired request", function(assert) {
    var unfired = [
        {
            url: "/foo",
            type: "GET"
        }
    ];
    $.fauxjax.unfired = function() { return unfired; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 1);
    assert.equal(warnMessages[0], "Request: GET to /foo not FIRED for 'test name' in 'test module'");
});

test("1 warn message when there is one unhandled request", function(assert) {
    var unhandled = [
        {
            url: "/foo",
            type: "GET"
        }
    ];
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 1);
    assert.equal(warnMessages[0], "Request: GET to /foo not MOCKED for 'test name' in 'test module'");
});

test("2 warn messages when there are when both unhandled and unfired requests", function(assert) {
    var unfired = [
        {
            url: "/bar",
            type: "GET"
        }
    ];
    var unhandled = [
        {
            url: "/foo",
            type: "GET"
        }
    ];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 2);
    assert.equal(warnMessages[0], "Request: GET to /bar not FIRED for 'test name' in 'test module'");
    assert.equal(warnMessages[1], "Request: GET to /foo not MOCKED for 'test name' in 'test module'");
});

test("incorrect mock/request when same url and type on request of unfired and unhandled", function(assert) {
    var unfired = [{
        url: "/foo",
        type: "POST",
        data: {foo: "bar"}
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: {foo: "baz"}
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 4);
    assert.equal(warnMessages[0], "Mocked data:");
    assert.equal(warnMessages[1], "foo: bar");
    assert.equal(warnMessages[2], "Real Request data:");
    assert.equal(warnMessages[3], "foo: baz");
});

test("incorrect, unfired, and unhandled requests properly handled", function(assert) {
    var unfired = [
        {
            url: "/foo",
            type: "POST",
            data: {foo: "bar"}
        },
        {
            url: "/bar",
            type: "GET"
        }
    ];
    var unhandled = [
        {
            url: "/foo",
            type: "POST",
            data: {foo: "baz"}
        },
        {
            url: "/baz",
            type: "GET"
        }
    ];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 6);
    assert.equal(warnMessages[0], "Mocked data:");
    assert.equal(warnMessages[1], "foo: bar");
    assert.equal(warnMessages[2], "Real Request data:");
    assert.equal(warnMessages[3], "foo: baz");
    assert.equal(warnMessages[4], "Request: GET to /bar not FIRED for 'test name' in 'test module'");
    assert.equal(warnMessages[5], "Request: GET to /baz not MOCKED for 'test name' in 'test module'");
});

test("Incorrect contentType handled correctly when mocked contentType does not match actual contentType", function(assert) {
    var unfired = [{
        url: "/foo",
        type: "POST",
        data: {foo: "bar"},
        contentType: "foo"
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: {foo: "bar"},
        contentType: "bar"
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 2);
    assert.equal(warnMessages[0], "Mocked Content Type: foo");
    assert.equal(warnMessages[1], "Real Request Content Type: bar");
});

test("Incorrect 'headers' handled correctly when mocked headers do not match actual headers", function(assert) {
    var unfired = [{
        url: "/foo",
        type: "POST",
        data: {foo: "bar"},
        contentType: "foo",
        headers: {wat: "here"}
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: {foo: "bar"},
        contentType: "foo",
        headers: {now: "there"}
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 4);
    assert.equal(warnMessages[0], "Mocked headers:");
    assert.equal(warnMessages[1], "wat: here");
    assert.equal(warnMessages[2], "Real Request headers:");
    assert.equal(warnMessages[3], "now: there");
});

test("incorrect data will be properly formatted for console.warn even if data is JSON.stringified", function(assert) {
    var unfired = [{
        url: "/foo",
        type: "POST",
        data: JSON.stringify({foo: "bar"})
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: JSON.stringify({foo: "baz"})
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 4);
    assert.equal(warnMessages[0], "Mocked data:");
    assert.equal(warnMessages[1], "foo: bar");
    assert.equal(warnMessages[2], "Real Request data:");
    assert.equal(warnMessages[3], "foo: baz");
});

test("incorrect request data will be console.warn when no data on mocked request", function(assert) {
    var unfired = [{
        url: "/foo",
        type: "POST"
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: {foo: "baz"}
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 4);
    assert.equal(warnMessages[0], "Mocked data:");
    assert.equal(warnMessages[1], "no data");
    assert.equal(warnMessages[2], "Real Request data:");
    assert.equal(warnMessages[3], "foo: baz");
});

test("incorrect request data will be console.warn when no data on real request", function(assert) {
    var unfired = [{
        url: "/foo",
        type: "POST",
        data: {foo: "bar"}
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST"
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 4);
    assert.equal(warnMessages[0], "Mocked data:");
    assert.equal(warnMessages[1], "foo: bar");
    assert.equal(warnMessages[2], "Real Request data:");
    assert.equal(warnMessages[3], "no data");
});

test("incorrect request data will be console.warn when data is null or undefined", function(assert) {
    var unfired = [{
        url: "/foo",
        type: "POST",
        data: null
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: undefined
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 0);
});

test("incorrect request data will be console.warn when data is empty", function(assert) {
    var unfired = [{
        url: "/foo",
        type: "POST",
        data: {}
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: {}
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 0);
});
