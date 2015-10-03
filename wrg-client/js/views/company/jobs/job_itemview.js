/**
 * Created by Mistral on 1/21/14.
 */

define([
    'marionette',
    'text!templates/company/jobs/job.html',
    'views/company/jobs/add_job_form_view',
    'views/company/jobs/job_delete'
], function (Marionette, Template, FormView, DeleteView) {
    "use strict";

    var EventItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .icon-edit.tip-top': 'edit',
            'click .icon-delete.tip-top': 'deleteJob',
            'click #viewJob': 'viewJob',
            'click .jobImage': 'viewJob'
        },

        initialize: function () {
            if (this.model.get('job_description') != null) {
                if (this.model.get('job_description').length > 700) {
                    this.model.set('job_description_short', this.model.get('job_description').substring(0, 700) + '...');
                }
                else {
                    this.model.set('job_description_short', this.model.get('job_description'));
                }
            }

            this.model.on('saved', this.render, this);
        },

        edit: function () {
            this.trigger('showModal', FormView);
        },

        deleteJob: function () {
            this.trigger('showModal', DeleteView);
        },

        viewJob: function () {
            window.location = '#job/' + this.model.get('id');
        }
    });

    return EventItemView;
});

