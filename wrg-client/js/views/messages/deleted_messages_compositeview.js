define([
    'marionette',
    'text!templates/messages/deleted_messages.html',
    'views/messages/deleted_message_itemview',
    'collections/messages/deleted_messages',
    'views/messages/forms/compose_message_form_view'
], function (Marionette, Template, ItemView, DeletedMessageCollection, FormView) {
    'use strict';

    var DeletedMessagesCollectionView = Marionette.CompositeView.extend({
        template: Template,
        itemViewContainer: '.company-list.message-deleted-list',
        itemView: ItemView,

        initialize: function (params) {
            this.collection = params.data;
        }
    });
    return DeletedMessagesCollectionView;
});

