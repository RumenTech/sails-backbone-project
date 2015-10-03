define([
    'marionette',
    'text!templates/tutorial/tutorial.html',
    'views/portfolio/edit/profile_picture_form_view',
    'models/portfolio/profile_picture',
    'views/tutorials/student/student_tutorial'/*,
     'views/tutorials/alumni/alumni_tutorial'*/

], function (Marionette, Template, FormView, ProfilePicture, StudentTutorial) {//, AlumniTutorial) {
    'use strict';

    var ProfilePictureView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .icon-edit.tip-top': 'edit',
            'click #starttutorial': 'startTutorial'
        },

        onShow: function () {
            this.trigger('showModal', this, FormView);
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.model = new ProfilePicture(params.data, params);
            this.model.on('saved', this.render, this);
        },

        startTutorial: function () {
            var session = this.reqres.request('session');
            var role = session.role;

            if (role === "student") {
                this.trigger('showModal', this, StudentTutorial);
            }

            /* if(role === "alumni"){
             this.trigger('showModal', this, AlumniTutorial);
             }*/
            //TODO Add more user roles if required (uncomment at the top as well)...
        }
    });
    return ProfilePictureView;
});