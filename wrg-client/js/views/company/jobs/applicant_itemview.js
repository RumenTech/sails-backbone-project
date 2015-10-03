/**
 * Created by Mistral on 2/19/14.
 */
define([
    'marionette',
    'regions/modal_region',
    'text!templates/company/jobs/applicant.html',
    'views/company/jobs/respond_form_view'
], function (Marionette, ModalRegion, Template, FormView) {
    "use strict";

    var ApplicantItemView = Marionette.Layout.extend({
        template: Template,

        tagName: 'li',
        regions: {
            modal: ModalRegion

        },
        events: {
            'click #checkApplicant': 'checkApplicant',
            'click #respondJob': 'respondJob'
        },

        initialize: function () {
            this.model.on('saved', this.render, this);
        },

        onRender: function () {
        },

        afterRender: function () {
        },

        beforeRender: function () {
        },

        edit: function () {
            this.trigger('showModal', FormView);
        },

        checkApplicant: function () {
            if (this.model.get('role') === "student") {
                window.location = '#student/' + this.model.get('applicant_id');
            }
            else {
                window.location = '#alumni_user/' + this.model.get('applicant_id');
            }
        },

        respondJob: function () {
            var options = {
                model: this.model,
                collection: this.collection
            };
            options = _.extend(options, this.options);
            this.modal.show(new FormView(options));
        },

        showModal: function (view, formClass) {
            var options = {
                model: view.model,
                collection: this.collection
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass(options));
        }
    });
    return ApplicantItemView;
});


