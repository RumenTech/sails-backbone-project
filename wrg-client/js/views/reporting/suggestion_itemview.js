define([
    'marionette',
    'text!templates/reporting/suggestion.html',
    'utils/conversionUtils'
], function (Marionette, Template, ConversionUtils) {
    'use strict';

    var ReportingSuggestionItemView = Marionette.Layout.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #reportingLink': 'showStory'
        },
        initialize: function () {
        },

        showStory: function () {
            if (this.model.get('alumni_id') === null) {
                window.location = '#student/' + ConversionUtils.returnInteger(this.model.get('user_id'), 'Could not convert user id');
            }
            else {
                window.location = '#alumni_user/' + ConversionUtils.returnInteger(this.model.get('user_id'), 'Could not convert user id');
            }
        }
    });
    return ReportingSuggestionItemView;
});