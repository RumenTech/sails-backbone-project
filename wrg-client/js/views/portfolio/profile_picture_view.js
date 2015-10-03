define([
    'marionette',
    'text!templates/portfolio/profile_picture.html',
    'views/portfolio/edit/profile_picture_form_view',
    'models/portfolio/profile_picture'
], function (Marionette, Template, FormView, ProfilePicture) {
    'use strict';

    var ProfilePictureView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .icon-edit.tip-top': 'edit'
        },

        initialize: function (params) {
            this.model = new ProfilePicture(params.data, params);
            this.model.on('saved', this.render, this);
        },

        edit: function () {
            this.trigger('showModal', this, FormView);
        }
    });
    return ProfilePictureView;
});