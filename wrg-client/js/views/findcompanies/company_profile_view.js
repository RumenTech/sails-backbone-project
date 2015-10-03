/**
 * Created by semir.sabic on 3/18/14.
 */
define([
    'marionette',
    'text!templates/findcompanies/company_profile.html',
    'lib/backbone.modelbinder',
    'models/company_profile',
    'views/findcompanies/media_view',
    'regions/modal_region',
    'tagsinput'

], function (Marionette, Template, ModelBinder, CompanyProfile, MediaView, ModalRegion) {
    "use strict";

    var CompanyProfileView = Marionette.Layout.extend({
        template: Template,

        regions: {
            sponsors: '#sponsors-section',
            modal: ModalRegion
        },

        events: {
            'click .project-view': 'openModal',
            'click .candidates': 'showCandidate',
            'click #viewJob': 'showJobDetails'
        },

        initialize: function (params) {

            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.modelBinder = new ModelBinder();
            var companyId = document.location.href.split('/')[document.location.href.split('/').length - 1];
            this.model = new CompanyProfile(companyId, params);
            this.listenTo(this.model, 'loaded', this.onLoaded, this);
            // $(window).tooltip(); //Attach tooltip Jquery method to html body
        },

        onLoaded: function () {
            var media = this.model.get('media'),
                candidates = this.model.get('candidates'),
                jobs = this.model.get('jobs');
            for (var i = 0; i < media.length; i++) {
                if (media[i].type === 'video') {
                    var shortUrl = media[i].media_url.split("watch?v=");
                    media[i].id_video = shortUrl[1];
                    media[i].showIndex = i;
                    media[i].embedded = "//www.youtube.com/" + "embed/" + shortUrl[1];
                }
            }

            for (var i = 0; i < jobs.length; i++) {
                if (jobs[i].job_description.length > 350) {
                    jobs[i].job_description_short = jobs[i].job_description.substring(0, 600) + '...';
                }
                else {
                    jobs[i].job_description_short = jobs[i].job_description;
                }
            }

            for (var i = 0; i < candidates.length; i++) {
                candidates[i].index = i;
            }

            this.render();
        },

        onRender: function () {
            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('body').css('visibility', 'visible');
            $('#candidate-0').click();

            //Tags display initialisation
            $('#keywords').tagsInput({
                width: '433px',
                height: '100',
                'interactive': false,
                'onRemoveTag': function (removedTag) {
                    //Untill better way is found to disable x button
                    //Just rearange the skills
                    $('#keywords').addTag(removedTag);
                }
            });
        },

        openModal: function (e) {

            var index = $(e.currentTarget).attr('index');
            this.showModal(MediaView, this.model);
        },

        showModal: function (formClass, model) {
            var options = {
                model: model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({model: model, reqres: this.reqres}, options));
        },

        showCandidate: function (e) {

            $("#displayskillset").show();

            var skills,
                cHTML = "";

            var candidates = this.model.get('candidates');
            var index = e.currentTarget.id.split('-')[1];

            $('div[id^="candidate-"]').css("background-color", "#ffffff");
            $('#candidate-' + index).css("background-color", "#00b3f0");
            $('#department').text(candidates[index].department);
            $('#descriptionTitle').text(candidates[index].position);
            $('#required').show();
            $('#descriptionText').html(candidates[index].description);
            $('#preferred').show();

            $('#prefDescriptionText').html(candidates[index].preffereddescription);
            $('#preferredskills').show();

            skills = candidates[index].skill_keywords;

            $('#keywords').importTags('');

            if (skills !== null) {
                skills = candidates[index].skill_keywords.split(",");
                skills.forEach(function (eachSkill) {
                    $('#keywords').addTag(eachSkill);
                    //cHTML += "<strong class='glyphicon glyphicon-2x glyphicon-tag'>" + eachSkill + "</strong>" + " ";
                });
                $('#prefSkills').html(cHTML);
            }

            $('#preferredcategories').show();
            //Internship

            if (candidates[index].internship === null || candidates[index].internship === 0) {
                $('#intershiplabel').hide();
                $('#internship').text("");
            } else {
                $('#intershiplabel').show();
                $('#internship').text(candidates[index].internship);
            }
            //Community Service
            if (candidates[index].communityservice === null || candidates[index].communityservice === 0) {
                $('#communityservicelabel').hide();
                $('#communityservice').text("");
            } else {
                $('#communityservicelabel').show();
                $('#communityservice').text(candidates[index].communityservice);
            }
            //Public Speaking
            if (candidates[index].publicspeaking === null || candidates[index].publicspeaking === 0) {
                $('#publicspeakinglabel').hide();
                $('#publicspeaking').text("");
            } else {
                $('#publicspeakinglabel').show();
                $('#publicspeaking').text(candidates[index].publicspeaking);
            }
            //Research
            if (candidates[index].research === null || candidates[index].research === 0) {
                $('#researchlabel').hide();
                $('#research').text("");
            } else {
                $('#researchlabel').show();
                $('#research').text(candidates[index].research);
            }
            //Leadership
            if (candidates[index].leadership === null || candidates[index].leadership === 0) {
                $('#leadershiplabel').hide();
                $('#leadership').text("");
            } else {
                $('#leadershiplabel').show();
                $('#leadership').text(candidates[index].leadership);
            }
            //Innovation
            if (candidates[index].innovation === null || candidates[index].innovation === 0) {
                $('#innovationlabel').hide();
                $('#innovation').text("");
            } else {
                $('#innovationlabel').show();
                $('#innovation').text(candidates[index].innovation);
            }
            //Industry outreach
            if (candidates[index].industryoutreach === null || candidates[index].industryoutreach === 0) {
                $('#industrylabel').hide();
                $('#industry').text("");
            } else {
                $('#industrylabel').show();
                $('#industry').text(candidates[index].industryoutreach);
            }
            //Grit
            if (candidates[index].grit === null || candidates[index].grit === 0) {
                $('#gritlabel').hide();
                $('#grit').text("");
            } else {
                $('#gritlabel').show();
                $('#grit').text(candidates[index].grit);
            }
        },

        showJobDetails: function (e) {
            var jobId = $(e.currentTarget).attr('job_id');
            window.location = '#job_student/' + jobId + '_company';
        }
    });

    return CompanyProfileView;
});

