import TestDone from "../helpers/test-done";
import { test } from "qunit";
import QUnit from "qunit";
import module from "../helpers/module";

var originalOk, originalWarn, okCounter;

module("Unit: Module Tests", {
    beforeEach: function() {
        okCounter = 0;
        originalOk = QUnit.assert.ok;
        QUnit.assert.ok = function() { okCounter += 1; };
        originalWarn = console.warn;
        console.warn = function() {};
        $.fauxjax.unfired = function() { return []; };
        $.fauxjax.unhandled = function() { return []; };
    },
    afterEach: function(assert) {
        QUnit.assert.ok = originalOk;
        console.warn = originalWarn;
        // This is asserting that the module is configured correctly
        // with the TestDone object to pass along the assert object
        assert.equal(okCounter, 1);
    }
});

test("module will correctly pass along variables", function(assert) {
    // The assertion for this test is actually in the afterEach above
    $.fauxjax.unfired = function() { return [{
        request: {
            url: "/foo",
            type: "GET"
        }
    }]; };
});
