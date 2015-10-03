define([
    'marionette',
    'text!templates/portfolio/future_self.html',
    'views/portfolio/edit/future_self_form_view',
    'views/portfolio/edit/experience_form_view',
    'views/portfolio/future_self_delete',
    'lib/moment-2.10.6.min'
], function (Marionette, Template, FutureSelfFormView, ExperienceFormView, DeleteView, moment) {
    'use strict';

    var FutureSelfItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'tr',

        events: {
            'click .add-experience': 'addExperience',
            'click .icon-edit.tip-top': 'editFutureSelf',
            'click .icon-delete.tip-top': 'removeFutureSelf'
        },

        initialize: function (params) {
            this.model.on('saved', this.render, this);

            this.listenTo(this.model, 'saved', this.render);
            this.model.on('remove', this.saved, this);
        },

        addExperience: function () {
            this.trigger('showExpModal', ExperienceFormView);
        },

        editFutureSelf: function () {
            this.trigger('showModal', FutureSelfFormView);
        },

        removeFutureSelf: function () {
            this.trigger('showModal', DeleteView);
        },

        serializeData: function () {
            var data = this.model.toJSON();

            var diffInDays = moment(data.end_date).diff(moment(), 'day');
            data.timeLeft = moment(data.end_date).from(moment(), true);
            if (diffInDays < 5) {
                data.timeLeft = 'Only ' + data.timeLeft + ' left!';
            }
            data.createdAt = moment.utc(data.createdAt).format('MM/DD/YYYY');

            var categoryData = [
                ['icon-intern-coop', 'Internship/Co-op'],
                ['icon-community-service', 'Community Service'],
                ['icon-public-speaking', 'Public Speaking'],
                ['icon-research', 'Research'],
                ['icon-leadership', 'Leadership'],
                ['icon-innovation', 'Innovation'],
                ['icon-industry-outreach', 'Industry Outreach'],
                ['icon-innovation', 'Grit']
            ];
            var categoryInfo = categoryData[data.category_id - 1];
            if (categoryInfo) {
                data['category_class'] = categoryInfo[0];
                data['category_title'] = categoryInfo[1];
            }

            return data;
        }
    });
    return FutureSelfItemView;
});