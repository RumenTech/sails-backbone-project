define([
    'marionette',
    'text!templates/college/event.html',
    'views/college/edit/add_event_form_view'
], function (Marionette, Template, FormView) {
    "use strict";

    var EventItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .icon-edit.tip-top': 'edit'
        },

        initialize: function () {
            this.model.on('saved', this.render, this);
        },

        edit: function () {
            this.trigger('showModal', FormView);
        }
    });

    return EventItemView;
});
