define([
    'marionette',
    'text!templates/portfolio/edit/future_self_note_form.html',
    'lib/backbone.modelbinder',
    'models/portfolio/future_self',
    'views/error_message_view',
    'utils/conversionUtils',
    'lib/jqueryui'
], function (Marionette, Template, ModelBinder, FutureSelf, ErrorMessageView, ConversionUtils) {
    'use strict';

    var AwardFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save'
            /*'focus #year':function () {
             ConversionUtils.insertYearsToNow('year', 'Year');
             }*/
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            'note': '#note'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();

            this.model = new FutureSelf(params.data, params);
            this.reqres = params.reqres;
            this.model.set('category_id', params.category_id);
            this.model.set('points', params.points);
            this.model.set('is_message_sent', false);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        save: function () {
            this.model.save(null, {
                success: _.bind(function () {

                    //   this.model.trigger('saved');
                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message)
                }, this)
            });
        },

        showMessage: function (model, message) {
            // this.message.show(new ErrorMessageView({message:message}));
        }
    });
    return AwardFormView;
});