import Ember from "ember";

export default Ember.Controller.extend({
    actions: {
        showModal: function() {
            Ember.$("#my-modal").foundation("reveal", "open");
        },
        hideModal: function() {
            Ember.$("#my-modal").foundation("reveal", "close");
        }
    }
});
