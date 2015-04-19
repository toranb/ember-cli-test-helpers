import Application from '../../app';

Application.initializer({
    name: 'ember-cli-test-helpers-extract-container',
    initialize: function(c) {
        window.__container__ = c;
    }
});

var lookup = function(name) {
    var container = window.__container__;
    return container.lookup(name);
};

export default lookup;
