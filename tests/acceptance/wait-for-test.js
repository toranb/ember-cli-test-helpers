import Ember from "ember";
import startApp from "dummy/tests/helpers/start-app";
import {waitFor} from "../helpers/utilities";
import { test, module } from "qunit";

var application;

module("Acceptance: waitFor", {
    beforeEach: function() {
        application = startApp();
    },
    afterEach: function() {
        Ember.run(application, "destroy");
    }
});

test("waitFor can be used to help test 3rd party components that dont play nice with ember-testing normally", function(assert) {
    visit("/modal");
    andThen(function () {
        waitFor(assert, function() {
            var theModal = find("#my-modal");
            assert.ok(theModal.is(":hidden"));
        });
    });
    click("#btn-open-modal");
    andThen(function () {
        waitFor(assert, function() {
            var theModal = find("#my-modal");
            assert.ok(!theModal.is(":hidden"));
        });
    });
    click("#btn-close-modal");
    andThen(function () {
        waitFor(assert, function() {
            var theModal = find("#my-modal");
            assert.ok(theModal.is(":hidden"));
        });
    });
});
