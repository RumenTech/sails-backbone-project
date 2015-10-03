define([
    'marionette',
    'text!templates/dashboard/results.html',
    'views/dashboard/pointoflight_itemview'
], function (Marionette, Template, ItemView) {
    "use strict";

    var PointofLightCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        //itemViewContainer:'.suggestions-list',
        itemViewContainer: '#wex',

        initialize: function (params) {

            this.params = params;
            this.collection = params;
            this.model = new Backbone.Model();
            this.model.set('results', 'PointLight');
        }
    });
    return PointofLightCompositeView;
});