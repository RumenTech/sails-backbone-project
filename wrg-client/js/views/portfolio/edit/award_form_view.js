define([
    'marionette',
    'text!templates/portfolio/edit/award_form.html',
    'lib/backbone.modelbinder',
    'models/portfolio/award',
    'views/error_message_view',
    'utils/conversionUtils',
    'lib/jqueryui'
], function (Marionette, Template, ModelBinder, Award, ErrorMessageView, ConversionUtils) {
    'use strict';

    var AwardFormView = Marionette.Layout.extend({
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
            'title': '#title',
            'presentor': '#presentor',
            'year': '#year',
            'month': '#month',
            'description': '#description'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new Award(params.data, params);
                this.isNew = true;
            }
            this.student_id = params.reqres.request('student_id');
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },
        onShow: function () {
            var year = this.model.get('year'),
                month = this.model.get('month');
            ConversionUtils.insertYearsToNow('year', 'Year');
            if (year !== null && year !== undefined) {
                year = ConversionUtils.returnInteger(year);
                $("select.award-year").val(year);
            }
            if (month !== null && month !== undefined) {
                month = ConversionUtils.returnInteger(month);
                $("select.award-month").val(month);
            }
        },

        save: function () {
            this.message.close();
            var year = this.model.get('year');
            var month = this.model.get('month');
            this.model.set('date', year + '-' + month + '-01');
            this.model.set('student_id', this.student_id);
            if (!this.model.collection) {
                this.collection.add(this.model);
            }

            this.model.save(null, {
                success: _.bind(function () {
                    if (this.isNew) {
                        // Add the model to the awards collection.
                        this.collection.add(this.model);
                    }
                    this.model.trigger('saved');
                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message)
                }, this)
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return AwardFormView;
});