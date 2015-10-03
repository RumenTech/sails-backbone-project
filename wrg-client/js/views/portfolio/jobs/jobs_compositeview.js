/**
 * Created by Mistral on 1/22/14.
 */
/**
 * Created by Mistral on 1/21/14.
 */
define([
    'marionette',
    'text!templates/portfolio/jobs/jobs.html',
    'views/portfolio/jobs/job_itemview',
    'collections/portfolio/jobs'
], function (Marionette, Template, ItemView, JobsCollection) {
    'use strict';

    var JobsCollectionView = Marionette.CompositeView.extend({
        template: Template,
        itemViewContainer: '.company-list.job-list',
        itemView: ItemView,

        events: {
            'click #moreJobs': 'moreJobs'
        },

        initialize: function (params) {
            this.collection = params.data;

            //Scroll event
            _.bindAll(this, "checkScroll");
            $(window).scroll(this.checkScroll);
        },

        checkScroll: function () {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                this.moreJobs();
            }
        },

        moreJobs: function () {
            this.result_length = this.collection.length;
            this.collection.fetch({ data: $.param({
                    jobsearch: $('#jobsearch').val(),
                    location: $('#location').val(),
                    limit: this.collection.length + 10
                }),
                    success: _.bind(function () {
                        if (this.collection.length === this.result_length) {
                            $('#moreJobs').html('No more jobs found');
                        }
                    }, this)
                }
            );
        }
    });
    return JobsCollectionView;
});


