define([
    'backbone',
    'marionette',
    'text!templates/upgrade.html'
], function (Backbone, Marionette, Template) {
    'use strict';

    var UpgradeMessageView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click button': 'closed'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        initialize: function (params) {
            this.model = new Backbone.Model();
        },

        closed: function () {
            $('.close-reveal-modal').click();
        }
    });
    return UpgradeMessageView;
});