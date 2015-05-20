import TestDone from "../helpers/test-done";
import { test } from "qunit";
import QUnit from "qunit";
import module from "../helpers/module";
import {stubEndpointForHttpRequest} from "../helpers/stub";

var originalOk, originalWarn, okCounter;

module("Unit: Module Tests", {
    beforeEach: function() {
        okCounter = 0;
        originalOk = QUnit.assert.ok;
        QUnit.assert.ok = function() { okCounter += 1; };
        originalWarn = console.warn;
        console.warn = function() {};
    },
    afterEach: function(assert) {
        QUnit.assert.ok = originalOk;
        console.warn = originalWarn;
        // This is asserting that the module is configured correctly
        // with the TestDone object to pass along the assert object
        assert.equal(okCounter, 3);
    }
});

test("module will fail if unhandled, unfired, or incorrect requests", function(assert) {
    // The assertion for this test is actually in the afterEach above
    $.getJSON("/foo");
    stubEndpointForHttpRequest("/bar", {}, "GET");
    stubEndpointForHttpRequest("/wat", {}, "POST");
    $.ajax({
        method: "POST",
        url: "/wat",
        data: {foo: "bar"}
    });
});
