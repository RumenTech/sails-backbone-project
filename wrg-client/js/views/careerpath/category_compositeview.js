/**
 * Created by semir.sabic on 20.4.2014.
 */
define([
    'marionette',
    'text!templates/careerpath/categories.html',
    'views/careerpath/category_itemview',
    'views/careerpath/add_resource_view'
], function (Marionette, Template, ItemView, AddResourceView) {
    "use strict";

    var CategoriesCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '#categoriesContainer',

        events: {
            'click #addResource': 'addResource'
        },

        initialize: function (params) {
            this.collection = params.data;
        },

        addResource: function () {
            this.trigger('showModal', AddResourceView);
        }
    });

    return CategoriesCollectionView;
});