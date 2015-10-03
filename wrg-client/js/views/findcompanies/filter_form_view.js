define([
    'marionette',
    'text!templates/findcompanies/filter_form.html',
    'models/friend',
    'views/error_message_view',
    'lib/backbone.modelbinder'
], function (Marionette, Template, Friend, ErrorMessageView, ModelBinder) {
    "use strict";

    var FilterFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .button.filter': function (e) {
                this.filter(e)
            },
            'keypress #name': 'keyManager',
            'keypress #state': 'keyManager',
            'keypress #city': 'keyManager'
        },

        regions: {
            message: '.validation-messages'
        },

        bindings: {
            'name': '#name',
            'state': '#state',
            'city': '#city'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.collection = params.collection;
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new Friend(params.data, params);
            }
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        keyManager: function (e) {
            if (e.which === 13) {
                this.model.set('name', $('#name').val());
                this.model.set('city', $('#city').val());
                this.model.set('state', $('#state').val());
                this.filter(e);
            }
        },

        filter: function (e) {
            e.preventDefault();
            this.trigger('filter', this, this.model);
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return FilterFormView;
});