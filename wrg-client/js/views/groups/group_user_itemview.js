define([
    'marionette',
    'text!templates/groups/group_user.html'
], function (Marionette, Template) {
    "use strict";

    var GroupUserItemView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .icon-edit.tip-top': 'edit'
        },

        initialize: function () {
            //this.model.on('saved', this.render, this);
        },

        edit: function () {
            //this.trigger('showModal', FormView);
        }
    });
    return GroupUserItemView;
});


