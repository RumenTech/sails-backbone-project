define([
    'marionette',
    'text!templates/home/index.html',
    'views/home/alumni_registration_view',
    'views/home/employer_registration_view',
    'views/home/registration_success_view',
    'views/home/student_registration_view',
    'views/home/college_registration_view',
    'views/home/login_view',
    'views/home/pwd_reset_view',
    'views/home/pwdreset_success_view',
    'utils/eventValidation',
    'utils/searchAsYouType',
    'utils/notifier'
], function (Marionette, Template, AlumniRegistrationView, EmployerRegistrationView, RegistrationSuccessView, StudentRegistrationView, CollegeRegistrationView, LoginView, PwdResetView, PwdResetSuccess, validationRules, SearchAsYouType, notificator) {
    "use strict";

    var IndexView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .register-student': 'showRegistration',
            'click .register-alumni': 'showRegistration',
            'click #login-link': 'showLogin',
            'keypress .shadowinput': 'keyManager',//shadowinput is also used for detection of enter key press
            'change .validator': function (e) {
                validationRules.validatorEngine(e);
            },
            'keyup #schoolfastregister': function () {
                this["fastmodel"] = this.reqres;
                SearchAsYouType.searchSchools(this, 'schoolfastregister');
            },
            'click #fastregisterbtn': "fastRegistrationCalculation",
            'click .register-employer': 'showRegistration',
            'click .register-college': 'showRegistration',
            'click #cant-signin': 'showPwdReset',
            'click #facebookshare': function (e) {
                e.preventDefault();
                e.stopPropagation();
                var jobLink = window.location.href; //localhost links are not working with the Share. Must be IP or domain name

                _.delay(function () {
                    Hull.api({ provider: 'facebook', path: 'ui.share' }, { href: "http://www.workreadygrad.com" });
                }, 1);
            }
        },

        regions: {
            login: '#loginwrapper',
            registration: '#register1wrapper',
            pwdreset: '#passresetwrapper'
        },

        initialize: function (params) {
            $(document).tooltip(); //Attach tooltip Jquery method to html body
            this.vent = params.vent;
            this.reqres = params.reqres;
        },

        onRender: function () {

            $('body').css('visibility', 'visible');

            var config = this.reqres.request('config');
            //Hide Loader from front screen
            //TODO Fade this out using Jquery animate or similar.
            //Main page has loaded
            //Visitor is not logged in yet!!!
            $("#pageloader").fadeIn(800).delay(config.spinnerTimeout).fadeOut(800);

            this.$('.register-student,.register-alumni,.register-employer, .register-college').click(_.bind(function (e) {
                e.preventDefault();
                this.openTab('#register1wrapper');
            }, this));

            this.$('#cant-signin').click(_.bind(function (e) {
                e.preventDefault();
                this.openTab('#passresetwrapper');
            }, this));

            this.$('#registerFacebook').click(_.bind(function (e) {
                e.preventDefault();
            }, this));
        },

        closeOpenTab: function () {
            this.$('.register-student,.register-alumni,.register-employer, .register-college, #login-link').removeClass('menu_selected');
            this.$('.login-wrapper').slideUp();
        },

        keyManager: function (e) {
            if (e.which === 13) {
                this.fastRegistrationCalculation();
            }
        },

        fastRegistrationCalculation: function () {

            var fastRegisterName = $("#namefastregister").val(),
                fastRegisterLastName = $("#lastnamefastregister").val(),
                fastRegisterEmail = $("#emailfastregister").val(),
                fastRegisterSchool = $("#schoolfastregister").val(),
                fastRegisterPassword = $("#passwordfastregister").val(),
                fastRegisterRepeatPassword = $("#repeatpasswordfastregister").val();

            if ($("#namefastregister").hasClass("validationstop") || $("#lastnamefastregister").hasClass("validationstop") || $("#emailfastregister").hasClass("validationstop") || $("#passwordfastregister").hasClass("validationstop") || $("#repeatpasswordfastregister").hasClass("validationstop")) {
                notificator.validate('Please fill the mandatory fields', "error");

                if($("#namefastregister").val() === "") {
                    $("#namefastregister").addClass("validationIsBad animated rubberBand");
                    $("#namefastregister").removeClass("validationIsGood ");
                } else {
                    $("#namefastregister").addClass("validationIsGood");
                    $("#namefastregister").removeClass("validationIsBad");
                }

                if($("#lastnamefastregister").val() === "") {
                    $("#lastnamefastregister").addClass("validationIsBad animated rubberBand");
                    $("#lastnamefastregister").removeClass("validationIsGood");
                } else {
                    $("#lastnamefastregister").addClass("validationIsGood");
                    $("#lastnamefastregister").removeClass("validationIsBad");
                }

                if($("#emailfastregister").val() === "") {
                    $("#emailfastregister").addClass("validationIsBad animated rubberBand");
                }

                if($("#passwordfastregister").val() === "") {
                    $("#passwordfastregister").addClass("validationIsBad animated rubberBand");
                }

                if($("#repeatpasswordfastregister").val() === "") {
                    $("#repeatpasswordfastregister").addClass("validationIsBad animated rubberBand");
                }

            } else {
                $("#pageloader").fadeIn(1000).delay(1000).fadeOut(1000);
                $(".register-student").click();
                $("#register1section").hide();
                $(".mainstudentslogoimage").hide();

                setTimeout(function () {
                    $("#first-name").val(fastRegisterName);
                    $("#last-name").val(fastRegisterLastName);
                    $("#email").val(fastRegisterEmail);
                    $("#searchSchools").val(fastRegisterSchool);
                    $("#password").val(fastRegisterPassword);
                    $("#repeatPassword").val(fastRegisterRepeatPassword);

                    $('#save-user').click();
                }, 100);
            }
        },

        openTab: function (tab_id) {
            this.$('.register-student,.register-alumni, .register-employer, .register-college, #login-link').removeClass('menu_selected');
            if (this.$('.login-wrapper').is(":visible") === true) {
                this.$('.login-wrapper').hide();
                this.$(tab_id).show();
                $('#login-email').focus();
            }
            else {
                this.$(tab_id).slideDown();
                $('#login-email').focus();
            }
        },

        bindCloseEvents: function () {
            this.$('.close').click(_.bind(function (e) {
                e.preventDefault();
                this.closeOpenTab();
                this.registration.close();
                this.login.close();
            }, this));
        },

        showLogin: function () {
            this.registration.close();
            this.login.show(new LoginView(this.options));
            this.listenTo(this.login.currentView, 'login:success', this.onLoginSuccess, this);
            this.bindCloseEvents();
            this.openTab('#loginwrapper');
        },

        showPwdReset: function () {
            this.registration.close();
            this.login.close();
            this.pwdreset.show(new PwdResetView(this.options));
            this.bindCloseEvents();
            this.listenTo(this.pwdreset.currentView.model,
                'pwdreset:success', this.showPwdSentSuccess, this);
            this.openTab('#passresetwrapper');
        },

        showRegistration: function (e) {
            this.login.close();
            switch (e.currentTarget.className) {
                case 'register-student':
                    this.registration.show(new StudentRegistrationView(this.options));
                    break;
                case 'register-alumni':
                    this.registration.show(new AlumniRegistrationView(this.options));
                    break;
                case 'register-employer':
                    this.registration.show(new EmployerRegistrationView(this.options));
                    break;
                case 'register-college':
                    this.registration.show(new CollegeRegistrationView(this.options));
                    break;
            }

            this.listenTo(this.registration.currentView.model,
                'registration:success', this.showRegistrationSuccess, this);

            this.bindCloseEvents();
        },

        onShow: function () {
            Hull.ready(function () {
                setTimeout(function () {
                    Hull.parse(this.$el); //Fix for share options on the index page
                }, 3000);
            });
        },

        showRegistrationSuccess: function () {

            var config = this.reqres.request('config');
            this.registration.close();
            this.registration.show(new RegistrationSuccessView());
            //this.listenTo(this.registration.currentView, 'show:login', this.showLogin, this);

            if (config.autoLoginRegistration) {
                setTimeout(function () {
                    window.location.href = config.clientLocation;
                }, 3000);
            }
        },

        showPwdSentSuccess: function () {
            this.pwdreset.close();
            this.pwdreset.show(new PwdResetSuccess());
            this.listenTo(this.pwdreset.currentView,
                'show:login', this.showLogin, this);
        },

        onLoginSuccess: function (sessionModel) {
            this.vent.trigger('app:session:set', sessionModel);
        }
    });
    return IndexView;
});