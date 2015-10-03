define([
    'marionette',
    'text!templates/messages/message.html',
    'views/messages/forms/compose_message_form_view',
    'views/messages/forms/delete_form_view',
    'regions/modal_region',
    'utils/conversionUtils'
], function (Marionette, Template, ComposeMessageFormView, DeleteMessageFormView, ModalRegion, ConversionUtils) {
    'use strict';

    var SentMessageItemView = Marionette.Layout.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #reply-link': 'reply',
            'click #forward-link': 'forward',
            'click #delete-link': 'deleteMessage',
            'click #sender-name': 'readMessage',
            'click #subject-id': 'readMessage',
            'click #full-message': 'readMessage',
            'click .glyphicon-flag': 'flagMessage'
        },

        regions: {
            modal: ModalRegion
        },

        initialize: function () {
            this.model.on('saved', this.render, this);
            this.content = this.model.get('content');
            var shortContent = this.content;
            if (shortContent.length > 50) {
                shortContent = shortContent.slice(0, 50) + '...';
            }
            ConversionUtils.shortenName(this.model);
            var messageDate = ConversionUtils.convertCreatedAtToLong(this.model.get('createdAt'));
            this.model.set('messageDate', messageDate);
            this.model.set('shortContent', shortContent);
        },

        reply: function () {
            this.trigger('showReply', ComposeMessageFormView);
        },

        forward: function () {
            this.trigger('forwardMessage', ComposeMessageFormView);
        },

        setReadMessageBackground: function () {
            $('#message-' + this.model.get('id')).css('background-color', 'white');
            $('#messagebottom-' + this.model.get('id')).css('background-color', 'white');
        },

        setFlaggedMessage: function () {
            if (this.model.get('is_flagged') === true) {
                $('#flag-' + this.model.get('id')).css('color', '#FF413E');
            }
        },

        onShow: function () {
            this.setReadMessageBackground();
            this.setFlaggedMessage();
        },

        readMessage: function () {
            var shortContent = this.model.get('shortContent');
            if (shortContent.length <= 53) {
                this.model.set('shortContent', this.content);
            } else {
                this.model.set('shortContent', shortContent.slice(0, 50) + '...');
            }
            this.render();
            this.setReadMessageBackground();
        },

        flagMessage: function () {
            if (this.model.get('is_flagged') === null || this.model.get('is_flagged') === false) {
                this.model.set('is_flagged', true);
                this.model.save(null, {
                    success: _.bind(function () {
                        this.setFlaggedMessage();
                    }, this),
                    error: _.bind(function (model, response) {
                        var message = response.responseText;
                        this.showMessage(this.model, message);
                    }, this)
                });
            }
            this.render();
            this.setFlaggedMessage();
            this.setReadMessageBackground();
        },

        deleteMessage: function () {
            this.showModal(DeleteMessageFormView);
        },

        showModal: function (formClass) {
            var options = {
                collection: this.collection,
                model: this.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: this.collection, model: this.model, reqres: this.reqres}, options));
        }
    });
    return SentMessageItemView;
});