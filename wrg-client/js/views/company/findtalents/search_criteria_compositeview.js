define([
    'marionette',
    'text!templates/company/findtalents/search_criterias.html',
    'views/company/findtalents/search_criteria_itemview' ,
    'collections/company/criterias_search'
], function (Marionette, Template, ItemView, CriteriaSearchCollection) {
    "use strict";

    var SuggestionsCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.criteria-list',

        events: {
        },

        initialize: function (params) {
            this.collection = new CriteriaSearchCollection(params.collection.models, params);
        }
    });

    return SuggestionsCompositeView;
});