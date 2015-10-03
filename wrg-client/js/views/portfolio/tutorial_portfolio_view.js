define([
    'marionette',
    'text!templates/tutorial/portfolio_tutorial.html',
    'views/portfolio/edit/profile_picture_form_view',
    'models/portfolio/profile_picture',
    'views/tutorials/student/student_tutorial'
], function (Marionette, Template, FormView, ProfilePicture, StudentTutorial) {
    'use strict';

    var ProfilePictureView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .icon-edit.tip-top': 'edit',
            'click #tutorialtest': 'startTutorial'
        },

        onShow: function () {
            this.trigger('showModal', this, FormView);
        },

        initialize: function (params) {
            this.model = new ProfilePicture(params.data, params);
            this.model.on('saved', this.render, this);
        },


        startTutorial: function () {
            //this one works
            //this.trigger('showModal', this, FormView);
            this.trigger('showModal', this, StudentTutorial);
        }
    });
    return ProfilePictureView;
});