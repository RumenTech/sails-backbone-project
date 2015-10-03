define([
    'marionette',
    'text!templates/dashboard/results.html',
    'views/dashboard/challenge_result_itemview'
], function (Marionette, Template, ItemView) {
    "use strict";

    var DashboardChallengeCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.suggestions-list',

        initialize: function (params) {
            this.params = params;
            this.collection = params.collection;
            this.model = new Backbone.Model();
            this.model.set('results', 'Challenges');
        }
    });
    return DashboardChallengeCompositeView;
});