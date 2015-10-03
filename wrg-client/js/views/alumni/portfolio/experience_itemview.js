define([
    'marionette',
    'text!templates/portfolio/experience.html',
    'views/alumni/portfolio/edit/experience_form_view',
    'views/alumni/portfolio/experience_media_view',
    'views/alumni/portfolio/experience_delete'
], function (Marionette, Template, FormView, MediaView, DeleteView) {
    "use strict";

    var ExperienceItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .icon-edit.tip-top': 'edit',
            'click .icon-delete.tip-top': 'removeItem',
            'click .project-view': 'modal'
        },

        initialize: function (params) {
            this.model.on('saved', this.render, this);

            this.listenTo(this.model, 'saved', this.setIcons);
            this.listenTo(this.model, 'saved', this.render);
            this.model.on('remove', this.saved, this);
            this.model.on('update_points', this.saved, this);

            this.setIcons();
        },

        edit: function () {
            this.trigger('showModal', FormView);
        },

        removeItem: function () {
            this.trigger('showModal', DeleteView);
        },

        modal: function () {
            this.trigger('showModal', MediaView);
        },

        saved: function () {
            this.trigger('update_points_compositeview');
        },

        setIcons: function () {

            var categories = this.model.get('categories');
            if (categories) {
                categories.forEach(function (category) {
                    switch (category.category_id) {
                        case '1':
                            category.category_class = 'icon-intern-coop';
                            category.category_title = 'Internship/Co-op';
                            break;
                        case '2':
                            category.category_class = 'icon-community-service';
                            category.category_title = 'Community Service';
                            break;
                        case '3':
                            category.category_class = 'icon-public-speaking';
                            category.category_title = 'Public Speaking';
                            break;
                        case '4':
                            category.category_class = 'icon-research';
                            category.category_title = 'Research';
                            break;
                        case '5':
                            category.category_class = 'icon-leadership';
                            category.category_title = 'Leadership';
                            break;
                        case '6':
                            category.category_class = 'icon-innovation';
                            category.category_title = 'Innovation';
                            break;
                        case '7':
                            category.category_class = 'icon-industry-outreach';
                            category.category_title = 'Industry Outreach';
                            break;
                        case '8':
                            category.category_class = 'icon-innovation';
                            category.category_title = 'Grit';
                            break;
                        default :
                            break;
                    }
                }, this);
            }
        },

        onBeforeRender: function () {
            if (this.model.get('media')) {
                this.model.get('media').forEach(function (model) {
                    if (model.type === 'Video') {
                        var shortUrl = model.data.split("watch?v=");
                        model.id_video = shortUrl[1];
                        model.embedded = shortUrl[0] + 'embed/' + shortUrl[1];
                        model.isVideo = true;
                    }
                });
            }
        },

        onRender: function (params) {
            this.$el.foundation();
        },

        serializeData: function () {
            var data = this.model.toJSON();
            var startMonth = this.model.reqres.request('format:month',
                    this.model.get('start_month') - 1);
            var endMonth = this.model.reqres.request('format:month',
                    this.model.get('end_month') - 1);

            return _.extend(data, {
                startMonthString: startMonth.short,
                endMonthString: endMonth.short
            });
        }
    });

    return ExperienceItemView;
});