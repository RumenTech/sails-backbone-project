define([
	'marionette',
	'views/portfolio/profile_picture_view',
	'views/portfolio/basic_information_view',
	'views/portfolio/experience_points_view',
	'views/portfolio/experiences_compositeview',
	'views/portfolio/skills_compositeview',
	'views/portfolio/awards_compositeview',
	'views/portfolio/personal_statement_view',
	'views/portfolio/connections_view',
	'views/portfolio/sponsors_view',
	'text!templates/portfolio/index.html',
	'regions/modal_region',
	'models/portfolio/student'
], function(
	Marionette,
	ProfilePictureView,
	BasicInformationView,
	ExperiencePointsView,
	ExperiencesCompositeView,
	SkillsCompositeView,
	AwardsCompositeView,
	PersonalStatementView,
	ConnectionsView,
	SponsorsView,
	Template,
	ModalRegion,
	Student) {

	var IndexView = Marionette.Layout.extend({
		template: Template,

		regions: {
			profilePicture: 	'#profile-picture-section',
			basicInformation: 	'#basic-information-section',
			experiencePoints: 	'#experience-points-section',
			experiences: 		'#experiences-section',
			skills:  			'#skills-section',
			awards: 			'#awards-section',
			personalStatement: 	'#personal-statement-section',
			connections: 		'#connections-section',
			sponsors: 			'#sponsors-section',
			modal: 				ModalRegion
		},

		initialize: function(options) {
			this.vent = options.vent;
			this.reqres = options.reqres;
			this.model = new Student(null, options);
			this.listenTo(this.model, 'loaded', this.onLoaded, this);
            //$("#pageloader").css("display","none");

            $("#pageloader").fadeIn(800).delay(3000).fadeOut(800);

        },
		onRender:function(){
            $('body').css('visibility','visible');

        },
		onLoaded: function() {
			// TODO: Work with Marionette events and find a way to set up a 
			// showmodal callback without writing six listenTo statements. 
			// This works, but it seems cluttered.
			// Also note that this may need to be called in conjunction with
			// onShowCalled().

            //$("#pageloader").css("display","block");
            this.reqres.setHandler('student_id', _.bind(function() {
                return this.model.get('id');
            }, this));
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
                data: this.model.get('experiences')
            }));

			this.experiences.show(new ExperiencesCompositeView({
				reqres: this.reqres,
				data: this.model.get('experiences'),
				student: this.model
			}));
			this.listenTo(this.experiences.currentView, 'showModal itemview:showModal', this.showModal, this);
            this.listenTo(this.experiences.currentView, 'showModal itemview:update_points_compositeview', this.update_points_new, this, this.collection);


            this.skills.show(new SkillsCompositeView({
				reqres: this.reqres,
				data: this.model.get('skills'),
				student: this.model
			}));
			this.listenTo(this.skills.currentView, 'showModal', this.showModal, this);

			this.awards.show(new AwardsCompositeView({
				reqres: this.reqres,
				data: this.model.get('awards')
			}));
			this.listenTo(this.awards.currentView, 'showModal itemview:showModal', this.showModal, this);

			this.personalStatement.show(new PersonalStatementView({
				reqres: this.reqres,
				data: this.model.attributes,
				student: this.model
			}));
			this.listenTo(this.personalStatement.currentView, 'showModal', this.showModal, this);

			this.connections.show(new ConnectionsView({
                reqres: this.reqres,
                data:this.model.get('connections')
            }));
			this.sponsors.show(new SponsorsView());


		},
		showModal: function(view, formClass, collection) {
			var options = {
				model: view.model, 
				collection: this.collection,
                reqres:this.reqres,
                student: this.model
			};
			options = _.extend(options, this.options);
			this.modal.show(new formClass({collection:collection,model:view.model,reqres:this.reqres},options));

		},
        update_points_new : function(experience){
            //console.log("new/updated",experience.model.collection.models);
            if (experience.model && experience.model.collection) {
            	var experiences = new Array();
	            for(var i=0; i< experience.model.collection.models.length; i++){
	                experiences[i]  = experience.model.collection.models[i].attributes;
	            }

	            this.experiencePoints.show(new ExperiencePointsView({
	                reqres: this.reqres,
	                data: experiences
	            }));
            }
        }


	});

	return IndexView;
});