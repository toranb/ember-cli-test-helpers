import Ember from "ember";

var assertElement = function(selector, type, count) {
    var element = find(selector);
    equal(element.length, count || 1, "element with selector '" + selector + "' not found");
    equal(element.attr("type"), type);
    return element;
};

var isVisible = function(selector) {
    var element = find(selector);
    equal(element.hasClass("hidden"), false);
};

var isHidden = function(selector) {
    var element = find(selector);
    equal(element.hasClass("hidden"), true);
};

var isTextInput = function(selector) {
    assertElement(selector, "text");
};

var isEmailInput = function(selector) {
    assertElement(selector, "email");
};

var isPasswordInput = function(selector) {
    assertElement(selector, "password");
};

var isTelInput = function(selector) {
    assertElement(selector, "tel");
};

var isCheckbox = function(selector) {
    assertElement(selector, "checkbox");
};

var isHiddenInput = function(name, value) {
    var element = assertElement("input[name=%@]".fmt(name), "hidden");
    equal(element.val(), value, "value of '" + value + "' is not equal to the element's value of '" + element.val() + "'");
};

var isRadioButton = function(selector, count) {
    assertElement(selector, "radio", count);
};

var isTextButton = function(selector, text, type) {
    if (!text) {
        Ember.assert("Text must be passed to the isTextButton assertion function");
    }

    var _type = type || "button";
    var element = assertElement(selector, _type);
    equal(element.text(), text);
};

var isRadioButtonWithText = function(selector, text) {
    var control = find(selector);
    var controlId = control.attr("id");
    var label = find("label").filter("[for=" + controlId + "]");

    equal(control.length, 1, "Unable to find radio button for selector " + selector);
    equal(control.attr("type"), "radio", "Element for selector " + selector + " is not a radio button; type is " + control.attr("type"));
    ok(control.attr("id"), "Radio button for selector " + selector + " has no id attribute, so it cannot be referred to by a label 'for' attribute");

    equal(label.length, 1, "Unable to find label with 'for' attribute of the selector given for the radio button, " + controlId);
    equal(label.text(), text);
};

var isLink = function(selector, text, href) {
    if (!text) {
        Ember.assert("Text must be passed to the isLink assertion function");
    }

    var element = find(selector);
    equal(element.length, 1);
    equal(element.text(), text);

    if (href) {
        equal(element.attr("href"), href);
    }
};

var isFocused = function(selector) {
    var focused = $(document.activeElement);
    var expected = $(selector);

    if (expected.length > 1) {
        Ember.assert("Too many elements for selector " + selector + " found that were expected to have focus (" +
            expected.length + "); use a more specific selector");
        return;
    }

    if (focused.length === 0) {
        Ember.assert("Expected " + selector + " to have focus, but no element currently has focus");
    } else {
        if (focused.is(expected)) {
            ok(true);
        } else {
            var tagName = focused.prop("tagName").toLowerCase();
            var classes = focused.attr("class");

            if (classes) {
                tagName = tagName + "." + classes.replace(/\s+/g, ".");
            }

            equal(focused.filter(selector).length, 1, "Expected " + selector + " to have focus, but " + tagName + " has focus");
        }
    }
};

var selectRadioButton = function(selector, value) {
    andThen(function() {
        if (value === undefined) {
            find(selector).each(function(index, element) {
                if (element.checked) {
                    element.checked = false;
                    $(element).trigger("change");
                }
            });
        } else {
            find(selector).filter("[value=%@]".fmt(value)).prop("checked", true).trigger("change");
        }
    });
};

var setCheckboxChecked = function(selector, checked) {
    andThen(function() {
        var element = find(selector)[0];

        if (element.checked !== checked) {
            click(selector);
        }
    });
};

export {isTextInput, isEmailInput, isPasswordInput, isTelInput, isHiddenInput, isCheckbox, isRadioButton, isRadioButtonWithText, isTextButton, isLink,
    isFocused, selectRadioButton, setCheckboxChecked, isHidden, isVisible};
