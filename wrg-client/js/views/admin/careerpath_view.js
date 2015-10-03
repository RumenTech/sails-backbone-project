define([
    'marionette',
    'text!templates/admin/careerpath.html',
    'models/portfolio/basic_information',
    'utils/searchAsYouType',
    'utils/conversionUtils',
    'utils/notifier',
    'lib/jqueryui'
], function (Marionette, Template, BasicInformation, SearchAsYouType, ConversionUtils, Notifier) {
    "use strict";

    var CareerpathView = Marionette.Layout.extend({
        template: Template,

        events: {
            'keyup #school': function () {
                SearchAsYouType.searchSchools(this, 'school');
            },
            'click #next': 'next'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.model = new BasicInformation(null, options);
            $("#pageloader").fadeIn(800).delay(200).fadeOut(800);
        },

        next: function () {
            var schoolId = this.$('#searchSchoolsId').val();
            if (schoolId === '') {
                schoolId = null;
            } else {
                schoolId = ConversionUtils.returnInteger(schoolId);
            }
            var school = $('#school').val();
            if (school === '' || school === undefined || school === null) {
                Notifier.validate('You need to set school first', 'error');
            } else {
                this.model.set('school_list_id', schoolId);
                this.model.set('school', school);
                this.model.set('first_name', this.model.session.first_name);
                this.model.set('last_name', this.model.session.last_name);
                this.model.save(null, {
                    success: _.bind(function () {
                        window.location = '#career_path';
                    }, this),
                    error: _.bind(function (err) {
                        Notifier.validate('Something went wrong. Please try again', 'error');
                    }, this)
                });
            }
        }
    });
    return CareerpathView;
});
