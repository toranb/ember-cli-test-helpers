import { test } from "qunit";
import QUnit from "qunit";
import module from "../helpers/module";
import {stubRequest} from "../helpers/stub";

var originalOk, okCounter;

module("Unit: Stub Tests", {
    beforeEach: function() {
        okCounter = 0;
        originalOk = QUnit.assert.ok;
        QUnit.assert.ok = function() { okCounter += 1; };
    },
    afterEach: function(assert) {
        QUnit.assert.ok = originalOk;
        // This is asserting all stubs for requests are properly handled
        assert.equal(okCounter, 0);
    }
});

test('module will not fail if stub does not specify response.content', function(assert) {
    stubRequest({url: "/wat", method: "POST"});
    $.ajax({
        method: "POST",
        url: "/wat"
    });
    stubRequest({url: "/foo"});
    $.ajax({
        method: "GET",
        url: "/foo"
    });
});
