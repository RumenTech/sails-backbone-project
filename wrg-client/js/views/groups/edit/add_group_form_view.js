define([
    'marionette',
    'text!templates/groups/edit/add_group_form.html',
    'lib/backbone.modelbinder',
    'models/groups/group',
    'views/error_message_view',
    'utils/eventValidation',
    'lib/jqueryui'
], function (Marionette, Template, ModelBinder, Group, ErrorMessageView, ValidationRules) {
    "use strict";

    var AddEventView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'change .validator': function (e) {
                ValidationRules.validatorEngine(e);
            }
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            'name': '#name',
            'websiteUrl' : '#websiteUrl',
            'facebookUrl' : '#facebookUrl',
            'linkedinUrl' : '#linkedinUrl',
            'googleUrl' : '#googleUrl',
            'twitterUrl' : '#twitterUrl'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new Group(params.data, params);
                this.isNew = true;
                this.reqres = params.reqres;
                this.config = this.reqres.request('config');
            }
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        save: function () {
            $('.save-button').attr("disabled", true);
            this.message.close();
            this.model.save(null, {
                success: _.bind(function () {
                    if (this.isNew) {
                        this.collection.add(this.model);
                    }
                    this.model.trigger('saved');
                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function (model, response) {
                    $('.save-button').attr("disabled", false);
                    var message = response.responseJSON.message;
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


