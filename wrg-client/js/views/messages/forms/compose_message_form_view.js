define([
    'marionette',
    'text!templates/messages/forms/compose_message_form.html',
    'lib/backbone.modelbinder',
    'models/message',
    'views/error_message_view',
    'views/messages/forms/send_new_message_form_view',
    'collections/receivers',
    'regions/modal_region',
    'lib/jqueryui'

], function (Marionette, Template, ModelBinder, MessageWRG, ErrorMessageView, SendMessageView, ReceiversCollection, ModalRegion) {
    'use strict';

    var ComposeMessageView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'send',
            'keyup .receiver': 'searchReceivers',
            'click .cancel-button': 'cancel'
        },

        regions: {
            message: '.validation-messages',
            modal: ModalRegion
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            'content': '#content',
            'subject': '#subject'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.modelBinder = new ModelBinder();
            if (params.forward) {
                this.forward = new MessageWRG(null, params.forward);
                this.forward.set('sender_id', params.sender_id);
                this.receivers = new ReceiversCollection(null, {reqres: this.reqres});
                this.forward.set('content', this.model.get('content'));
            } else {
                // No model set, first time composing
                if (!this.model) {
                    this.model = new MessageWRG(params.data, params);
                    this.model.set('sender_id', params.sender_id);
                    this.isNew = true;

                    this.config = this.reqres.request('config');
                    this.receivers = new ReceiversCollection(null, {reqres: this.reqres});
                    this.listenTo(this.model, 'invalid', this.showMessage, this);
                }
                else {
                    //Model set, replying to message  - needed because of setting model and disabled delete after reply
                    if (params.reply) {
                        //Reply from sent, ids get switched otherwise
                        this.reply = new MessageWRG(null, params);
                        var receiver_id = this.model.get('receiver_id');
                        this.reply.set('sender_id', this.model.get('sender_id'));
                        this.reply.set('receiver_id', receiver_id);
                    } else {
                        this.reply = new MessageWRG(null, params);
                        var receiver_id = this.model.get('receiver_id');
                        this.reply.set('receiver_id', this.model.get('sender_id'));
                        this.reply.set('sender_id', receiver_id);
                    }
                }
            }
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        onShow: function () {
            if (this.forward) {
                $("#receiverSearch").removeAttr('disabled');
                this.forward.set('subject', 'Fwd: ' + this.model.get('subject'));
            } else {
                if (!this.isNew) {
                    $("#receiverSearch").val(this.model.attributes.first_name + " " + this.model.attributes.last_name);
                    $("#receiverSearch").attr('disabled', 'disabled');
                    var subject = this.model.get('subject');
                    if (subject === null || subject === '' || subject === undefined) {
                        subject = '(no subject)'
                    }
                    else {
                        subject = 'RE: ' + this.model.get('subject');
                    }
                    $('#subject').val(subject);
                    $('#content').val('');
                }
            }
        },

        cancel: function () {
            $("#messages-received").show();
            $("#messages-deleted").hide();
            $("#messages-sent").hide();
            $("#compose-message").hide();
            $('.close-reveal-modal').click();
        },

        send: function () {
            var subject = this.model.get('subject');
            if (subject === null || subject === undefined || subject === '') {
                this.showModal(SendMessageView);
            } else {
                this.save();
            }
        },

        showModal: function (formClass) {
            var options = {
                collection: this.collection,
                model: this.model,
                reply: this.reply,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: this.collection, model: this.model, reply: this.reply, reqres: this.reqres}, options));
            this.listenTo(this.model, 'send', this.save, this);
        },

        save: function () {
            // TODO: Refactor too much duplicate code
            if (this.reply) {
                this.reply.set('content', $('#content').val());
                this.reply.set('is_deleted', false);
                this.reply.set('is_flagged', false);
                var subject = $('#subject').val();
                if (subject === null || subject === '' || subject === undefined) {
                    subject = '(no subject)';
                } else {
                    subject = 'RE: ' + this.model.get('subject');
                }
                this.reply.set('subject', subject);
                this.reply.save(null, {
                    success: _.bind(function () {
                        this.model.trigger('saved');
                        $("#messages-received").show();
                        $("#messages-deleted").hide();
                        $("#messages-sent").hide();
                        $("#compose-message").hide();
                    }, this),
                    error: _.bind(function (model, response) {
                        $('.save-button').attr("disabled", false);
                        var message = response.responseText;
                        this.showMessage(this.model, message);
                    }, this)
                });
            } else if (this.forward) {
                this.forward.set('is_flagged', false);
                this.forward.set('receiver_id', $("#selectedReceiverID").val());
                this.forward.set('first_name', $("#receiverSearch").val());
                this.forward.set('is_deleted', false);
                this.forward.save(null, {
                    success: _.bind(function () {
                        this.model.trigger('saved');
                        $("#messages-received").show();
                        $("#messages-deleted").hide();
                        $("#messages-sent").hide();
                        $("#compose-message").hide();
                    }, this),
                    error: _.bind(function (model, response) {
                        $('.save-button').attr("disabled", false);
                        var message = response.responseText;
                        this.showMessage(this.model, message);
                    }, this)
                });
            } else {
                this.model.set('is_flagged', false);
                var subject = this.model.get('subject');
                if (subject === null || subject === '' || subject === undefined) {
                    subject = '(no subject)';
                    this.model.set('subject', subject);
                }
                this.model.set('is_deleted', false);
                if (this.isNew) {
                    var recid = $("#selectedReceiverID").val();
                    this.model.set('receiver_id', $("#selectedReceiverID").val());
                    this.model.set('sender_id', this.model.attributes.sender_id);
                    this.model.set('first_name', $("#receiverSearch").val());
                }
                else {
                    this.model.set('id', undefined);
                }
                this.model.save(null, {
                    success: _.bind(function () {
                        this.model.trigger('saved');
                        $("#messages-received").show();
                        $("#messages-deleted").hide();
                        $("#messages-sent").hide();
                        $("#compose-message").hide();
                    }, this),
                    error: _.bind(function (model, response) {

                        $('.save-button').attr("disabled", false);
                        var message = response.responseText;
                        this.showMessage(this.model, message);
                    }, this)
                });
            }
        },

        searchReceivers: function () {
            if (this.isNew || this.forward) {
                this.receivers.fetch({ data: $.param({ receiversearch: $("#receiverSearch").val()}) });
                var uiResultSet = [];
                this.receivers.models.forEach(function (arrayItem) {
                    //we can get any property here, not only email
                    uiResultSet.push({
                        label: arrayItem.attributes.first_name + " " + arrayItem.attributes.last_name + ' (' + arrayItem.attributes.username + ')',
                        value: arrayItem.attributes.first_name + " " + arrayItem.attributes.last_name,
                        id: arrayItem.attributes.id
                    });
                });
                $("#receiverSearch").autocomplete({
                    source: uiResultSet,
                    select: function (event, ui) {
                        $("#selectedReceiverID").val(ui.item.id); // save selected id to hidden input
                    }
                });
            }
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({ message: message }));
        }
    });
    return ComposeMessageView;
});

