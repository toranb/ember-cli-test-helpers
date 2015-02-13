import Ember from "ember";
import startApp from "../helpers/start-app";
import {isVisible} from "ember-cli-test-helpers/tests/helpers/input";
import {isHidden} from "ember-cli-test-helpers/tests/helpers/input";
import {isTextInput} from "ember-cli-test-helpers/tests/helpers/input";
import {isEmailInput} from "ember-cli-test-helpers/tests/helpers/input";
import {isPasswordInput} from "ember-cli-test-helpers/tests/helpers/input";
import {isTelInput} from "ember-cli-test-helpers/tests/helpers/input";
import {isHiddenInput} from "ember-cli-test-helpers/tests/helpers/input";
import {isCheckbox} from "ember-cli-test-helpers/tests/helpers/input";
import {isRadioButton} from "ember-cli-test-helpers/tests/helpers/input";
import {isRadioButtonWithText} from "ember-cli-test-helpers/tests/helpers/input";
import {isTextButton} from "ember-cli-test-helpers/tests/helpers/input";
import {isLink} from "ember-cli-test-helpers/tests/helpers/input";
import {isFocused} from "ember-cli-test-helpers/tests/helpers/input";
import {selectRadioButton} from "ember-cli-test-helpers/tests/helpers/input";
import {setCheckboxChecked} from "ember-cli-test-helpers/tests/helpers/input";

var application;

var RADIO_BUTTON = "input.radio-button";
var CHECKBOX_INPUT = "input.checkbox-input";

module("Acceptance: Usage", {
    setup: function() {
        application = startApp();
    },
    teardown: function() {
        Ember.run(application, "destroy");
    }
});

test("input with class text-input is an with type text", function(assert) {
    visit("/");
    andThen(function() {
        isTextInput("input.text-input");
    });
});

test("input with class email-input is an input with type email", function(assert) {
    visit("/");
    andThen(function() {
        isEmailInput("input.email-input");
    });
});

test("input with class password-input is an input with type password", function(assert) {
    visit("/");
    andThen(function() {
        isPasswordInput("input.password-input");
    });
});

test("input with class tel-input is an input with type tel", function(assert) {
    visit("/");
    andThen(function() {
        isTelInput("input.tel-input");
    });
});

test("input with class hidden-input is an input with type hidden", function(assert) {
    visit("/");
    andThen(function() {
        isHiddenInput("hidden-input", "");
    });
});

test("input with class checkbox-input is an input with type checkbox", function(assert) {
    visit("/");
    andThen(function() {
        isCheckbox(CHECKBOX_INPUT);
    });
});

test("inputs with class radio-button are an input with type radio and number of radio buttons is verified", function(assert) {
    visit("/");
    andThen(function() {
        isRadioButton(RADIO_BUTTON, 2);
    });
});

test("input with class radio-button-text is an input with type radio and label with specified text", function(assert) {
    visit("/");
    andThen(function() {
        isRadioButtonWithText("input.radio-button-text", "Radio Button Text");
    });
});

test("input with class text-button is an input with type button with specified text and optional type (defaulting to type=button)", function(assert) {
    visit("/");
    andThen(function() {
        isTextButton("button.text-button", "Text Button");
        isTextButton("button.text-button-submit-type", "Text Button Submit Type", "submit");
    });
});

test("link with class link is an anchor tag with specified text and optional href", function(assert) {
    visit("/");
    andThen(function() {
        isLink(".link", "link to foo");
        isLink(".link-with-href", "link to bar", "/bar");
    });
});

test("input with class focus-input is an input with the focus set", function(assert) {
    visit("/");
    andThen(function() {
        isFocused("input.focus-input");
    });
});

test("selectRadioButton helper will select given radio button with provided selector and value", function(assert) {
    visit("/");
    selectRadioButton(RADIO_BUTTON, "foo");
    andThen(function() {
        assert.equal(find(RADIO_BUTTON + ":eq(0)").prop("checked"), true);
        assert.equal(find(RADIO_BUTTON + ":eq(1)").prop("checked"), false);
    });
});

test("selectRadioButton helper will unselect all radio buttons for selector", function(assert) {
    visit("/");
    selectRadioButton(RADIO_BUTTON, "foo");
    andThen(function() {
        assert.equal(find(RADIO_BUTTON + ":eq(0)").prop("checked"), true);
        assert.equal(find(RADIO_BUTTON + ":eq(1)").prop("checked"), false);
    });
    selectRadioButton(RADIO_BUTTON);
    andThen(function() {
        assert.equal(find(RADIO_BUTTON).length, 2);
        assert.equal(find(RADIO_BUTTON + ":eq(0)").prop("checked"), false);
        assert.equal(find(RADIO_BUTTON + ":eq(1)").prop("checked"), false);
    });
});

test("setCheckboxChecked will check or uncheck the checkbox for given selector based on specified checked value", function(assert) {
    visit("/");
    // checkbox is initially unchecked
    andThen(function() {
        assert.equal(find(CHECKBOX_INPUT).prop("checked"), false);
    });
    // checkbox is checked
    setCheckboxChecked(CHECKBOX_INPUT, true);
    andThen(function() {
        assert.equal(find(CHECKBOX_INPUT).prop("checked"), true);
    });
    // checkbox will remain checked
    setCheckboxChecked(CHECKBOX_INPUT, true);
    andThen(function() {
        assert.equal(find(CHECKBOX_INPUT).prop("checked"), true);
    });
    // checkbox will be unchecked
    setCheckboxChecked(CHECKBOX_INPUT, false);
    andThen(function() {
        assert.equal(find(CHECKBOX_INPUT).prop("checked"), false);
    });
});

test("isVisible will check that element with given selector does not have class 'hidden'", function(assert) {
    visit("/");
    andThen(function() {
        isVisible(".element1");
    });
});

test("isHidden will check that element with given selector has class 'hidden'", function(assert) {
    visit("/");
    andThen(function() {
        isHidden(".element2");
    });
});
