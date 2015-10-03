define([
    'marionette',
    'text!templates/reporting/suggestions.html',
    'views/reporting/suggestion_itemview'
], function (Marionette, Template, ItemView) {
    'use strict';

    var ReportingSuggestionsCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.suggestions-list',

        events: {
            'click .load_alumni': 'moreAlumni'
        },

        initialize: function (params) {
            this.collection = params.collection;
        },

        moreAlumni: function () {
            this.result_length = this.collection.length;
            this.collection.fetch({
                    data: $.param({
                        limit: this.collection.length + 12
                    }),
                    success: _.bind(function () {
                        if (this.collection.length == this.result_length) {
                            $('.load_alumni').html('No more alumni found');
                        }
                    }, this)}
            );
        }
    });
    return ReportingSuggestionsCompositeView;
});