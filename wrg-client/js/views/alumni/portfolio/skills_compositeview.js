define([
    'marionette',
    'text!templates/alumni/portfolio/skills.html',
    'views/alumni/portfolio/edit/skills_form_view',
    'collections/professional/skills',
    'views/alumni/portfolio/skill_itemview'
], function (Marionette, Template, FormView, Skills, ItemView) {
    "use strict";

    var SkillsView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.skills',

        events: {
            'click .icon-edit.tip-top': 'edit'
        },

        initialize: function (params) {
            this.collection = params.data;
        },

        edit: function () {
            this.trigger('showModal', this, FormView, this.collection);
        }
    });

    return SkillsView;
});