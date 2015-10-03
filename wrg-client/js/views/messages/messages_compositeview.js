define([
    'marionette',
    'text!templates/messages/messages.html',
    'views/messages/message_itemview',
    'collections/messages/messages',
    'views/messages/forms/compose_message_form_view'
], function (Marionette, Template, ItemView, MessageCollection, FormView) {
    'use strict';

    var MessagesCollectionView = Marionette.CompositeView.extend({
        template: Template,
        itemViewContainer: '.company-list.message-received-list',
        itemView: ItemView,

        initialize: function (params) {
            this.collection = params.collection;
            this.sentMessages = params.data;
        }
    });
    return MessagesCollectionView;
});

