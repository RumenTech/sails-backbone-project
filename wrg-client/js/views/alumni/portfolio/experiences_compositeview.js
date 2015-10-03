define([
    'marionette',
    'text!templates/alumni/portfolio/experiences.html',
    'views/alumni/portfolio/experience_itemview',
    'views/alumni/portfolio/edit/experience_form_view'
], function (Marionette, Template, ItemView, FormView) {
    "use strict";

    var ExperiencesCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.portfolio-list.experience-list',

        events: {
            'click .icon-plus.tip-top': 'edit'
        },

        initialize: function (params) {
            this.collection = params.data;

            this.collection.models.sort(function (a, b) {
                a = new Date(a.attributes.end_date);
                b = new Date(b.attributes.end_date);
                return a > b ? -1 : a < b ? 1 : 0;
            });
            this.on('update_points_compositeview', this.update_points_compositeview, this);
        },

        edit: function () {
            this.trigger('showModal', this, FormView, this.collection);
        }
    });

    return ExperiencesCollectionView;
});