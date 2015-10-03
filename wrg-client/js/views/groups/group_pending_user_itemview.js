define([
    'marionette',
    'text!templates/groups/group_pending_user.html'
], function(Marionette, Template) {
    "use strict";

    var EventItemView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .icon-edit.tip-top': 'edit'
        },

        initialize: function() {
        },

        edit: function() {
        }
    });
    return EventItemView;
});


