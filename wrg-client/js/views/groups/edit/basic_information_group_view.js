define([
    'marionette',
    'text!templates/groups/edit/basic_information_group.html',
    'lib/backbone.modelbinder',
    'models/groups/basic_info',
    'views/error_message_view',
    'utils/eventValidation',
    'wysiwyg'
], function (Marionette, Template, ModelBinder, BasicInformation, ErrorMessageView, ValidationRules) {
    "use strict";

    var BasicInformationGroupView = Marionette.Layout.extend({
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
            'description': '#description',
            'websiteUrl': '#websiteUrl',
            'facebookUrl': '#facebookUrl',
            'linkedinUrl': '#linkedinUrl',
            'googleUrl': '#googleUrl',
            'twitterUrl': '#twitterUrl'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            this.reqres = params.reqres;
            this.model = new BasicInformation(params.model.attributes, params);

            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        save: function () {
            if (this.model.get('name')) {
                this.message.close();
                delete this.model.attributes.groupImage;
                this.model.save({
                        data: $.param({ id: this.model.get('id') })
                    }, {
                        success: _.bind(function () {
                            this.trigger('saved');
                            $('.close-reveal-modal').click();
                        }, this),
                        error: _.bind(function () {
                            // TODO: Replace with an error message
                        }, this)
                    }
                );
            } else {
                this.showMessage(this.model, 'You need to enter group name');
            }
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return BasicInformationGroupView;
});