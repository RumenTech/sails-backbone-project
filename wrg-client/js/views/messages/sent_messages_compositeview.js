define([
    'marionette',
    'text!templates/messages/sent_messages.html',
    'views/messages/sent_message_itemview',
    'collections/messages/sent_messages',
    'views/messages/forms/compose_message_form_view'
], function (Marionette, Template, ItemView, SentMessageCollection, FormView) {
    'use strict';

    var SentMessagesCollectionView = Marionette.CompositeView.extend({
        template: Template,
        itemViewContainer: '.company-list.message-sent-list',
        itemView: ItemView,

        initialize: function (params) {
            this.collection = params.data;
        }
    });

    return SentMessagesCollectionView;
});

