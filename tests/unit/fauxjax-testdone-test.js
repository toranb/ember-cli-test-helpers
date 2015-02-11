/*global ok:true */
import TestDone from "ember-cli-test-helpers/tests/helpers/test-done";

var originalOk, originalWarn, done;

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
        $.fauxjax.unfired = function() { return []; };
        $.fauxjax.unhandled = function() { return []; };
    },
    teardown: function() {
        ok = originalOk;
        console.warn = originalWarn;
    }
});

test("no unfired requests and no unmocked requests returns 0", function() {
    equal(done.testDoneCallback(), undefined);
});

test("overMocked called when unfired requests", function() {
    var unfired = [
        {
            url: "/foo",
            type: "GET"
        }
    ];
    $.fauxjax.unfired = function() { return unfired; };
    equal(done.testDoneCallback(), "unfired");
});

test("underMocked called when unhandled requests", function() {
    var unhandled = [
        {
            url: "/foo",
            type: "GET"
        }
    ];
    $.fauxjax.unhandled = function() { return unhandled; };
    equal(done.testDoneCallback(), "unhandled");
});

test("overMocked and underMocked called when both unhandled and unfired requests", function() {
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
    equal(done.testDoneCallback(), "unfired and unhandled");
});

test("incorrect mock/request when same url and type on request of unfired and unhandled", function() {
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
    equal(done.testDoneCallback(), "incorrect");
});

test("incorrect, unfired, and unhandled requests properly handled", function() {
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
    equal(done.testDoneCallback(), "incorrect, unfired, and unhandled");
});

test("incorrectMessage returns 'incorrect data' when stubbed data does not match actual data", function() {
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
    equal(output.length, 1);
    equal(output[0].error, "data");
});
