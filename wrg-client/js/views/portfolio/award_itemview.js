define([
    'marionette',
    'text!templates/portfolio/award.html',
    'views/portfolio/edit/award_form_view',
    'views/portfolio/award_delete'
], function (Marionette, Template, FormView, DeleteView) {
    'use strict';

    var AwardsItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .icon-edit.tip-top': 'edit',
            'click .icon-delete.tip-top': 'removeItem'
        },

        initialize: function () {
            this.model.on('saved', this.render, this);
        },

        removeItem: function () {
            this.trigger('showModal', DeleteView);
        },

        edit: function () {
            this.trigger('showModal', FormView);
        },

        serializeData: function () {
            var data = this.model.toJSON();
            var monthName = this.model.reqres.request('format:month',
                    this.model.get('month') - 1);

            return _.extend(data, { monthString: monthName.short });
        }
    });
    return AwardsItemView;
});