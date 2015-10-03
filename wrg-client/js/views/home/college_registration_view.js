define([
    'marionette',
    'text!templates/home/college_registration.html',
    'models/registration_model',
    'views/error_message_view',
    'utils/eventValidation',
    'utils/searchAsYouType',
    'utils/conversionUtils'
], function (Marionette, Template, RegistrationModel, ErrorMessageView, validationRules, SearchAsYouType, ConversionUtils) {
    "use strict";

    var CollegeRegistrationView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click #save-user': 'save',
            'change .validator': function (e) {
                validationRules.validatorEngine(e);
            },
            'blur .validator': function (e) {
                validationRules.validatorEngine(e);
            },
            'submit #fileinfo': function (e) {
                this.save(e);
            },
            'keyup #name': function () {
                SearchAsYouType.searchSchools(this, 'name', true);
            }
        },

        regions: {
            message: '.validation-messages'
        },

        initialize: function (options) {
            $(document).tooltip(); //Attach tooltip Jquery method to html body
            this.model = new RegistrationModel(null, options);
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        save: function (e) {
            var schoolId = this.$('#searchSchoolsId').val();
            if (schoolId === '' || schoolId === undefined) {
                schoolId = null;
            } else {
                schoolId = ConversionUtils.returnInteger(schoolId);
            }
            e.preventDefault();
            this.message.close();
            this.model.set({
                'role': 'college',
                'name': this.$('#name').val(),
                'school_id': schoolId,
                'email': this.$('#email').val(),
                'password': this.$('#password').val(),
                'repeatPassword': this.$('#repeatPassword').val(),
                'description': this.$('#collegeDescription').val()
            });

            this.model.save(null, {
                success: _.bind(function () {
                    this.model.trigger('registration:success');
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        showMessage: function (model, message) {
            $(".validation-messages").css("display", "block");
            setTimeout(function () {
                $('.validation-messages').fadeOut(2000);
            }, 3000);
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return CollegeRegistrationView;
});