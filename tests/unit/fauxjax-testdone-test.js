import TestDone from "../helpers/test-done";
import { test, module } from "qunit";
import QUnit from "qunit";

var originalOk, originalWarn;
var warnMessages, done;
var originalUnfired, originalUnhandled;

module("fauxjaxTestdone", {
    beforeEach: function() {
        warnMessages = [];
        done = TestDone.create({
            module: "test module",
            name: "test name"
        });
        originalOk = QUnit.assert.ok;
        QUnit.assert.ok = function() {};
        originalWarn = console.warn;
        console.warn = function(message) { warnMessages.push(message); };
        originalUnfired = $.fauxjax.unfired;
        originalUnhandled = $.fauxjax.unhandled;
        $.fauxjax.unfired = function() { return []; };
        $.fauxjax.unhandled = function() { return []; };
    },
    afterEach: function() {
        QUnit.assert.ok = originalOk;
        console.warn = originalWarn;
        $.fauxjax.unfired = originalUnfired;
        $.fauxjax.unhandled = originalUnhandled;
    }
});

test("no warn or log messages when no unfired requests and no unhandled requests", function(assert) {
    done.testDoneCallback();
    assert.equal(warnMessages.length, 0);
});

test("1 warn message when there is one unfired request", function(assert) {
    var unfired = [{
        request: {
            url: "/foo",
            type: "GET"
        }
    }];
    $.fauxjax.unfired = function() { return unfired; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 2);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: GET to /foo not FIRED");
});

test("1 warn message when there is one unfired request with method", function(assert) {
    var unfired = [{
        request: {
            url: "/foo",
            method: "GET"
        }
    }];
    $.fauxjax.unfired = function() { return unfired; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 2);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: GET to /foo not FIRED");
});

test("1 warn message when there is one unhandled request", function(assert) {
    var unhandled = [{
        url: "/foo",
        type: "GET"
    }];
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 2);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: GET to /foo not MOCKED");
});

test("2 warn messages when there are when both unhandled and unfired requests", function(assert) {
    var unfired = [{
        request: {
            url: "/bar",
            method: "GET"
        }
    }];
    var unhandled = [{
        url: "/foo",
        type: "GET"
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 4);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: GET to /bar not FIRED");
    assert.equal(warnMessages[2], "test module test name");
    assert.equal(warnMessages[3], "Request: GET to /foo not MOCKED");
});

test("incorrect mock/request when same url and type on request of unfired and unhandled", function(assert) {
    var unfired = [{
        request: {
            url: "/foo",
            type: "POST",
            data: {foo: "bar"}
        }
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: {foo: "baz"}
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 6);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: POST to /foo not CORRECT");
    assert.equal(warnMessages[2], "Mocked data:");
    assert.equal(warnMessages[3], "foo: bar");
    assert.equal(warnMessages[4], "Real Request data:");
    assert.equal(warnMessages[5], "foo: baz");
});

test("incorrect, unfired, and unhandled requests properly handled", function(assert) {
    var unfired = [
        {
            request: {
                url: "/foo",
                type: "POST",
                data: {foo: "bar"}
            }
        },
        {
            request: {
                url: "/bar",
                type: "GET"
            }
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
    assert.equal(warnMessages.length, 10);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: POST to /foo not CORRECT");
    assert.equal(warnMessages[2], "Mocked data:");
    assert.equal(warnMessages[3], "foo: bar");
    assert.equal(warnMessages[4], "Real Request data:");
    assert.equal(warnMessages[5], "foo: baz");
    assert.equal(warnMessages[6], "test module test name");
    assert.equal(warnMessages[7], "Request: GET to /bar not FIRED");
    assert.equal(warnMessages[8], "test module test name");
    assert.equal(warnMessages[9], "Request: GET to /baz not MOCKED");
});

test("Incorrect 'headers' handled correctly when mocked headers do not match actual headers", function(assert) {
    var unfired = [{
        request: {
            url: "/foo",
            type: "POST",
            data: {foo: "bar"},
            headers: {wat: "here"}
        }
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: {foo: "bar"},
        headers: {now: "there"}
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 6);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: POST to /foo not CORRECT");
    assert.equal(warnMessages[2], "Mocked headers:");
    assert.equal(warnMessages[3], "wat: here");
    assert.equal(warnMessages[4], "Real Request headers:");
    assert.equal(warnMessages[5], "now: there");
});

test("incorrect data will be properly formatted for console.warn even if data is JSON.stringified", function(assert) {
    var unfired = [{
        request: {
            url: "/foo",
            type: "POST",
            data: JSON.stringify({foo: "bar"})
        }
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: JSON.stringify({foo: "baz"})
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 6);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: POST to /foo not CORRECT");
    assert.equal(warnMessages[2], "Mocked data:");
    assert.equal(warnMessages[3], "foo: bar");
    assert.equal(warnMessages[4], "Real Request data:");
    assert.equal(warnMessages[5], "foo: baz");
});

test("incorrect request data will be console.warn when no data on mocked request", function(assert) {
    var unfired = [{
        request: {
            url: "/foo",
            type: "POST"
        }
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: {foo: "baz"}
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 6);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: POST to /foo not CORRECT");
    assert.equal(warnMessages[2], "Mocked data:");
    assert.equal(warnMessages[3], "no data");
    assert.equal(warnMessages[4], "Real Request data:");
    assert.equal(warnMessages[5], "foo: baz");
});

test("incorrect request data will be console.warn when no data on real request", function(assert) {
    var unfired = [{
        request: {
            url: "/foo",
            type: "POST",
            data: {foo: "bar"}
        }
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST"
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 6);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: POST to /foo not CORRECT");
    assert.equal(warnMessages[2], "Mocked data:");
    assert.equal(warnMessages[3], "foo: bar");
    assert.equal(warnMessages[4], "Real Request data:");
    assert.equal(warnMessages[5], "no data");
});

test("incorrect request data will be console.warn when data is null or undefined", function(assert) {
    var unfired = [{
        request: {
            url: "/foo",
            type: "POST",
            data: null
        }
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: {foo: "bar"}
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 6);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: POST to /foo not CORRECT");
    assert.equal(warnMessages[2], "Mocked data:");
    assert.equal(warnMessages[3], "no data");
    assert.equal(warnMessages[4], "Real Request data:");
    assert.equal(warnMessages[5], "foo: bar");
});

test("incorrect request data will be console.warn when data is null or undefined", function(assert) {
    var unfired = [{
        request: {
            url: "/foo",
            type: "POST",
            data: {foo: "bar"}
        }
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: undefined
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 6);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: POST to /foo not CORRECT");
    assert.equal(warnMessages[2], "Mocked data:");
    assert.equal(warnMessages[3], "foo: bar");
    assert.equal(warnMessages[4], "Real Request data:");
    assert.equal(warnMessages[5], "no data");
});

test("requests will match when data is empty", function(assert) {
    var unfired = [{
        request: {
            url: "/foo",
            type: "POST",
            data: {}
        }
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: {}
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 2);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: POST to /foo not CORRECT");
});

test("incorrect request data will be console.warn when either data is empty", function(assert) {
    var unfired = [{
        request: {
            url: "/foo",
            type: "POST",
            data: {}
        }
    }];
    var unhandled = [{
        url: "/foo",
        type: "POST",
        data: {foo: "bar"}
    }];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    done.testDoneCallback();
    assert.equal(warnMessages.length, 6);
    assert.equal(warnMessages[0], "test module test name");
    assert.equal(warnMessages[1], "Request: POST to /foo not CORRECT");
    assert.equal(warnMessages[2], "Mocked data:");
    assert.equal(warnMessages[3], "no data");
    assert.equal(warnMessages[4], "Real Request data:");
    assert.equal(warnMessages[5], "foo: bar");
});
