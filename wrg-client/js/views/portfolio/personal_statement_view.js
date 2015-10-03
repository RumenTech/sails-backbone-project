define([
    'marionette',
    'text!templates/portfolio/personal_statement.html',
    'views/portfolio/edit/personal_statement_form_view',
    'models/portfolio/personal_statement'
], function (Marionette, Template, FormView, PersonalStatement) {
    'use strict';

    var PersonalStatementView = Marionette.ItemView.extend({
        template: Template,
        events: {
            'click .icon-edit.tip-top': 'edit'
        },

        initialize: function (params) {
            this.model = new PersonalStatement(params.data, params);
            this.model.on('saved', this.render, this);
        },

        onBeforeRender: function () {

            var parsedUrl = this.model.get('video_url').split("/");

            if (parsedUrl[2] === "youtu.be") {
                this.model.set('id_video', parsedUrl[3]);
            }

            if (parsedUrl[2] === "www.youtube.com") {
                var correctUrl = parsedUrl[3].split("v=")[1];
                this.model.set('id_video', correctUrl);
            }

            if (parsedUrl[3] === "embed") {
                var correctUrl = parsedUrl[4].split(" ")[0].replace('"', '');
                this.model.set('id_video', correctUrl);
            }
            //else means youtube video is in wrong format. set default one to personal_url property in the model
        },
        onRender: function () {
            if (this.model.get('id_video') === undefined) {
                this.$el.find('#videoContainer').hide();
            }
        },

        edit: function () {
            this.trigger('showModal', this, FormView);
        }
    });
    return PersonalStatementView;
});