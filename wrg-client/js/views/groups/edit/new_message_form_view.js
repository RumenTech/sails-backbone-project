define([
    'marionette',
    'text!templates/messages/forms/compose_message_form.html',
    'lib/backbone.modelbinder',
    'models/groups/group_message',
    'views/error_message_view',
    'collections/receivers',
    'lib/jqueryui'

], function (Marionette, Template, ModelBinder, MessageWRG, ErrorMessageView, ReceiversCollection) {
    "use strict";

    var AddEventView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save'
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            'content': '#content',
            'subject': '#subject'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            this.model = new MessageWRG(params.data, params);

            this.reqres = params.reqres;
            this.config = this.reqres.request('config');

            this.model.set('group_id', params.model.attributes.groupId);
            //  this.receivers = new ReceiversCollection(null,{reqres:params.reqres});
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);

            var that = this;
            setTimeout(function () {
                that.afterRender();
            }, 0);
        },

        afterRender: function () {
            $("#receiverSearch").val("All members");
            $("#receiverSearch").attr('disabled', 'disabled');
        },
        save: function () {
            //  $('.save-button').attr("disabled", true);
            this.message.close();

            this.model.set('is_deleted', false);
            this.model.set('is_read', false);
            this.model.set('send_on', new Date());

            this.model.save(null, {
                success: _.bind(function () {
                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function (model, response) {
                    $('.save-button').attr("disabled", false);
                    var message = response.responseText;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        deleteMedia: function () {
            var job_id = this.model.get("id");
            if (job_id) {
                this.model.fetch({ data: $.param({ id: job_id }),
                    type: 'delete',
                    success: _.bind(function () {
                        this.model.trigger('saved');
                        this.model.collection.remove(this.model);
                        $('.close-reveal-modal').click();
                    }, this),
                    error: _.bind(function (model, response) {
                        var message = response.responseText;
                        this.showMessage(this.model, message);
                    }, this)
                }, null);
            } else {
                this.showMessage(this.model, 'You must insert job first');
            }
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({ message: message }));
        }
    });
    return AddEventView;
});

