define([
    'marionette',
    'text!templates/portfolio/awards.html',
    'views/portfolio/award_itemview',
    'collections/portfolio/awards',
    'views/portfolio/edit/award_form_view'
], function (Marionette, Template, ItemView, AwardsCollection, FormView) {
    'use strict';

    var AwardsCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.portfolio-list.award-list',

        events: {
            'click .icon-plus.tip-top': 'edit'
        },

        initialize: function (params) {
            this.collection = params.data;
        },

        edit: function () {
            this.trigger('showModal', this, FormView, this.collection);
        }
    });
    return AwardsCollectionView;
});