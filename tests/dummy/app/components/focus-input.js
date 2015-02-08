import Ember from "ember";

export default Ember.TextField.extend({
    tagName: "input",
    didInsertElement: function() {
        this.$().focus();
    }
});
