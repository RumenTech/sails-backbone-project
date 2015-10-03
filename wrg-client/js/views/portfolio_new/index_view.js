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
    'text!templates/portfolio_new/index.html',
    'regions/modal_region',
    'models/portfolio/student',
    'views/tutorials/tutorial_view',
    'collections/portfolio/skills',
    'collections/portfolio/experiences',
    'collections/portfolio/awards',
    'utils/fileUploader',
    'utils/notifier',
    'utils/eventValidation'

], function (Marionette, ProfilePictureView, BasicInformationView, ExperiencePointsView, ExperiencesCompositeView, SkillsCompositeView, AwardsCompositeView, PersonalStatementView, ConnectionsView, SponsorsView, Template, ModalRegion, Student, TutorialView, SkillsCollection, ExperiencesCollection, AwardsCollection, fileUploader, notificator, validationRules) {
    //'use strict';

    var IndexView = Marionette.Layout.extend({
        template: Template,

        events: {
            'mouseover .imageHover': function (e) {
                var myId = e.currentTarget.id;

                $("#" + myId).css({ opacity: 0.5 });
            },
            'mouseleave .imageHover': function (e) {
                var myId = e.currentTarget.id;
                $("#" + myId).css({ opacity: 1 });
            },
            'click #createPdfButton': 'pdfCreation'
        },

        regions: {
            profilePicture: '#profile-picture-section',
            basicInformation: '#basic-information-section',
            experiencePoints: '#experience-points-section',
            experiences: '#experiences-section',
            skills: '#skills-section',
            awards: '#awards-section',
            personalStatement: '#personal-statement-section',
            connections: '#connections-section',
            sponsors: '#sponsors-section',
            tutorial: '#tutorial-section',
            modal: ModalRegion
        },

        initialize: function (options) {
            //TODO Jquery not instantiated for some reason. fix it

            //Make sure we start with clean localstorage everytime
            localStorage.removeItem("clientImage");
            var that = this;

            $(document).tooltip(); //Attach tooltip Jquery method to html body
            this.vent = options.vent;
            this.reqres = options.reqres;

            var config = this.reqres.request('config');
            var session = this.reqres.request('session');

            this.model = new Student(null, options);
            this.awardsCollection = new AwardsCollection(options.data, options);
            this.skillsCollection = new SkillsCollection(options.data, options);
            this.experiencesCollection = new ExperiencesCollection(options.data, options);
            this.listenTo(this.experiencesCollection, 'loaded', this.onLoaded, this);
            this.listenTo(this.model, 'loaded', this.onLoadedStudent, this);
            this.listenTo(this.model, 'update', this.updateProgressBar, this);
            $("#pageloader").fadeIn(config.spinnerTimeout).delay(config.spinnerTimeout).fadeOut(config.spinnerTimeout);
            this.model.set("friendInvitationMessage", config.socialOptions.fb.inviteFriendsMessage);
            this.model.set("inviteFriendRoute", config.socialOptions.fb.inviteFriendRoute);

            $(document).on("click", "#sendWithCameraImage", function () {
                that.uploadImageFromCamera();
            });

            //This is the way to unload old Hull and replace it with the new one. Just uncomment this line, if implementing it.
            //this.loadNewHull("http://d3f5pyioow99x0.cloudfront.net/0.8.32/hull.js")
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        uploadImageFromCamera: function () {
            fileUploader.filePdfUploader(this.reqres.request('config'));
        },

        pdfCreation: function () {
            //Defense
            var tempExp = {},
                tempAward = {},
                tempSkill = {};

            wrgSettings.pdfMaterial.experience = [];
            wrgSettings.pdfMaterial.skills = [];
            wrgSettings.pdfMaterial.awards = [];
            if (!wrgSettings.pdfMaterial.school || wrgSettings.pdfMaterial.school === "null") {//null might be set if student registers via Social Networks
                notificator.validate("Need to have a school for CV :)", "error");
                return;
            }
            //Basic Data creation
            wrgSettings.pdfMaterial.addressline = "Email: " + this.model.attributes.email + " - School: " + this.model.attributes.school;
            wrgSettings.pdfMaterial.fullname = this.model.attributes.first_name + " " + this.model.attributes.last_name;

            //Get Experiences
            //Need at least one experience to make a resume
            //TODO: Make Validation warning for user
            if (this.experiencesCollection.models.length === 0) {
                notificator.validate("Need at least one experience to make a CV :)", "error");
                return;
            }
            //Filling Experiences
            this.experiencesCollection.models.forEach(function (key, index, complete) {
                tempExp.title = key.attributes.title;
                tempExp.description = key.attributes.description;
                tempExp.date = "Start:" + key.attributes.start_month + "." + key.attributes.start_year + " -- End:" + key.attributes.end_month + "." + key.attributes.end_year;
                wrgSettings.pdfMaterial.experience.push(tempExp);
                tempExp = {};
            });
            //filling Awards
            this.awardsCollection.models.forEach(function (key, index, complete) {
                tempAward.title = key.attributes.title;
                tempAward.description = key.attributes.description;
                tempAward.issuedby = key.attributes.presentor;
                tempAward.date = key.attributes.year;
                wrgSettings.pdfMaterial.awards.push(tempAward);
                tempAward = {};
            });
            //Filling Skills
            this.skillsCollection.models.forEach(function (key, index, complete) {
                tempSkill.name = key.attributes.name;
                //tempAward.description = key.attributes.description;
                tempSkill.score = key.attributes.proficiency_level;
                wrgSettings.pdfMaterial.skills.push(tempSkill);
                tempSkill = {};
            });

            this.imageSelection();
        },

        detectIExplorer: function () {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            var trident = ua.indexOf('Trident/');

            if (msie > 0) {
                // IE 10 or older => return version number
                //return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                return true;
            }
            if (trident > 0) {
                // IE 11 (or newer) => return version number
                var rv = ua.indexOf('rv:');
                //return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                return true;
            }
            // other browser
            return false;
        },

        sendPdfEmail: function () {
            var pdfDestinationEmail = $("#emailresume").val();
            fileUploader.sendPdfInEmail(pdfDestinationEmail);
        },

        imageSelection: function () {

            var that = this;
            var canvas = document.getElementById("canvas"),
                context = canvas.getContext("2d"),
                video = document.getElementById("video"),
                videoObj = { "video": true },
                errBack = function (error) {
                    $("#hardwareinitialization").empty();
                    var arrorMessage = $("<div id='hardwareinitimessage' class='animated rubberBand'>Problem Accessing Your Camera Device. You can still make your resume :)</div>");

                    $("#video").hide();
                    $("#canvas").hide();
                    $("#grabimagebtn").hide();
                    $("#hardwareinitialization").append(arrorMessage);
                    $("#camera-message");

                    $('#camera-message').animate({
                        height: wHeight / 5
                    });
                },
                wWidth = $(window).width(),
                dWidth = wWidth * 0.8,
                wHeight = $(window).height(),
                dHeight = wHeight * 0.8;

            //Clear Context of the Canvas
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.restore();

            $("#camera-message").dialog({
                //dialogClass: 'customDialogue',
                show: {
                    effect: "drop",
                    duration: 300
                },
                hide: {
                    effect: "drop",
                    duration: 300
                },
                width: dWidth, // 1.6,// / 2,
                height: dHeight,// / 1.6,
                dialogClass: "noTitleStuff",
                resizable: false,
                draggable: false,
                modal: true,
                close: function () {
                    $("#cameraControls").hide();
                },
                buttons: {
                    Close: function () {
                        $("#cameraControls").hide();
                        $(this).dialog("close");
                    },
                    Grab_Image: {
                        text: "New Image",
                        class: "myGreenButton",
                        id: "grabimagebtn",
                        click: function () {
                            //Add shadow when the element becomes visible

                            $("#canvas").addClass("shadow animated fadeInLeftBig", 500, "swing", function () {
                                $("#canvas").removeClass("animated fadeInLeftBig");
                            });
                            context.drawImage(video, 0, 0, 320, 240);
                            var stringImage = canvas.toDataURL();
                            //remove the file specifications!!!
                            stringImage = stringImage.replace("data:image/png;base64,", "");

                            notificator.validate("Like your image? You can experiment until you find the right one :)", "success");

                            //Prevent masochistic clicking on the snap image button :)
                            $("#grabimagebtn").prop("disabled", true);
                            setTimeout (function () {
                                $("#grabimagebtn").prop("disabled", false);
                            },2000);

                            localStorage.setItem('clientImage', stringImage);
                        }
                    },
                    Make_CV: {
                        text: "Create CV",
                        class: "myBlueButton",
                        id: "createcvbutton",
                        click: function () {
                            $("#viewcv").prop("disabled", true);//Disable viewcv button while the new CV generation is under way
                            $("#createcvbutton").prop("disabled", true); //disable multiple clicks (SPAM the server)on createcv button
                            fileUploader.filePdfUploader(that.reqres.request('config'));
                        }
                    },
                    View_CV: {
                        text: "View CV",
                        id: "viewcv",
                        //style: "opacity: 0.2",
                        class: "myBlueButton",
                        click: function () {
                            //enable send button
                            $("#emailpdf").show();
                            window.open(wrgSettings.pdfMaterial.completeUrl);
                        }
                    }
                },
                open: function () {
                    $("#viewcv").hide();
                    $("#emailpdf").on("click", that.sendPdfEmail);

                    $(".validator").on("change",  validationRules.validatorEngine);

                    var cameraInitializationMessage = "Firing up the Camera... hold on",
                        cameraInit = $("<div id='hardwareinitimessage' class='animated rubberBand'></div>");

                    $(this).closest(".ui-dialog").find(".ui-dialog-titlebar:first").hide();
                    //Make CV Better
                    $("#cvchecker").empty();
                    $("#hardwareinitialization").empty();

                    setTimeout(function () {
                        if (wrgSettings.pdfMaterial.skills.length === 0) {
                            var skillsMessage = $("<div class='animated rubberBand'>Hint: Consider adding some SKILLS :)</div>");
                            $("#cvchecker").append(skillsMessage);
                        }
                        if (wrgSettings.pdfMaterial.awards.length === 0) {
                            var skillsMessage = $("<div class='animated rubberBand'>Hint: Add some AWARDS for better resume? :)</div>");
                            $("#cvchecker").append(skillsMessage);
                        }
                        var skillsMessage = $("<div class='animated rubberBand'>Hint: View your CV and then send it in email :)</div>");
                        $("#cvchecker").append(skillsMessage);

                        if (that.detectIExplorer()) {
                            //We got IE. Just stop further detection
                            //IE Does not support native hardware access, and it is considered as a bug in Microsoft.
                            //More details here: https://connect.microsoft.com/IE/feedback/details/865369/lack-of-support-for-getusermedia-hurting-adoption-of-internet-explorer-ie-ie11-ie10
                            //If time allows, flash/silverlight fallback should be implemented
                            cameraInitializationMessage = "Internet Explorer does not support camera, but you can still make resume :)";
                            cameraInit.text(cameraInitializationMessage);
                            $("#video").hide();
                            $("#canvas").hide();
                            $("#grabimagebtn").hide();
                            $("#hardwareinitialization").append(cameraInit);
                            $('#camera-message').animate({
                                height: wHeight / 5
                            });
                            return;
                        }
                    }, 3500);

                    cameraInit.text(cameraInitializationMessage);

                    $("#hardwareinitialization").append(cameraInit);

                    setTimeout(function () {
                        $("#cameraControls").show();

                        $('.ui-dialog-buttonset').find('button:first').addClass('myRedButton closeCameraDialogue');

                        // Put video listeners into place
                        if (navigator.getUserMedia) { // Standard
                            navigator.getUserMedia(videoObj, function (stream) {
                                video.src = stream;
                                video.play();
                                that.cameraMessageClearance(stream);
                            }, errBack);
                        } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
                            navigator.webkitGetUserMedia(videoObj, function (stream) {
                                video.src = window.webkitURL.createObjectURL(stream);
                                video.play();
                                that.cameraMessageClearance(stream);
                            }, errBack);
                        }
                        else if (navigator.mozGetUserMedia) { // Firefox-prefixed
                            navigator.mozGetUserMedia(videoObj, function (stream) {
                                video.src = window.URL.createObjectURL(stream);
                                video.play();
                                that.cameraMessageClearance(stream);
                            }, errBack);
                        }
                    }, 1000);
                }
            });
        },

        cameraMessageClearance: function (stream) {

            function closeStream() {
                stream.stop();
            }

            setTimeout(function () {
                $("#hardwareinitialization").addClass("animated bounceOutLeft");
            }, 2200);

            $(document).on('click', ".closeCameraDialogue", closeStream);
        },

        loadNewHull: function (source, properties) {
            /* Explanation: Initial Hull object was used to verify a user against our database
             Reason is initially both projects used same Facebook application, which have different Hashes
             We are forced to use old api only to login users, and use new facebook application for other actions,
             such as friend invite and others. Why we need new application for invite friends and other actions?
             Simple... branding problems for end users. Users will be seeing Our ability instead of Work Ready Grad
             */
            delete Hull;

            $.getScript(source, function (data, textStatus, jqxhr) {

                Hull.init({
                    "appId": "538c8a558d47dd46fb0001a2",
                    "orgUrl": "https://workreadygrad.hullapp.io",

                    //appId: "52d3f674e1b13be75b00007d",
                    // orgUrl: "https://b9104cf0.hullapp.io",
                    sources: {
                        facebook: 'lib/hull'
                    }
                }, function (hull) {
                    // console.log(hull);
                });

                Hull.ready(function () {

                    //Hull.parse(that.$el);
                });
            });
        },

        onShow: function () {
            Hull.ready(function () {
                setTimeout(function () {
                    Hull.parse(this.$el); //Fix for share options on the index page
                }, 3000);
            });
        },

        onLoaded: function () {
            // TODO: Work with Marionette events and find a way to set up a
            // showmodal callback without writing six listenTo statements.
            // This works, but it seems cluttered.
            // Also note that this may need to be called in conjunction with
            // onShowCalled()!

            this.reqres.setHandler('student_id', _.bind(function () {
                return this.model.get('id');
            }, this));

            this.experiencePoints.show(new ExperiencePointsView({
                reqres: this.reqres,
                data: this.experiencesCollection.models
            }));

            this.experiences.show(new ExperiencesCompositeView({
                reqres: this.reqres,
                data: this.experiencesCollection
            }));
            this.listenTo(this.experiences.currentView, 'showModal itemview:showModal', this.showModal, this);
            this.listenTo(this.experiences.currentView, 'showModal itemview:update_points_compositeview', this.update_points_new, this, this.experiencesCollection);

            this.skills.show(new SkillsCompositeView({
                reqres: this.reqres,
                data: this.skillsCollection,
                student: this.model
            }));
            this.listenTo(this.skills.currentView, 'showModal', this.showModal, this);

            this.awards.show(new AwardsCompositeView({
                reqres: this.reqres,
                data: this.awardsCollection
            }));
            this.listenTo(this.awards.currentView, 'showModal itemview:showModal', this.showModal, this);
            this.updateProgressBar();

            //Sync updates for master model!!!
            wrgSettings.pdfMaterial.school = this.model.get('school');
            wrgSettings.pdfMaterial.graddate = /*this.model.get('graduation_month') + "." +*/ this.model.get('graduation_year');
            wrgSettings.pdfMaterial.major = this.model.get('major');
            wrgSettings.pdfMaterial.objective = this.model.get('tagline');
        },

        onLoadedStudent: function () {
            // TODO: Work with Marionette events and find a way to set up a
            // showmodal callback without writing six listenTo statements.
            // This works, but it seems cluttered.
            // Also note that this may need to be called in conjunction with
            // onShowCalled().
            this.reqres.setHandler('student_id', _.bind(function () {
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

            this.personalStatement.show(new PersonalStatementView({
                reqres: this.reqres,
                data: this.model.attributes,
                student: this.model
            }));
            this.listenTo(this.personalStatement.currentView, 'showModal', this.showModal, this);

            this.connections.show(new ConnectionsView({
                reqres: this.reqres,
                data: this.model.get('connections')
            }));

            this.reqres.setHandler('student_id', _.bind(function () {
                return this.model.get('id');
            }, this));
            this.tutorial.show(new TutorialView({
                reqres: this.reqres,
                data: this.model.attributes
            }));
            this.listenTo(this.tutorial.currentView, 'showModal', this.showModal, this);

            var startTutorial = this.model.get("tutorial");

            if (startTutorial) {
                $("#starttutorial").click();
            }
            this.updateProgressBar();
        },

        showModal: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.collection,
                reqres: this.reqres,
                student: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, reqres: this.reqres}, options));
        },

        update_points_new: function (experiences) {
            //console.log("new/updated",experience.model.collection.models);
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
            if (this.model.get("profile_image") !== null) {
                completeness += 10;
            }
            //Personal statement check
            if (this.model.get("video_url") !== null && this.model.get("personal_statement") !== null) {
                completeness += 10;
            }
            //Skill check
            if (this.skillsCollection && this.skillsCollection.length === 1) {
                completeness += 5;
            }
            else if (this.skillsCollection && this.skillsCollection.length > 1 && this.skillsCollection.length <= 3) {
                completeness += 10;
            }
            else if (this.skillsCollection && this.skillsCollection.length > 3 && this.skillsCollection.length <= 6) {
                completeness += 15;
            }
            else if (this.skillsCollection && this.skillsCollection.length > 6 && this.skillsCollection.length <= 10) {
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
            if (this.experiencesCollection && this.experiencesCollection.length > 0) {
                completeness += 10;
                var exp = this.experiencesCollection.models;
                for (var i = 0; i < exp.length; i++) {
                    if (exp[i].media && exp[i].media.length > 0) {
                        completeness += 10;
                        break;
                    }
                }
            }
            //Awards check
            if (this.awardsCollection && this.awardsCollection.length >= 1) {
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