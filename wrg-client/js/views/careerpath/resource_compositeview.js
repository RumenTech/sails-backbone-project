/**
 * Created by semir.sabic on 21.4.2014.
 */
define([
    'marionette',
    'text!templates/careerpath/resources.html',
    'views/careerpath/resource_itemview'
], function (Marionette, Template, ItemView) {
    "use strict";

    var ResourcesCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '#resourcesContainer',

        initialize: function (params) {
            this.collection = params.data;
        }
    });
    return ResourcesCollectionView;
});