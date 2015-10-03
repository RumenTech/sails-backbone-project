/**
 * Created by semir.sabic on 3/20/14.
 */
define([
    'marionette',
    'text!templates/findcolleges/suggestion.html'
], function (Marionette, Template) {
    "use strict";

    var SuggestionItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #collegeLink': 'openCollegeProfile'
        },

        openCollegeProfile: function () {
            window.location = '#college/' + this.model.get('id');
        }
    });
    return SuggestionItemView;
});