/**
 * Created by Mistral on 1/21/14.
 */
define([
    'marionette',
    'text!templates/company/jobs/jobs.html',
    'views/company/jobs/job_itemview',
    'collections/company/jobs',
    'views/company/jobs/add_job_form_view'
], function (Marionette, Template, ItemView, JobsCollection, FormView) {
    "use strict";

    var JobsCollectionView = Marionette.CompositeView.extend({
        template: Template,
        itemViewContainer: '.company-list.job-list',
        itemView: ItemView,

        initialize: function (params) {
            for (var i = 0; i < params.data.length; i++) {
                params.data[i].company_image = params.company.get('profile_image');
            }
            this.collection = new JobsCollection(params.data, params);
        },

        events: {
            'click #addJob': 'newJob'
        },

        newJob: function () {
            this.trigger('showModal', this, FormView, this.collection);
        }
    });

    return JobsCollectionView;
});

