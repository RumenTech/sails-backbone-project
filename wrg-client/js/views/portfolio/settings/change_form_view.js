/**
 * Created by Mistral on 6/9/2014.
 */
/**
 * Created by Mistral on 1/21/14.
 */
define([
    'marionette',
    'text!templates/portfolio/settings/change_password.html',
    'lib/backbone.modelbinder',
    'models/change_password',
    'views/error_message_view',
    'lib/jqueryui',
    'wysiwyg'
], function (Marionette, Template, ModelBinder, ChangePassword, ErrorMessageView) {
    'use strict';

    var AddEventView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button-password': 'save'
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            'password': '#password',
            'repeatPassword': '#repeatPassword',
            'oldPassword': '#oldPassword'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();

            this.model = new ChangePassword(params.data, params);

            this.reqres = params.reqres;
            this.config = this.reqres.request('config');

            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        onShow: function () {
        },

        save: function () {
            $('.save-button-password').attr("disabled", true);
            this.message.close();
            this.model.save(null, {
                success: _.bind(function () {
                    this.model.trigger('saved');
                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function (model, response) {

                    $('.save-button-password').attr("disabled", false);
                    var message = response.responseText;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({ message: message }));
        }
    });
    return AddEventView;
});

