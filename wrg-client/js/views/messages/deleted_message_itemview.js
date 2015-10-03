define([
    'marionette',
    'text!templates/messages/message.html',
    'views/messages/forms/compose_message_form_view' ,
    'utils/conversionUtils'
], function (Marionette, Template, FormView, ConversionUtils) {
    'use strict';

    var DeletedMessageItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #sender-name': 'readMessage',
            'click #subject-id': 'readMessage',
            'click #full-message': 'readMessage'
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
            // Hide reply/forward/current soft delete
            this.model.set('deleted', 'on');
        },

        setReadMessageBackground: function () {
            $('#message-' + this.model.get('id')).css('background-color', 'white');
            $('#messagebottom-' + this.model.get('id')).css('background-color', 'white');
        },

        onShow: function () {
            this.setReadMessageBackground();
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

        edit: function () {
            this.trigger('showModal', FormView);
        }
    });
    return DeletedMessageItemView;
});


