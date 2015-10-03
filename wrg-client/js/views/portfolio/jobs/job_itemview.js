/**
 * Created by Mistral on 1/22/14.
 */
define([
    'marionette',
    'text!templates/portfolio/jobs/job.html',
    'models/portfolio/job'

], function (Marionette, Template, Job) {
    'use strict';

    var JobItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #viewJob': 'viewJob'
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

        viewJob: function () {
            window.location = '#job_student/' + this.model.get('id');
        }
    });
    return JobItemView;
});


