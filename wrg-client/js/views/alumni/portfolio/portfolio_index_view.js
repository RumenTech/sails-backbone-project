define([
    'marionette',
    'views/alumni/portfolio/profile_picture_view',
    'views/alumni/portfolio/basic_information_view',
    'views/alumni/portfolio/experience_points_view',
    'views/alumni/portfolio/experiences_compositeview',
    'views/alumni/portfolio/skills_compositeview',
    'views/alumni/portfolio/awards_compositeview',
    'views/alumni/portfolio/sponsors_view',
    'text!templates/alumni/portfolio/portfolio_index.html',
    'regions/modal_region',
    'collections/professional/experiences',
    'collections/professional/skills',
    'collections/professional/awards',
    'views/alumni/portfolio/connections_view',
    'models/professional/professional'

], function (Marionette, ProfilePictureView, BasicInformationView, ExperiencePointsView, ExperiencesCompositeView, SkillsCompositeView, AwardsCompositeView, SponsorsView, Template, ModalRegion, ExperiencesCollection, SkillsCollection, AwardsCollection, ConnectionsView, Professional) {
    "use strict";

    var IndexView = Marionette.Layout.extend({
        template: Template,

        events: {
            'mouseover .imageHover': function (e) {
                var myId = e.currentTarget.id;
                $("#" + myId).css({ opacity: 0.5 });  //TODO Fix fade in of image itself!!!
            },
            'mouseleave .imageHover': function (e) {
                var myId = e.currentTarget.id;
                $("#" + myId).css({ opacity: 1 });
            }
        },

        regions: {
            profilePicture: '#profile-picture-section',
            basicInformation: '#basic-information-section',
            experiencePoints: '#experience-points-section',
            experiences: '#experiences-section',
            skills: '#skills-section',
            awards: '#awards-section',
            connections: '#connections-section',
            sponsors: '#sponsors-section',
            modal: ModalRegion
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;

            var config = this.reqres.request('config');
            var session = this.reqres.request('session');

            this.model = new Professional(null, options);

            this.experiencesCollection = new ExperiencesCollection(options.data, options);
            this.skillsCollection = new SkillsCollection(options.data, options);
            this.awardsCollection = new AwardsCollection(options.data, options);

            this.listenTo(this.experiencesCollection, 'loaded', this.onLoaded, this);
            //    this.listenTo(this.model, 'update', this.updateProgressBar, this);
            $("#pageloader").fadeIn(800).delay(config.spinnerTimeout).fadeOut(800);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            // TODO: Work with Marionette events and find a way to set up a
            // showmodal callback without writing six listenTo statements.
            // This works, but it seems cluttered.
            // Also note that this may need to be called in conjunction with
            // onShowCalled().

            this.profilePicture.show(new ProfilePictureView({
                reqres: this.reqres,
                data: this.model.attributes

            }));
            this.listenTo(this.profilePicture.currentView, 'showModal', this.showModal, this);

            this.basicInformation.show(new BasicInformationView({
                reqres: this.reqres,
                data: this.model.attributes
            }));
            this.listenTo(this.basicInformation.currentView, 'showModal', this.showModal, this);

            this.experiencePoints.show(new ExperiencePointsView({
                reqres: this.reqres,
                data: this.experiencesCollection.models
            }));

            this.experiences.show(new ExperiencesCompositeView({
                reqres: this.reqres,
                data: this.experiencesCollection,
                student: this.model
            }));
            this.listenTo(this.experiences.currentView, 'showModal itemview:showModal', this.showModal, this);
            this.listenTo(this.experiences.currentView, 'showModal itemview:update_points_compositeview', this.update_points_new, this.experiencesCollection);

            this.skills.show(new SkillsCompositeView({
                reqres: this.reqres,
                data: this.skillsCollection,
                student: this.model
            }));
            this.listenTo(this.skills.currentView, 'showModal', this.showModal, this);


            this.awards.show(new AwardsCompositeView({
                reqres: this.reqres,
                data: this.awardsCollection,
                student: this.model
            }));
            this.listenTo(this.awards.currentView, 'showModal itemview:showModal', this.showModal, this);

            this.connections.show(new ConnectionsView({
                reqres: this.reqres
            }));

            this.sponsors.show(new SponsorsView());
        },

        showModal: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: collection,
                reqres: this.reqres,
                student: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, reqres: this.reqres}, options));
        },

        update_points_new: function (experiences) {

            if (experiences.model) {

                this.experiencePoints.show(new ExperiencePointsView({
                    reqres: this.reqres,
                    data: experiences.model.collection.models
                }));
            }
        },

        updateProgressBar: function () {
            var completeness = 0;
            //Basic info completeness check
            if (this.model.get("first_name") !== null) {
                completeness += 3.75;
            }
            if (this.model.get("last_name") !== null) {
                completeness += 3.75;
            }
            if (this.model.get("major") !== null) {
                completeness += 3.75;
            }
            if (this.model.get("gpa") !== null) {
                completeness += 3.75;
            }
            if (this.model.get("graduation_month") !== null && this.model.get("graduation_year") !== null) {
                completeness += 3.75;
            }
            if (this.model.get("school") !== null) {
                completeness += 3.75;
            }
            if (this.model.get("tagline") !== null) {
                completeness += 3.75;
            }
            if (this.model.get("facebook_url") !== null || this.model.get("google_url") !== null || this.model.get("linkedin_url") !== null || this.model.get("twitter_url") !== null) {
                completeness += 3.75;
            }
            //Profile image check
            if (this.model.get("profile_image") != null) {
                completeness += 10;
            }
            //Personal statement check
            if (this.model.get("video_url") != null && this.model.get("personal_statement") != null) {
                completeness += 10;
            }
            //Skill check
            if (this.model.get("skills") && this.model.get("skills").length == 1) {
                completeness += 5;
            }
            else if (this.model.get("skills") && this.model.get("skills").length > 1 && this.model.get("skills").length <= 3) {
                completeness += 10;
            }
            else if (this.model.get("skills") && this.model.get("skills").length > 3 && this.model.get("skills").length <= 6) {
                completeness += 15;
            }
            else if (this.model.get("skills") && this.model.get("skills").length > 6 && this.model.get("skills").length <= 10) {
                completeness += 20;
            }
            //Connections check
            if (this.model.get("connections") && this.model.get("connections").length <= 5) {
                completeness += 5;
            }
            else if (this.model.get("connections") && this.model.get("connections").length > 5) {
                completeness += 10;
            }
            //Experience check
            if (this.model.get("experiences") && this.model.get("experiences").length > 0) {
                completeness += 10;
                var exp = this.model.get("experiences");
                for (var i = 0; i < exp.length; i++) {
                    if (exp[i].media && exp[i].media.length > 0) {
                        completeness += 10;
                        break;
                    }
                }
            }
            //Awards check
            if (this.model.get("awards") && this.model.get("awards").length >= 1) {
                completeness += 5;
            }

            //Add completeness to model
            this.model.set("completeness", completeness);

            this.sponsors.show(new SponsorsView({
                data: this.model
            }));
        }
    });
    return IndexView;
});