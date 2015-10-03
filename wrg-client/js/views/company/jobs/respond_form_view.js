define([
    'marionette',
    'text!templates/messages/forms/compose_message_form.html',
    'lib/backbone.modelbinder',
    'models/company/respond_message',
    'views/error_message_view',
    'collections/receivers',
    'lib/jqueryui'

], function (Marionette, Template, ModelBinder, MessageWRG, ErrorMessageView, ReceiversCollection) {
    "use strict";

    var RespondView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'click .cancel-button': 'cancel'
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

            this.reqres = params.model.collection.reqres;
            this.config = this.reqres.request('config');

            this.model.set('receiver_id', params.model.attributes.applicant_id);
            this.model.set('owner_id', params.model.attributes.applicant_id);
            this.model.set('job_id', params.model.attributes.job_id);

            this.applicantName = params.model.attributes.first_name + " " + params.model.attributes.last_name;
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        onShow: function () {
            this.afterRender();
        },

        afterRender: function () {
            $("#receiverSearch").val(this.applicantName);
            $("#receiverSearch").attr('disabled', 'disabled');
        },

        save: function () {
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

        cancel: function () {
            $('.close-reveal-modal').click();
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({ message: message }));
        }
    });
    return RespondView;
});


