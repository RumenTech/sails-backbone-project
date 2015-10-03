/**
 * Created by Mistral on 2/19/14.
 */
define([
    'marionette',
    'text!templates/groups/event.html',
    'views/groups/edit/add_event_form_view'
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

        onRender: function () {
        },

        afterRender: function () {
        },

        beforeRender: function () {
        },

        edit: function () {
            this.trigger('showModal', FormView);
        }
    });
    return EventItemView;
});


