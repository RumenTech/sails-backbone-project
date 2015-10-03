define([
    'marionette',
    'text!templates/college/edit/candidate_form.html',
    'lib/backbone.modelbinder',
    'models/college/candidate',
    'views/college/candidates_compositeview',
    'views/error_message_view'
], function (Marionette, Template, ModelBinder, Candidate, CandidatesCollectionView, ErrorMessageView) {
    "use strict";

    var CandidateFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'click .delete-button': 'removeCandidate'
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            'field': '#field',
            'description': '#description'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new Candidate(params.data, params);
                this.model.set('college_id', params.college_id);
                this.isNew = true;
            }
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        save: function () {
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
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        removeCandidate: function () {
            var candidate_id = this.model.get("id");
            if (candidate_id) {
                this.model.fetch({ data: $.param({ id: candidate_id }),
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
                this.showMessage(this.model, 'You must insert candidate first');
            }
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return CandidateFormView;
});