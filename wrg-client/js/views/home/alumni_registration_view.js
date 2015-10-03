define([
    'marionette',
    'text!templates/home/alumni_registration.html',
    'models/registration_model',
    'views/error_message_view',
    '../../config',
    'models/login',
    'utils/notifier',
    'utils/eventValidation',
    'utils/searchAsYouType',
    'utils/conversionUtils',
    'lib/jqueryui',
    'ddslick'

], function (
    Marionette,
    Template,
    RegistrationModel,
    ErrorMessageView,
    config,
    Login,
    Notificator,
    validationRules,
    SearchAsYouType,
    ConversionUtils) {
    "use strict";

    var AlumniRegistrationView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click #save-user': 'save',
            'keyup #searchalmamater': function(){
                SearchAsYouType.searchSchools(this, 'searchalmamater');
            },
            'click #registerFacebook': function () {
                this.signInSocialNetwork('facebook');
            },
            'click #registerLinkedin': function () {
                this.signInSocialNetwork('linkedin');
            },
            'click #registerGoogle': function () {
                this.signInSocialNetwork('google');
            },
            'change .validator': function (e) {
                validationRules.validatorEngine(e);
            },
            'blur .validator': function (e) {
                validationRules.validatorEngine(e);
            },
            'submit #fileinfo': function (e) {
                this.save(e);
            },
            'focus #graduation-year': function(){
                ConversionUtils.insertYearsToNow('graduation-year', 'Graduation Year');
            }
        },

        regions: {
            message: '.validation-messages'
        },

        initialize: function (options) {
            Hull.logout();
            this.model = new RegistrationModel(null, options);
            this.model.loginManual = new Login(null, options);
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.model.set('profile_image', '//placehold.it/180x180');
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        save: function (e) {
            var schoolId = this.$('#searchSchoolsId').val();
            if (schoolId === '') {
                schoolId = null;
            } else {
                schoolId = ConversionUtils.returnInteger(schoolId);
            }
            // Remove alert messages for validation errors.
            e.preventDefault();
            this.message.close();

            // Set attributes based on user input.
            this.model.set({
                'role': 'alumni',
                'first_name': this.$('#first-name').val(),
                'last_name': this.$('#last-name').val(),
                'email': this.$('#email').val(),
                'password': this.$('#password').val(),
                'repeatPassword': this.$('#repeatPassword').val(),
                'alma_mater': this.$('#searchalmamater').val(),
                'alma_mater_id': schoolId,
                'major': this.$('#major').val(),
                'graduation_year': this.$('#graduation-year').val(),
                'highest_edu_level': this.$('#level-of-edu').val(),
                'industry': this.$('#alumnus-industry').val(),
                'company': this.$('#company').val(),
                'job_title': this.$('#job-title').val(),
                'activities': this.$('#question-1').val(),
                'advice': this.$('#question-2').val(),
                'hindsight': this.$('#question-3').val(),
                'profile_image': this.$('#profile-img').prop('src')
            });

            // Save the model. If validation errors are found, save aborts.
            this.model.save(null, {
                success: _.bind(function () {
                    this.model.trigger('registration:success');
                }, this),
                error: _.bind(function (model, response) {
                    if (response.responseJSON.user.code === '23505')
                        var message = 'The email is already registered.';
                    else
                        var message = response.responseJSON.message;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        showMessage: function (model, message) {
            $(".validation-messages").css("display", "block");
            setTimeout(function() {
                $('.validation-messages').fadeOut(2000);
            }, 3000);
            this.message.show(new ErrorMessageView({message: message}));
        },

        onShow: function () {
            var config = this.reqres.request('config');

            var ddData = [
                {
                    text: "Mourehouse College",
                    value: 0,
                    selected: false,
                    description: "Login to WRG with Morehouse credentials and import your profile to Work Ready Grad",
                    imageSrc: "../../img/socialicons/morehouse-icon-32.png"
                }
            ];

            $('#myDropdown').ddslick({
                data:ddData,
                width:300,
                selectText: "Register with College Account",
                imagePosition:"right",
                onSelected: function(selectedData){
                    var currentSelection = selectedData.selectedIndex;

                    if(currentSelection === 0){
                        window.location.href = config.externalLogins.morehouse.link;
                    }
                }
            });
        },

        signInSocialNetwork: function (service) {
            var checker,
                that = this;

            $("#pageloader").css("display", "block");
            //Make sure spinner is removed if the SN window is closed before completion
            window.addEventListener("focus", listenToHullWindow, false);

            function listenToHullWindow() {
                //Remove the function after killing the spiner
                $("#pageloader").css("display", "none");
                window.removeEventListener("focus", listenToHullWindow, false);
            }

            var config = that.reqres.request('config'); //Use this configuration as necessary

            Hull.login(service);

            Hull.on('hull.auth.login', function (me) {

                    checker = me.identities[0].email;
                    //DEFENSIVE
                    if (checker === null) {
                        that.showMessage(that.model, "Can't log in using via " + service + ". Please check your " + service + " account");
                        $("#pageloader").css("display", "none");
                        return;
                    }

                    var registerObject = {
                        'role': 'alumni',
                        'first_name':me.identities[0].first_name,
                        'last_name':me.identities[0].last_name,
                        'email':me.identities[0].email,
                        'password': me.id,
                        'repeatPassword': me.id
                    };

                    var signInObject = {
                        'username': checker,
                        'password': me.id
                    };

                    if(service === "facebook"){
                        checker = me.identities[0].email;
                        signInObject.username = checker;
                        signInObject.password = me.id;
                        signInObject.facebook_uid = me.id;

                        registerObject.facebook_uid = me.identities[0].uid;
                        registerObject.profile_image =  "https://graph.facebook.com/" + me.identities[0].uid + "/picture?type=" + config.media.facebookImageSize;

                        that.finalizeSocialNetwork(that, registerObject, signInObject);
                    }

                    if(service === "linkedin") {
                        checker = me.identities[0].email;
                        signInObject.username = checker;
                        signInObject.password = me.id;

                        registerObject.linkedin_uid = me.identities[0].uid;

                    _.delay(function () {//Until Hull is injected with rest of the functions, such as api
                        Hull.api({ provider: 'linkedin', path: 'people/~:(positions,skills,educations,honors-awards:(id,name,issuer,description,date,occupation))' }).then(function (data) {

                            if(data.hasOwnProperty("educations")){
                                registerObject.major = data.educations.values[0].fieldOfStudy;
                                registerObject.school = data.educations.values[0].schoolName;
                                registerObject.alma_mater = data.educations.values[0].schoolName;
                                registerObject.highest_edu_level = data.educations.values[0].degree;
                                registerObject.graduation_year = data.educations.values[0].endDate.year;
                            }

                            if(data.hasOwnProperty("positions")){
                                registerObject.company = data.positions.values[0].company.name;
                                registerObject.job_title =  data.positions.values[0].title;
                            }

                            if(data.hasOwnProperty("honorsAwards")){
                                registerObject.awards = data.honorsAwards;
                                //Only required field in Linkedin award section is Title!!!!!!!!!
                            }

                            if(data.hasOwnProperty("skills")){
                                //implement certificates if required
                                registerObject.skills = data.skills;
                            }

                            that.finalizeSocialNetwork(that, registerObject, signInObject);
                        });
                    },1000);
                    }

                    if(service === "google") {
                        var imageSizeCorrection;

                        imageSizeCorrection = me.picture.slice(0, -2);
                        checker = me.identities[0].email;
                        signInObject.username = checker;
                        signInObject.password = me.id;

                        registerObject.google_uid = me.identities[0].uid;
                        registerObject.profile_image = imageSizeCorrection + config.media.googleImageSize;

                        that.finalizeSocialNetwork(that, registerObject, signInObject);
                    }
                }
            );
        },

        finalizeSocialNetwork: function (that, registerObject, signInObject ){
            //Try to login
            that.model.loginManual.set(signInObject);
            that.model.loginManual.save(null, {
                success:_.bind(function () {
                    that.model.trigger('saved');
                    that.model.unset('username');
                    that.model.unset('password');
                    that.model.unset('remember');
                    that.vent.trigger('login:success', that.model.loginManual);
                }, that),
                error:_.bind(function (model, response) {
                    //lets register this user
                    that.model.set(registerObject);
                    var codeType = response.responseJSON.message.hError;
                    switch (codeType) {
                        case 'user': //Currently only one type of user is required.

                            //REGISTRATION IS RESOLVED IN HERE
                            //IMPORTANT!!! I am registering you here not SAVING !!!!!!!!!!!!!!!!!!
                            that.model.save(null, {
                                success:_.bind(function () {

                                    that.logInUser(that.model);
                                }, that),
                                error:_.bind(function (model, response) {
                                }, that)
                            });
                            break;
                        case 'Password':
                            //This case should not ever happen. This means that user that was previously
                            //created using social networks, changed his password manually.
                            //Another case is: I have logged in using Gmail (user@gmail.com)
                            //After that I try to login using facebook that is registered to user@gmail.com
                            that.showMessage(that.model, "Problem with Social Network Account ");
                            that.$('#login-email').val("");
                            that.$('#login-pass').val("");
                            that.$('#login-email').prop('disabled', false);
                            that.$('#login-pass').prop('disabled', false);
                            break;
                        default:
                            //console.log("Student should have been created, but apparently is not");
                    }
                }, that)
            });
        },

        logInUser: function (model) {
            this.model.loginManual.set({   //this is social network login
                'username': model.attributes.email,
                'password': model.attributes.password
            });

            this.model.loginManual.save(null, {
                success: _.bind(function () {
                    //User is logged in now
                    //Do not hide the spinner
                    //The role view will hide the spinner
                    //$("#pageloader").css("display","none");
                    this.model.loginManual.trigger('saved');
                    this.model.loginManual.unset('username');
                    this.model.loginManual.unset('password');
                    this.model.loginManual.unset('remember');
                    this.vent.trigger('login:success', this.model.loginManual);
                }, this),
                error: _.bind(function (model, response) {
                    $("#pageloader").fadeIn(800).delay(500).fadeOut(800);
                    var message = response.responseJSON.message.mainError;
                    this.showMessage(this.model, message)
                }, this)
            });
        }
    });
    return AlumniRegistrationView;
});
