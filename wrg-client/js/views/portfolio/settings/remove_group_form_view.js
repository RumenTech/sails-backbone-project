define([
    'marionette',
    'text!templates/portfolio/settings/remove_group_form.html',
    'models/groups/group',
    'lib/backbone.modelbinder',
    'views/error_message_view'
], function (Marionette, Template, Group, ModelBinder, ErrorMessageView) {
    'use strict';

    var RemoveGroupFormView = Marionette.Layout.extend({
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

        removeUser: function () {
            $('#removeUser').attr('disabled', true);
            this.message.close();
            this.model.destroy();
            var idRequest = this.model.get('id');
            var modelRequest = new Group(this.model.attributes, {reqres: this.reqres});
            modelRequest.set('id', idRequest);
            modelRequest.destroy({
                data: $.param({ id: idRequest
                }),
                success: _.bind(function () {
                    this.collection.remove(this.model);
                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message)
                })
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return RemoveGroupFormView;
});