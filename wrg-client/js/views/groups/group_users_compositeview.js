define([
    'marionette',
    'text!templates/groups/group_users.html',
    'views/groups/group_user_itemview',
    'collections/groups/group_users',
    'models/groups/group_user',
    'views/groups/edit/add_moderator_form_view',
    'views/groups/edit/add_administrator_form_view',
    'views/groups/edit/new_message_form_view'

], function (Marionette, Template, ItemView, UsersCollection, Model, NewModeratorView, NewAdministratorView, MessageFormView) {
    "use strict";

    var GroupUsersCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '#groupImages',

        initialize: function (params) {
            this.role = params.role;
            this.collection = new UsersCollection(params.data, params);
            //Setting any model, so the number of member can be shown on UI
            this.model = new Backbone.Model();
            this.model.set('role', this.role);
            this.model.set('groupId', params.groupId);
            var numberOfUsers = 0;
            this.collection.models.forEach(function (users) {
                if (users.get('role') !== undefined && users.get('role') !== null && users.get('role') !== '') {
                    numberOfUsers++;
                }
            });
            this.model.set('numberOfUsers', numberOfUsers);
        },

        events: {
            'click #newModerator': 'newModerator',
            'click #newAdministrator': 'newAdministrator',
            'click #groupMessage': 'sendMessage'
        },

        onRender: function () {
            if (this.role === "admin" || this.role === "moderator") {
                this.$el.find('#groupMessage').show();
            }
        },

        newModerator: function () {
            this.trigger('showModal', this, NewModeratorView, this.collection);
        },

        newAdministrator: function () {
            this.trigger('showModal', this, NewAdministratorView, this.collection);
        },

        sendMessage: function () {
            this.trigger('showModal', this, MessageFormView);
        }
    });
    return GroupUsersCollectionView;
});
