define([
    'marionette',
    'text!templates/dashboard/results.html',
    'views/dashboard/dashboard_group_itemview'
], function (Marionette, Template, ItemView) {
    "use strict";

    var DashboardGroupCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.suggestions-list',

        initialize: function (params) {
            this.params = params;
            this.collection = params.collection;
            this.model = new Backbone.Model();
            this.model.set('results', 'Groups');
        }
    });
    return DashboardGroupCompositeView;
});