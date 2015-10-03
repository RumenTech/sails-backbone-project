/**
 * Created by semir.sabic on 2.6.2014.
 */
define([
    'marionette',
    'text!templates/dashboard/results.html',
    'views/dashboard/moocs_itemview'
], function (Marionette, Template, ItemView) {
    "use strict";

    var MoocsCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.suggestions-list',

        initialize: function (params) {
            this.params = params;
            this.collection = params.collection;
            this.model = new Backbone.Model();
            this.model.set('results', 'MOOCs');
        }
    });
    return MoocsCompositeView;
});