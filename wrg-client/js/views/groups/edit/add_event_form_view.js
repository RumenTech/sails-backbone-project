/**
 * Created by Mistral on 2/19/14.
 */
define([
    'marionette',
    'text!templates/groups/edit/add_event_form.html',
    'lib/backbone.modelbinder',
    'models/groups/group_event',
    'views/error_message_view',
    'utils/eventValidation',
    'utils/conversionUtils',
    'lib/jqueryui'
], function (Marionette, Template, ModelBinder, CollegeEvent, ErrorMessageView, eventValidation, ConversionUtils) {
    "use strict";

    var AddEventView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'click .delete-button': 'deleteEvent',
            'mouseover #event-date': 'datePicker',
            'mouseover #event-start': function () {
                this.timePicker('event-start');
            },
            'mouseover #event-end': function () {
                this.timePicker('event-end');
            },
            'change .validator': function (e) {
                eventValidation.validatorEngine(e);
            }
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            'name': '#event-name',
            'location': '#event-location',
            'start': '#event-start',
            'date': '#event-date',
            'end': '#event-end',
            'content': '#content',
            'facebook_url': '#facebook-url'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new CollegeEvent(params.data, params);
                this.model.set('user_id', params.user_id);
                this.model.set('group_id', params.group_id);
                this.isNew = true;
                this.reqres = params.reqres;
                this.config = this.reqres.request('config');
            }
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        datePicker: function () {
            var that = this;
            var dateToday = new Date();
            var dates = $("#event-date").datepicker({
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
                    that.model.set('date', date);
                    $("#event-date").val(date.toLocaleDateString());
                }
            });
        },

        timePicker: function (selectorId) {
            var hours = $("#" + selectorId).timepicker({
                showPeriod: true,
                showLeadingZero: true
            });
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        save: function () {
            var validation = eventValidation.validateInput(this.model.attributes);
            if (validation === true) {
                var timeValidation = eventValidation.validateNewEntryTime(this.model.attributes);
                if (timeValidation === true) {
                    this.message.close();
                    this.model.save(null, {
                        success: _.bind(function () {
                            this.model.set('role', 'admin');
                            this.model.set('date', new Date(this.model.get('date')).toLocaleDateString());
                            if (this.isNew) {
                                this.collection.add(this.model);
                            }
                            this.model.trigger('saved');
                            $('.close-reveal-modal').click();
                        }, this),
                        error: _.bind(function (model, response) {
                            var message = response.responseText;
                            this.showMessage(this.model, message);
                        }, this)
                    });
                } else {
                    this.showMessage(this.model, timeValidation);
                }
            } else {
                this.showMessage(this.model, validation);
            }
        },

        deleteEvent: function () {
            var event_id = this.model.get("id");
            if (event_id) {
                this.model.fetch({ data: $.param({ id: event_id }),
                    type: 'delete',
                    success: _.bind(function () {
                        this.model.trigger('saved');
                        this.model.collection.remove(this.model);
                        $('.close-reveal-modal').click();
                    }, this),
                    error: _.bind(function (model, response) {
                        var message = response.responseText;
                        this.showMessage(this.model, message);
                    }, this)
                }, null);
            } else {
                this.showMessage(this.model, 'You must insert event first');
            }
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({ message: message }));
        }
    });
    return AddEventView;
});
