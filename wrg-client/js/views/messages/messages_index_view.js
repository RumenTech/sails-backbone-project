define([
    'marionette',
    'text!templates/messages/messages_index.html',
    'regions/modal_region',
    'views/messages/messages_compositeview',
    'views/messages/sent_messages_compositeview',
    'views/messages/deleted_messages_compositeview',
    'collections/messages/sent_messages',
    'collections/messages/messages',
    'collections/messages/deleted_messages',
    'collections/messages/unread_messages',
    'collections/messages/flagged_messages',
    'views/messages/forms/compose_message_form_view',
    'views/messages/sponsors_view'
], function (Marionette, Template, ModalRegion, MessagesCompositeView, SentMessagesCompositeView, DeletedMessagesCompositeView, SentMessageCollection, ReceivedMessageCollection, DeletedMessageCollection, UnreadMessageCollection, FlaggedMessageCollection, ComposeMessageFormView, SponsorsView) {
    'use strict';

    var MessagesIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            composeMessage: '#compose-message',
            receivedMessages: '#messages-received',
            sentMessages: '#messages-sent',
            unreadMessages: '#messages-unread',
            deletedMessages: '#messages-deleted',
            sponsors: '#sponsors-section'
        },

        events: {
            'click #compose-link': 'composeNewMessage',
            'click #inbox-link': 'showReceivedMessagesSection',
            'click #sent-link': 'showSentMessagesSection',
            'click #deleted-link': 'showDeletedMessagesSection',
            'click #unread-link': 'showUnreadMessagesSection',
            'click #flagged-link': 'showFlaggedMessagesSection',
            'click #all-link': 'showReceivedMessagesSection',
            'click #moreReceivedMessages': 'moreReceivedMessages',
            'click #moreDeletedMessages': 'moreDeletedMessages',
            'click #moreSentMessages': 'moreSentMessages'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.sentMessagesCollection = new SentMessageCollection(options.data, options);
            this.deletedMessagesCollection = new DeletedMessageCollection(options.data, options);
            this.receivedMessagesCollection = new ReceivedMessageCollection(options.data, options);
            this.unreadMessagesCollection = new UnreadMessageCollection(options.data, options);
            this.flaggedMessagesCollection = new FlaggedMessageCollection(options.data, options);

            this.receivedOffset = 0;
            this.sentOffset = 0;
            this.deletedOffset = 0;

            var config = this.reqres.request('config');
            $("#pageloader").fadeIn(300).delay(config.spinnerTimeout).fadeOut(300);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');

            this.receivedMessages.show(new MessagesCompositeView({
                reqres: this.reqres,
                data: this.sentMessagesCollection,
                collection: this.receivedMessagesCollection
            }));

            this.sentMessages.show(new SentMessagesCompositeView({
                reqres: this.reqres,
                data: this.sentMessagesCollection
            }));

            this.deletedMessages.show(new DeletedMessagesCompositeView({
                reqres: this.reqres,
                data: this.deletedMessagesCollection
            }));
            this.sponsors.show(new SponsorsView());

            this.listenTo(this.receivedMessages.currentView, 'showModal itemview:showModal', this.composeNewMessage, this);
            this.listenTo(this.receivedMessages.currentView, 'showModal itemview:forwardMessage', this.forwardMessage, this);
            //this.listenTo(this.sentMessages.currentView, 'showModal itemview:showModal', this.composeNewMessage, this);
            this.listenTo(this.sentMessages.currentView, 'showModal itemview:showReply', this.replyOnMessage, this);
            this.listenTo(this.sentMessages.currentView, 'showModal itemview:forwardMessage', this.forwardMessage, this);

            this.listenTo(this.deletedMessages.currentView, 'showModal itemview:showModal', this.composeNewMessage, this);
        },

        forwardMessage: function (forward) {
            this.composeMessage.show(new ComposeMessageFormView({
                reqres: this.reqres,
                model: forward.model,
                forward: forward.model,
                sender_id: this.session.id
            }));
            $("#compose-message").show();
            $("#messages-received").hide();
            $("#messages-deleted").hide();
            $("#messages-sent").hide();
        },

        replyOnMessage: function (reply) {
            this.composeMessage.show(new ComposeMessageFormView({
                reqres: this.reqres,
                model: reply.model,
                reply: reply.model,
                sender_id: this.session.id
            }));
            $("#compose-message").show();
            $("#messages-received").hide();
            $("#messages-deleted").hide();
            $("#messages-sent").hide();
        },

        showUnreadMessagesSection: function () {
            this.receivedMessages.show(new MessagesCompositeView({
                reqres: this.reqres,
                data: this.sentMessagesCollection,
                collection: this.unreadMessagesCollection
            }));

            this.unreadMessagesCollection.fetch();
            this.unreadMessagesCollection.reset();

            this.receivedOffset = 0;
            this.sentOffset = 0;
            this.deletedOffset = 0;
            $("#messages-received").show();
            $("#messages-deleted").hide();
            $("#messages-sent").hide();
            $("#compose-message").hide();

            $("#moreReceivedMessages").hide();
            $("#moreDeletedMessages").hide();
            $("#moreSentMessages").show();
            this.listenTo(this.receivedMessages.currentView, 'showModal itemview:showModal', this.composeNewMessage, this);
            this.listenTo(this.receivedMessages.currentView, 'showModal itemview:forwardMessage', this.forwardMessage, this);
        },

        showFlaggedMessagesSection: function () {
            this.receivedMessages.show(new MessagesCompositeView({
                reqres: this.reqres,
                data: this.sentMessagesCollection,
                collection: this.flaggedMessagesCollection
            }));

            this.flaggedMessagesCollection.fetch();
            this.flaggedMessagesCollection.reset();

            this.receivedOffset = 0;
            this.sentOffset = 0;
            this.deletedOffset = 0;
            $("#messages-received").show();
            $("#messages-deleted").hide();
            $("#messages-sent").hide();
            $("#compose-message").hide();

            $("#moreReceivedMessages").hide();
            $("#moreDeletedMessages").hide();
            $("#moreSentMessages").show();
            this.listenTo(this.receivedMessages.currentView, 'showModal itemview:showModal', this.composeNewMessage, this);
            this.listenTo(this.receivedMessages.currentView, 'showModal itemview:forwardMessage', this.forwardMessage, this);
        },

        composeNewMessage: function (model) {
            if (model.model) {
                this.composeMessage.show(new ComposeMessageFormView({
                    reqres: this.reqres,
                    model: model.model,
                    sender_id: this.session.id
                }));
            } else {
                this.composeMessage.show(new ComposeMessageFormView({
                    reqres: this.reqres,
                    sender_id: this.session.id
                }));
            }

            $("#compose-message").show();
            $("#messages-received").hide();
            $("#messages-deleted").hide();
            $("#messages-sent").hide();
            $("#moreReceivedMessages").hide();
            $("#moreDeletedMessages").hide();
            $("#moreSentMessages").hide();
        },

        showModal: function (formClass) {
            var options = {
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({reqres: this.reqres, sender_id: this.session.id}, options));
        },

        onShow: function () {
            $("#messages-received").show();
            $("#messages-deleted").hide();
            $("#compose-message").hide();
            $("#messages-sent").hide();

            $("#moreReceivedMessages").show();
            $("#moreDeletedMessages").hide();
            $("#moreSentMessages").hide();
        },

        showSentMessages: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.sentMessagesCollection,
                reqres: this.reqres,
                //company : this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, sender_id: this.session.id, reqres: this.reqres}, options));
        },

        showDeletedMessages: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.deletedMessagesCollection,
                reqres: this.reqres
                //company : this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, sender_id: this.session.id, reqres: this.reqres}, options));
        },

        showReceivedMessages: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.sentMessagesCollection,
                reqres: this.reqres
                //company : this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, sender_id: this.session.id, reqres: this.reqres}, options));
        },

        showReceivedMessagesSection: function () {
            this.receivedMessages.show(new MessagesCompositeView({
                reqres: this.reqres,
                data: this.sentMessagesCollection,
                collection: this.receivedMessagesCollection
            }));

            this.receivedMessagesCollection.fetch();
            this.receivedMessagesCollection.reset();

            this.receivedOffset = 0;
            this.sentOffset = 0;
            this.deletedOffset = 0;

            $("#messages-received").show();
            $("#messages-deleted").hide();
            $("#messages-sent").hide();
            $("#compose-message").hide();

            $("#moreReceivedMessages").show();
            $("#moreDeletedMessages").hide();
            $("#moreSentMessages").hide();

            $('#moreReceivedMessages').html('View more messages');
            this.listenTo(this.receivedMessages.currentView, 'showModal itemview:showModal', this.composeNewMessage, this);
            this.listenTo(this.receivedMessages.currentView, 'showModal itemview:forwardMessage', this.forwardMessage, this);
        },

        showSentMessagesSection: function () {
            this.sentMessagesCollection.fetch();
            this.sentMessagesCollection.reset();

            this.receivedOffset = 0;
            this.sentOffset = 0;
            this.deletedOffset = 0;

            $("#messages-received").hide();
            $("#messages-deleted").hide();
            $("#messages-sent").show();
            $("#compose-message").hide();

            $("#moreReceivedMessages").hide();
            $("#moreDeletedMessages").hide();
            $("#moreSentMessages").show();

            $('#moreSentMessages').html('View more messages');
        },

        showDeletedMessagesSection: function () {
            this.deletedMessagesCollection.fetch();
            this.deletedMessagesCollection.reset();

            this.receivedOffset = 0;
            this.sentOffset = 0;
            this.deletedOffset = 0;

            $("#messages-received").hide();
            $("#messages-sent").hide();
            $("#messages-deleted").show();
            $("#compose-message").hide();

            $("#moreReceivedMessages").hide();
            $("#moreDeletedMessages").show();
            $("#moreSentMessages").hide();

            $('#moreDeletedMessages').html('View more messages');
        },

        moreReceivedMessages: function () {
            if (this.receivedMessagesCollection.length > 4) {
                this.receivedOffset = this.receivedOffset + 5;
                this.receivedMessagesCollection.fetch({
                        data: $.param({
                            offset: this.receivedOffset,
                            limit: 5
                        }),
                        success: _.bind(function () {
                            var endCollection = this.receivedOffset + this.receivedMessagesCollection.length;
                            $('#moreReceivedMessages').html('( ' + this.receivedOffset + ' - ' + endCollection + ' ) View more messages');
                        }, this)}
                );
                this.receivedMessagesCollection.reset();
            } else {
                this.receivedOffset = 0;
            }
        },

        moreDeletedMessages: function () {
            if (this.deletedMessagesCollection.length > 4) {
                this.deletedOffset = this.deletedOffset + 5;
                this.deletedMessagesCollection.fetch({
                        data: $.param({
                            offset: this.deletedOffset,
                            limit: 5
                        }),
                        success: _.bind(function () {
                            var endCollection = this.deletedOffset + this.deletedMessagesCollection.length;
                            $('#moreDeletedMessages').html('( ' + this.deletedOffset + ' - ' + endCollection + ' ) View more messages');

                        }, this)}
                );
                this.deletedMessagesCollection.reset();
            } else {
                this.deletedOffset = 0;
            }
        },

        moreSentMessages: function () {

            if (this.sentMessagesCollection.length > 4) {
                this.sentOffset = this.sentOffset + 5;

                this.sentMessagesCollection.fetch({
                        data: $.param({
                            offset: this.sentOffset,
                            limit: 5
                        }),
                        success: _.bind(function () {
                            var endCollection = this.sentOffset + this.sentMessagesCollection.length;
                            $('#moreSentMessages').html('( ' + this.sentOffset + ' - ' + endCollection + ' ) View more messages');

                        }, this)}
                );
                this.sentMessagesCollection.reset();
            } else {
                this.sentOffset = 0;
            }
        }
    });
    return MessagesIndexView;
});
