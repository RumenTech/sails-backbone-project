define([
    'marionette',
    'text!templates/findfriends/filter_form.html',
    'models/friend',
    'views/error_message_view',
    'lib/backbone.modelbinder'
], function (Marionette, Template, Friend, ErrorMessageView, ModelBinder) {
    "use strict";

    var FilterFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .button.filter': function (e) {
                this.filter(e);
            },
            'keypress #name': 'keyManager',
            'keypress #company': 'keyManager',
            'keypress #school': 'keyManager',
            'keypress #major': 'keyManager'
        },

        regions: {
            message: '.validation-messages'
        },

        bindings: {
            'name': '#name',
            'company': '#company',
            'school': '#school',
            'major': '#major'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.collection = params.collection;
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new Friend(params.data, params);
            }

            var str = window.location.href.split("/")[4];

            if (str !== "friend") {
                this.model.attributes.name = str;
            }
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        keyManager: function (e) {
            if (e.which === 13) {
                this.filter(e);
            }
        },

        filter: function (e) {
            e.preventDefault();
            this.model.set('name', $('#name').val());
            this.model.set('company', $('#company').val());
            this.model.set('school', $('#school').val());
            this.model.set('major', $('#major').val());
            this.trigger('filter', this, this.model);
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return FilterFormView;
});