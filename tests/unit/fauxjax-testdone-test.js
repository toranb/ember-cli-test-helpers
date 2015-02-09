import TestDone from "ember-cli-test-helpers/tests/helpers/test-done";

var details = {
    module: "test module",
    name: "test name"
};

module("fauxjaxTestdone", {
    setup: function() {
        $.fauxjax = {};
        $.fauxjax.unfired = function() { return []; };
        $.fauxjax.unhandled = function() { return []; };
        $.fauxjax.clear = function() {};
    }
});

test("no unfired requests and no unmocked requests returns 0", function() {
    var done = TestDone.create(details);
    ok(!done.testDoneCallback());
});

test("overMocked called when unfired requests", function() {
    var called = false;
    var done = TestDone.create(details);
    var unfired = [
        {
            url: "/foo",
            type: "GET"
        }
    ];
    $.fauxjax.unfired = function() { return unfired; };
    done.overMocked = function() { called = true; };
    ok(!called);
    equal(done.testDoneCallback(), "unfired");
    ok(called);
});

test("underMocked called when unhandled requests", function() {
    var called = false;
    var done = TestDone.create(details);
    var unhandled = [
        {
            url: "/foo",
            type: "GET"
        }
    ];
    $.fauxjax.unhandled = function() { return unhandled; };
    done.underMocked = function() { called = true; };
    ok(!called);
    equal(done.testDoneCallback(), "unhandled");
    ok(called);
});

test("overMocked and underMocked called when both unhandled and unfired requests", function() {
    var overMockedCalled = false;
    var underMockedCalled = false;
    var done = TestDone.create(details);
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
    done.overMocked = function() { overMockedCalled = true; };
    done.underMocked = function() { underMockedCalled = true; };
    ok(!overMockedCalled);
    ok(!underMockedCalled);
    equal(done.testDoneCallback(), "unfired and unhandled");
    ok(overMockedCalled);
    ok(underMockedCalled);
});

test("incorrect mock/request when same url and type on request of unfired and unhandled", function() {
    var incorrectMockCalled = false;
    var done = TestDone.create(details);
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
    done.incorrectlyMocked = function() { incorrectMockCalled = true; };
    ok(!incorrectMockCalled);
    equal(done.testDoneCallback(), "incorrect");
    ok(incorrectMockCalled);
});

test("incorrect, unfired, and unhandled requests properly handled", function() {
    var incorrectMockCalled = false;
    var overMockedCalled = false;
    var underMockedCalled = false;
    var done = TestDone.create(details);
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
    done.overMocked = function() { overMockedCalled = true; };
    done.underMocked = function() { underMockedCalled = true; };
    done.incorrectlyMocked = function() { incorrectMockCalled = true; };
    ok(!overMockedCalled);
    ok(!underMockedCalled);
    ok(!incorrectMockCalled);
    equal(done.testDoneCallback(), "incorrect, unfired, and unhandled");
    ok(overMockedCalled);
    ok(underMockedCalled);
    ok(incorrectMockCalled);
});
