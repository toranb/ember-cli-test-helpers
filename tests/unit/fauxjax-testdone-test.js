/*global ok:true */
import TestDone from "ember-cli-test-helpers/tests/helpers/test-done";

var originalOk, originalWarn, originalLog, done;

module("fauxjaxTestdone", {
    setup: function() {
        done = TestDone.create({
            module: "test module",
            name: "test name"
        });
        originalOk = ok;
        ok = function() {};
        originalWarn = console.warn;
        console.warn = function() {};
        originalLog = console.log;
        console.log = function() {};
        $.fauxjax.unfired = function() { return []; };
        $.fauxjax.unhandled = function() { return []; };
    },
    teardown: function() {
        ok = originalOk;
        console.warn = originalWarn;
        console.log = originalLog;
    }
});

test("no unfired requests and no unmocked requests returns undefined", function(assert) {
    assert.equal(done.testDoneCallback(), undefined);
});

test("'unfired' returned when there are unfired requests", function(assert) {
    var unfired = [
        {
            url: "/foo",
            type: "GET"
        }
    ];
    $.fauxjax.unfired = function() { return unfired; };
    assert.equal(done.testDoneCallback(), "unfired");
});

test("'unhandled' when there are unhandled requests", function(assert) {
    var unhandled = [
        {
            url: "/foo",
            type: "GET"
        }
    ];
    $.fauxjax.unhandled = function() { return unhandled; };
    assert.equal(done.testDoneCallback(), "unhandled");
});

test("'unfired and unhandled' returned there are when both unhandled and unfired requests", function(assert) {
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
    assert.equal(done.testDoneCallback(), "unfired and unhandled");
});

test("incorrect mock/request when same url and type on request of unfired and unhandled", function(assert) {
    var unfired = [
        {
            url: "/foo",
            type: "POST",
            data: {foo: "bar"}
        }
    ];
    var unhandled = [
        {
            url: "/foo",
            type: "POST",
            data: {foo: "baz"}
        }
    ];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    assert.equal(done.testDoneCallback(), "incorrect");
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
    assert.equal(done.testDoneCallback(), "incorrect, unfired, and unhandled");
});

test("_configureLists will properly sort out unfired, unhandled, and incorrect", function(assert) {
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
            url: "/wat",
            type: "GET"
        },
        {
            url: "/baz",
            type: "GET"
        }
    ];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    var lists = done._configureLists();
    assert.equal(lists.incorrect.length, 1);
    assert.equal(lists.unfired.length, 1);
    assert.equal(lists.unhandled.length, 2);
});

test("_createMessage will be called only for the lists created from _configureLists", function(assert) {
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
            url: "/wat",
            type: "GET"
        },
        {
            url: "/baz",
            type: "GET"
        }
    ];
    $.fauxjax.unfired = function() { return unfired; };
    $.fauxjax.unhandled = function() { return unhandled; };
    var counter = 0;
    done._createMessage = function() { counter += 1; };
    done.testDoneCallback();
    assert.equal(counter, 3);
});

test("incorrectMessage returns 'incorrect data' when stubbed data does not match actual data", function(assert) {
    var request = {
        unfired: {
            url: "/foo",
            type: "POST",
            data: {foo: "bar"}
        },
        unhandled: {
            url: "/foo",
            type: "POST",
            data: {foo: "baz"}
        }
    };
    var output = done._incorrectMessage(request);
    assert.equal(output.length, 1);
    assert.equal(output[0].error, "data");
});

test("incorrect data will console log properly even if data is JSON.stringified", function(assert) {
    var request = {
        unfired: {
            url: "/foo",
            type: "POST",
            data: JSON.stringify({foo: "bar"})
        },
        unhandled: {
            url: "/foo",
            type: "POST",
            data: JSON.stringify({foo: "baz"})
        }
    };
    var output = done._incorrectMessage(request);
    assert.equal(output.length, 1);
    assert.equal(output[0].error, "data");
});
