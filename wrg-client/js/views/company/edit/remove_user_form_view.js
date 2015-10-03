define([
    'marionette',
    'text!templates/company/edit/remove_user_form.html',
    'lib/backbone.modelbinder',
    'models/company/newuser',
    'views/error_message_view'
], function (Marionette, Template, ModelBinder, User, ErrorMessageView) {
    "use strict";

    var CandidateFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click #removeUser': 'removeUser'
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        initialize: function (params) {
            this.vent = params.vent;
            this.reqres = params.reqres;
            this.render();
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
        },

        removeUser: function () {
            this.message.close();
            var idRequest = this.model.get('company_user_id');
            var modelRequest = new User(this.model.attributes, {reqres: this.reqres});
            modelRequest.set('id', idRequest);
            modelRequest.destroy(
                {
                    data: $.param({ id: idRequest
                    }),
                    success: _.bind(function () {
                        this.collection.remove(this.model);
                        $('.close-reveal-modal').click();
                    }, this),
                    error: _.bind(function (model, response) {
                        var message = response.responseJSON.message;
                        this.showMessage(this.model, message);
                    })
                }
            );
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return CandidateFormView;
});