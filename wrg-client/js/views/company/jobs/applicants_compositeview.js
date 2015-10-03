define([
    'marionette',
    'text!templates/company/jobs/applicants.html',
    'views/company/jobs/applicant_itemview'
], function (Marionette, Template, ItemView) {
    "use strict";

    var JobsCollectionView = Marionette.CompositeView.extend({
        template: Template,
        itemViewContainer: '.portfolio-list.applicant-list',
        itemView: ItemView,

        events: {
            // 'click #moreJobs': 'moreJobs'
        },

        initialize: function (params) {
            this.collection = params.data;
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


