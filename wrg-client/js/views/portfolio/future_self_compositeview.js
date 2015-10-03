define([
    'marionette',
    'text!templates/portfolio/future_self_list.html',
    'views/portfolio/future_self_itemview',
    'views/portfolio/edit/future_self_form_view'
], function (Marionette, Template, ItemView, FormView) {
    'use strict';

    var FutureSelfCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.future-self-list',

        events: {
            'click .add-future-self': 'edit'
        },

        initialize: function (params) {
            this.collection = params.data;
        },

        edit: function () {
            this.trigger('showModal', this, FormView, this.collection);
        }
    });
    return FutureSelfCollectionView;
});