/**
 * Created by semir.sabic on 2.6.2014.
 */
define([
    'marionette',
    'text!templates/pointoflight/results.html',
    'views/pointoflight/pointoflight_itemview'
], function (Marionette, Template, ItemView) {

    var MoocsCompositeView = Marionette.CompositeView.extend({
        template:Template,

        itemView:ItemView,

        itemViewContainer:'.suggestions-list',

        initialize:function (params) {
            this.params = params;
            this.collection = params;
            this.model = new Backbone.Model();
            this.model.set('results', 'Point of Light Positions');
        }

    });

    return MoocsCompositeView;
});