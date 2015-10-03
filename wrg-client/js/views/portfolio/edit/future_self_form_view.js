define([
    'marionette',
    'text!templates/portfolio/edit/future_self_form.html',
    'lib/backbone.modelbinder',
    'models/portfolio/future_self',
    'models/portfolio/student',
    'views/error_message_view',
    'utils/notifier',
    'utils/conversionUtils',
    'utils/eventValidation',
    'lib/moment-2.10.6.min'
], function (Marionette, Template, ModelBinder, FutureSelf, Student, ErrorMessageView, Notificator, ConversionUtils, validationRules, moment) {
    // 'use strict'; Can't use strict since Globals are declared on lines 469 and 470.

    var FutureSelfFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'mouseover #goal-end': function () {
                this.datePicker('goal-end');
            },
            'change .validator': function (e) {
                validationRules.validatorEngine(e);
            }
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal',
            'click .cancel-edit': 'closeModal'
        },

        bindings: {
            note: '#goal-title',
            category_id: '#category',
            end_date: '#goal-end'
        },

        initialize: function (params) {
            this.reqres = params.reqres;

            this.modelBinder = new ModelBinder();
            this.isNew = false;
            if (!this.model) {
                this.model = new FutureSelf(params.data, params);
                this.isNew = true;
            }
            this.student_id = params.reqres.request('student_id');

            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        onShow: function () {
            if (!this.isNew) {
                var formattedDate = ConversionUtils.convertDate(this.model.get('end_date'));
                this.$('#goal-end').val(formattedDate);
            } else {
                this.$('#chk-goal-met').css('display', 'none');
            }
        },

        userException: function (message) {
            $("#loaderIcon").empty();
            Notificator.validate(message, "error");
        },

        datePicker: function () {
            var that = this;
            var dateToday = new Date();
            var dates = $("#goal-end").datepicker({
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1,
                minDate: dateToday,
                dateFormat: "mm-dd-yyyy",
                onSelect: function (selectedDate) {
                    var option = this.id == "from" ? "minDate" : "maxDate",
                        instance = $(this).data("datepicker"),
                        date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
                    dates.not(this).datepicker("option", option, date);
                    $("#goal-end").val(date.toLocaleDateString());
                }
            });
        },

        save: function () {

            this.$('.save-button').attr("disabled", true);
            this.message.close();

            this.model.set('category_id', $('#category').val());
            this.model.set('end_date', moment.utc($('#goal-end').val(), 'MM/DD/YYYY'));
            this.model.set('note', $('#goal-title').val());
            this.model.set('is_message_sent', false);
            this.model.set('points', 1);
            this.model.set('finished', $('#finished').is(':checked') ? true: false);

            this.model.save(null, {
                success: _.bind(function () {
                    var id = this.model.id;
                    var reqres = this.reqres;

                    if (this.isNew) {
                        // Add the model to the future_self collection.
                        this.collection.add(this.model);
                    }

                    this.model.trigger('saved');

                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function (err) {
                    this.message.show(new ErrorMessageView({message: 'Server Problem. Verify your data. The dates could be wrong.'}));
                    this.$('.save-button').removeAttr("disabled");
                }, this)
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));

            var endDate = this.model.get('end_date');
            if (endDate) {
                this.$('#goal-end').val(endDate.format('MM/DD/YYYY'));
            }
        }
    });
    return FutureSelfFormView;
});