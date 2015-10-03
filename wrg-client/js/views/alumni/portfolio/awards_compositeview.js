define([
    'marionette',
    'text!templates/alumni/portfolio/awards.html',
    'views/alumni/portfolio/award_itemview',
    'collections/professional/awards',
    'views/alumni/portfolio/edit/award_form_view'
], function (Marionette, Template, ItemView, AwardsCollection, FormView) {
    "use strict";

    var AwardsCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.portfolio-list.award-list',

        initialize: function (params) {
            this.collection = params.data;
        },

        events: {
            'click .icon-plus.tip-top': 'edit'
        },

        edit: function () {
            this.trigger('showModal', this, FormView, this.collection);
        }
    });

    return AwardsCollectionView;
});