define([
    'marionette',
    'text!templates/findcompanies/suggestion.html'
], function (Marionette, Template) {
    "use strict";

    var SuggestionItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #companyLink': 'openCompanyProfile'
        },

        openCompanyProfile: function () {
            window.location = '#company/' + this.model.get('id');
        }
    });
    return SuggestionItemView;
});