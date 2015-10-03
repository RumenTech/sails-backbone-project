define([
    'marionette',
    'text!templates/portfolio/edit/basic_information_form.html',
    'lib/backbone.modelbinder',
    'models/portfolio/basic_information',
    'views/error_message_view',
    'utils/searchAsYouType',
    'utils/conversionUtils',
    'utils/eventValidation',
    'lib/jqueryui'
], function (Marionette, Template, ModelBinder, BasicInformation, ErrorMessageView, SearchAsYouType, ConversionUtils, ValidationRules) {
    'use strict';

    var BasicInformationFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'keyup #school': function () {
                SearchAsYouType.searchSchools(this, 'school');
            },
            'focus #graduation-year': function () {
                ConversionUtils.insertYearsFromNow('graduation-year', 'Grad Year');
            },
            'change .validator': function (e) {
                ValidationRules.validatorEngine(e);
            }
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            first_name: '#first-name',
            last_name: '#last-name',
            school: '#school',
            school_list_id: '#searchSchoolsId',
            major: '#major',
            graduation_month: '#graduation-month',
            graduation_year: '#graduation-year',
            gpa: '#gpa',
            tagline: '#tagline',
            tagline_keywords: '#tagline_keywords',
            personal_website: '#personal-website',
            facebook_url: '#facebook-url',
            twitter_url: '#twitter-url',
            google_url: '#google-url',
            linkedin_url: '#linkedin-url'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new BasicInformation(params.data, params);
            }
            this.student_id = params.reqres.request('student_id');
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        save: function () {
            var schoolId = this.$('#searchSchoolsId').val();
            if (schoolId === '') {
                schoolId = null;
            } else {
                schoolId = ConversionUtils.returnInteger(schoolId);
            }
            this.message.close();
            //PDF Override for updates. This is not getting dynamically updated, so this is forced update
            this.model.set('student_id', this.student_id);
            this.model.set('school', this.$('#school').val());
            this.model.set('school_list_id', schoolId);
            wrgSettings.pdfMaterial.school = this.model.get('school');
            wrgSettings.pdfMaterial.graddate = /*this.model.get('graduation_month') + " " + */ this.model.get('graduation_year');
            wrgSettings.pdfMaterial.major = this.model.get('major');
            wrgSettings.pdfMaterial.objective = this.model.get('tagline');

            delete this.model.attributes.profile_image;
            this.model.save(null, {
                success: _.bind(function () {
                    this.model.trigger('saved');
                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function () {
                    // TODO: Replace with an error message
                }, this)
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return BasicInformationFormView;
});