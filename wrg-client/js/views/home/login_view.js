define([
    'marionette',
    'text!templates/home/login.html',
    'models/login',
    'views/error_message_view',
    'models/registration_model',
    'underscore',
    'ddslick'
], function (Marionette, Template, Login, ErrorMessageView, RegistrationModel, _) {
    "use strict";

    var EmployerRegistrationView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .login-button': 'login',
            'click #registerFacebook': function () {
                this.signInSocialNetwork('facebook');
            },
            'click #registerLinkedin': function () { //This needs to be fixed here and also in html/css!!!
                this.signInSocialNetwork('linkedin');
            },
            'click #registerGoogle': function () {
                this.signInSocialNetwork('google');
            },
            'change #loginorganization': function (e) {
                this.externalAccess();
            },
            'click #logininstructions': function () {

            },
            'keypress #login-pass': 'keyManager',
            'keypress #login-email': 'keyManager'
        },
        regions: {
            message: '.validation-messages'
        },

        initialize: function (params) {
            Hull.logout();
            $(document).tooltip(); //Attahc tooltip Jquery method to html body
            this.model = new Login(null, params);
            this.model.socialRegistration = new RegistrationModel(null, params);
            this.vent = params.vent;
            this.reqres = params.reqres;
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onSubmit: function () {
            return false;
        },

        keyManager: function (e) {
            if (e.which === 13) {
                this.login("empty");
            }
        },

        externalAccess: function () {
            var config = this.reqres.request('config');
            var destination = $("#loginorganization option:selected").val();

            //Morehouse College Navigation
            if (destination === 1) {
                window.location.href = config.externalLogins.morehouse.link;
            }
            //if(destination === "")
        },

        onShow: function () {
            var config = this.reqres.request('config'),
                destination = $("#loginorganization option:selected").val();
            var that = this;

            var ddData = [
                /*{
                 text: "Facebook",
                 value: 1,
                 selected: false,
                 description: "Login to WRG using your Facebook Account !!!",
                 imageSrc: "../../img/socialicons/facebook-icon-32.png"
                 },
                 {
                 text: "Google Plus",
                 value: 2,
                 selected: false,
                 description: "Login to WRG using your Gmail Account",
                 imageSrc: "../../img/socialicons/gmail-icon-32.png"
                 },
                 {
                 text: "LinkedIn",
                 value: 3,
                 selected: false,
                 description: "Login to WRG with Linkedin credentials and import your profile to Work Ready Grad",
                 imageSrc: "../../img/socialicons/linkedin-icon-32.png"
                 },*/
                {
                    text: "Mourehouse College",
                    value: 0,
                    selected: false,
                    description: "Login to WRG with Morehouse credentials and import your profile to Work Ready Grad",
                    imageSrc: "../../img/socialicons/morehouse-icon-32.png"
                }
            ];

            $('#myDropdown').ddslick({
                data: ddData,
                width: 300,
                selectText: "Login with College Account",
                imagePosition: "right",
                onSelected: function (selectedData) {
                    var currentSelection = selectedData.selectedIndex;

                    if (currentSelection === 0) {
                        window.location.href = config.externalLogins.morehouse.link;
                    }

                    /* if(currentSelection === 1){
                     that.signInSocialNetwork("google");
                     }

                     if(currentSelection === 2){
                     that.signInSocialNetwork("linkedin");
                     }

                     if(currentSelection === 3){
                     window.location.href = config.externalLogins.morehouse.link;
                     }*/

                }
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        },

        signInSocialNetwork: function (service) {
            var checker ,
                that = this;
            var config = that.reqres.request('config'); //Use this configuration as necessary

            Hull.login(service);
            Hull.on('hull.auth.login', function (me) {

                checker = me.identities[0].email;
                //DEFENSIVE
                if (checker === null) {  //todo undefined !!!
                    that.showMessage(that.model, "Can't log in using via " + service + ". Please check your " + service + " account");
                    $("#pageloader").css("display", "none");
                    return;
                }
                //Shared properties between Social Networks
                var registerObject = {
                    'username': "",
                    'role': '',
                    'first_name': me.identities[0].first_name,
                    'last_name': me.identities[0].last_name,
                    'email': me.identities[0].email,
                    'password': me.id,
                    'activated': 'true',
                    'profile_image': me.picture,
                    'repeatPassword': me.id
                };
                var signInObject = {
                    'username': checker,
                    'password': me.id
                };

                if (service === "facebook") {
                    checker = me.identities[0].email;
                    signInObject.username = checker;
                    signInObject.password = me.id;
                    signInObject.facebook_uid = me.picture;

                    registerObject.facebook_uid = me.identities[0].uid;
                    registerObject.profile_image = "https://graph.facebook.com/" + me.identities[0].uid + "/picture?type=" + config.media.facebookImageSize;
                    that.finalizeSocialNetwork(that, registerObject, signInObject);
                }

                if (service === "linkedin") {
                    checker = me.identities[0].email;
                    signInObject.username = checker;
                    signInObject.password = me.id;

                    registerObject.linkedin_uid = me.identities[0].uid;

                    $("#wrglogin").prepend('<div id="wrgpreloader"> <img src="img/linkedin-data.gif"/> </div>');

                    _.delay(function () {//Until Hull is injected with rest of the functions, such as api
                        Hull.api({ provider: 'linkedin', path: 'people/~:(certifications,positions,skills,educations,honors-awards:(id,name,issuer,description,date,occupation))'}).then(function (data) {

                            if (data.hasOwnProperty("certifications")) {
                                //implement certificates if required
                            }

                            if (data.hasOwnProperty("educations")) {
                                registerObject.major = data.educations.values[0].fieldOfStudy;
                                registerObject.school = data.educations.values[0].schoolName;
                                registerObject.alma_mater = data.educations.values[0].schoolName;
                                registerObject.highest_edu_level = data.educations.values[0].degree;
                                registerObject.graduation_year = data.educations.values[0].endDate.year;
                            }

                            if (data.hasOwnProperty("positions")) {
                                registerObject.company = data.positions.values[0].company.name;
                                registerObject.job_title = data.positions.values[0].title;
                                registerObject.experiences = data.positions;
                            }

                            if (data.hasOwnProperty("honorsAwards")) {
                                registerObject.awards = data.honorsAwards;
                                //Only required field in Linkedin award section is Title!!!!!!!!!
                            }

                            if (data.hasOwnProperty("skills")) {
                                //implement certificates if required
                                registerObject.skills = data.skills;
                            }
                            $("#oapreloader").remove();

                            that.finalizeSocialNetwork(that, registerObject, signInObject);
                        });
                    }, 1000);
                }
                if (service === "google") {
                    var imageSizeCorrection;

                    imageSizeCorrection = me.picture.slice(0, -2);
                    checker = me.identities[0].email;
                    signInObject.username = checker;
                    signInObject.password = me.id;

                    registerObject.google_uid = me.identities[0].uid;
                    registerObject.profile_image = imageSizeCorrection + config.media.googleImageSize;

                    that.finalizeSocialNetwork(that, registerObject, signInObject);
                }

                //Built in validation bypass!!!
                //We are using social login system, thus not requiring input elements,
                //that.$('#animation-wrapper').addClass("animated rotateOut rotateOutDownLeft rotateOutDownRight rotateOutUpLeft rotateOutUpRight");
                that.$('#myDropdown').addClass("animated zoomOutDown");
                //myDropdown
                that.$('#login-email').val(checker);
                that.$('#login-pass').val("*******************");

                that.$('#login-email').prop('disabled', true);
                that.$('#login-pass').prop('disabled', true);

            });
        },

        finalizeSocialNetwork: function (that, registerObject, signInObject) {
            //try to login with the credentials received from SN
            that.model.set(signInObject);

            that.model.save(null, {
                success: _.bind(function () {
                    that.model.trigger('saved');
                    that.model.unset('username');
                    that.model.unset('password');
                    that.model.unset('remember');
                    that.vent.trigger('login:success', that.model);
                }, that),
                error: _.bind(function (model, response) {
                    //lets register this user
                    that.model.socialRegistration.set(registerObject);
                    var codeType = response.responseJSON.message.hError;
                    //this.networkUidSetter(service, me);
                    switch (codeType) {
                        case 'user': //Currently only one type of user is required.

                            //REGISTRATION IS RESOLVED IN HERE
                            //IMPORTANT!!! I am registering you here not SAVING !!!!!!!!!!!!!!!!!!
                            //Set the role right here
                            $("#dialog").dialog({
                                show: {
                                    effect: "drop",
                                    duration: 300
                                },
                                hide: {
                                    effect: "drop",
                                    duration: 300
                                },
                                width: 500,
                                height: 100,
                                resizable: false,
                                draggable: false,
                                modal: true,
                                buttons: {
                                    "Student": function () {
                                        $("#dialog").html();
                                        $(this).dialog("close");
                                        registerObject.role = "student";
                                        that.model.socialRegistration.set(registerObject);
                                        that.registerUser(that);
                                    },
                                    "Alumni": function () {
                                        $("#dialog").html();
                                        $(this).dialog("close");
                                        registerObject.role = "alumni";
                                        //registerObject.major = '';
                                        registerObject.activities = '';
                                        registerObject.advice = '';
                                        //registerObject.graduation_year = '';
                                        registerObject.graduation_month = '';
                                        //registerObject.alma_mater = '';
                                        //registerObject.major = '';
                                        //registerObject.highest_edu_level = '';
                                        //registerObject.company = '';
                                        //registerObject.job_title = '';
                                        registerObject.activities = '';
                                        registerObject.advice = '';
                                        registerObject.hindsight = '';

                                        that.model.socialRegistration.set(registerObject);
                                        that.registerUser(that);
                                    },
                                    "Cancel": function () {
                                        $("#dialog").html();
                                        that.$('#login-email').prop('disabled', false).val("");
                                        that.$('#login-pass').prop('disabled', false).val("");
                                        $(this).dialog("close");
                                        var config = that.reqres.request('config');
                                        window.location = config.clientLocation + '/#logout'; //route user out.
                                    }
                                },
                                open: function () {
                                    $('button').eq(0).attr('title', 'Cancel');
                                    $('button').eq(1).attr('title', 'Create a Student user based on Social Network Credentials');
                                    $('button').eq(2).attr('title', 'Create a Alumni user based on Social Network Credentials');
                                    $('button').eq(3).attr('title', 'Cancel');
                                }
                            });
                            break;
                        case 'Password':
                            //This case should not ever happen. This means that user that was previously
                            //created using social networks, changed his password manually.
                            //Another case is: I have logged in using Gmail (user@gmail.com)
                            //After that I try to login using facebook that is registered to user@gmail.com
                            that.showMessage(that.model, "E-mail already taken by another Social network ");
                            that.$('#login-email').val("");
                            that.$('#login-pass').val("");
                            that.$('#login-email').removeAttr('disabled');
                            that.$('#login-pass').removeAttr('disabled');
                            break;
                        default:
                        //console.log("Student should have been created, but apparently is not");
                    }
                }, that)
            });
        },

        registerUser: function (that) {
            that.model.socialRegistration.save(null, {
                success: _.bind(function () {
                    that.login(that.model.socialRegistration);
                }, that),
                error: _.bind(function (model, response) {
                }, that)
            });
        },

        login: function (params) {
            $("#pageloader").css("display", "block");
            if (params.hasOwnProperty('cid')) {
                this.model.set({   //this is social network login
                    'username': params.attributes.email,
                    'password': params.attributes.password,
                    'remember': this.$('#remember').is(':checked')
                });
            } else {
                this.model.set({      //this is normal login
                    'username': this.$('#login-email').val().toLowerCase(),
                    'password': this.$('#login-pass').val(),
                    'remember': this.$('#remember').is(':checked')
                });
            }
            this.model.save(null, {
                success: _.bind(function () {
                    //User is logged in now
                    //Do not hide the spinner
                    //The role view will hide the spinner
                    this.model.trigger('saved');
                    this.model.unset('username');
                    this.model.unset('password');
                    this.model.unset('remember');
                    this.vent.trigger('login:success', this.model);
                }, this),
                error: _.bind(function (model, response) {
                    $("#pageloader").fadeIn(800).delay(500).fadeOut(800);
                    var message = response.responseJSON.message.mainError;
                    this.showMessage(this.model, message);
                }, this)
            });
        }
    });

    return EmployerRegistrationView;
});