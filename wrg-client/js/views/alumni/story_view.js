define([
    'marionette',
    'text!templates/alumni/story.html'
], function (Marionette, Template) {
    "use strict";

    var StoryView = Marionette.ItemView.extend({
        template: Template,

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        initialize: function (params) {
            this.model = params.model;
        }
    });

    return StoryView;
});