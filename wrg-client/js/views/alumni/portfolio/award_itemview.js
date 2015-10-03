define([
    'marionette',
    'text!templates/alumni/portfolio/award.html',
    'views/alumni/portfolio/edit/award_form_view',
    'views/alumni/portfolio/award_delete',
    'views/error_message_view'
], function (Marionette, Template, FormView, DeleteView, ErrorMessageView) {
    "use strict";

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