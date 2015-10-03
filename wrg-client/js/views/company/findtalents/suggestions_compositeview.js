define([
    'marionette',
    'text!templates/company/findtalents/suggestions.html',
    'views/company/findtalents/suggestion_itemview'
], function (Marionette, Template, ItemView) {
    "use strict";

    var SuggestionsCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.suggestions-list',

        events: {
            'click .load_talents': 'moreTalents'
        },

        initialize: function (params) {
            this.collection = params.collection;
        },

        checkScroll: function () {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                this.moreTalents();
            }
        },

        moreTalents: function () {
            this.result_length = this.collection.length;
            this.collection.fetch({
                data: $.param({
                    limit: this.collection.length + 9,
                    name: $('#name').val(),
                    company: $('#company').val(),
                    school: $('#school').val(),
                    major: $('#major').val(),
                    gpa: $('#talent_gpa').val(),
                    job_title: $('#talent_job_title').val(),
                    gpa_criteria: $('#gpa_criteria').val(),
                    job_title_criteria: $('#job_title_criteria').val(),
                    school_criteria: $('#school_criteria').val(),
                    company_criteria: $('#company_criteria').val(),
                    name_criteria: $('#name_criteria').val(),
                    major_criteria: $('#major_criteria').val()
                }),

                success: _.bind(function () {
                    if (this.collection.length === this.result_length) {
                        $('.load_talents').html('No more talents found.');
                    }
                }, this)
            });
        }
    });
    return SuggestionsCompositeView;
});