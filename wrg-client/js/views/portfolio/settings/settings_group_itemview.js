define([
    'marionette',
    'text!templates/portfolio/settings/group.html',
    'views/portfolio/settings/remove_group_form_view',
    'views/error_message_view',
    'models/groups/group'
], function (Marionette, Template, DeleteFormView, ErrorMessageView, Group) {
    'use strict';

    var SettingsGroupItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #delete-item': 'deleteGroup'
        },

        regions: {
            message: '.validation-messages'
        },

        initialize: function () {
            var aux = this.model.collection.session.id;
            var user_id = this.model.get('user_id');
            if (user_id === aux) {
                this.model.set('aux', '1');
            }
            this.model.on('saved', this.render, this);
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        deleteGroup: function () {
            this.trigger('showModal', DeleteFormView);
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return SettingsGroupItemView;
});