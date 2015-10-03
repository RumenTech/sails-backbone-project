define([
    'marionette',
    'views/reporting/reporting_form_view',
    'text!templates/reporting/index.html',
    'regions/modal_region',
    'collections/reportings',
    'views/reporting/suggestions_compositeview'
], function (Marionette, ReportingFormView, Template, ModalRegion, Reportings, Suggestions) {
    'use strict';

    var IndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            reportingForm: '#reporting-form-section',
            reportingResults: '#suggestions-reporting-section',
            modal: ModalRegion
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.reportings = new Reportings(null, {reqres: this.reqres});
            this.reportings.fetching();
            this.listenTo(this.reportings, 'loaded', this.onLoaded, this);
            this.config = this.reqres.request('config');
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            this.reportingForm.show(new ReportingFormView({
                reqres: this.reqres,
                collection: null
            }));
            this.listenTo(this.reportingForm.currentView, 'filterEducation', this.onFilterEducation, this);
            this.listenTo(this.reportingForm.currentView, 'filterIndustry', this.onFilterIndustry, this);
            this.listenTo(this.reportingForm.currentView, 'filterSkills', this.onFilterSkills, this);
            this.listenTo(this.reportingForm.currentView, 'filterEmployment', this.onFilterEmployment, this);

            this.reportingResults.show(new Suggestions({
                reqres: this.reqres,
                collection: this.reportings
            }));
            this.listenTo(this.reportingResults.currentView, 'showModal itemview:showModal', this.showModal, this);
            $("#pageloader").fadeIn(800).delay(200).fadeOut(800);
        },

        onFilterIndustry: function (view, model) {
            $('.load_alumni').css('display', 'none');
            this.reportings.reset();
            this.reportings.fetch({
                url: this.config.endPoints.getAlumniIndustryData,
                data: $.param({
                    startYear: model.startYear,
                    endYear: model.endYear,
                    industry: model.industry
                })
            });
        },

        onFilterEducation: function (view, model) {
            $('.load_alumni').css('display', 'none');
            this.reportings.reset();
            this.reportings.fetch({
                url: this.config.endPoints.getAlumniEducationData,
                data: $.param({
                    startYear: model.startYear,
                    endYear: model.endYear,
                    education: model.education
                })
            });
        },

        onFilterSkills: function (view, model) {
            $('.load_alumni').css('display', 'none');
            this.reportings.reset();
            this.reportings.fetch({
                url: this.config.endPoints.getAlumniSkillsData,
                data: $.param({
                    startYear: model.startYear,
                    endYear: model.endYear,
                    skill: model.skill
                })
            });
        },

        onFilterEmployment: function (view, model) {
            $('.load_alumni').css('display', 'none');
            this.reportings.reset();
            this.reportings.fetch({
                url: this.config.endPoints.getAlumniEmploymentData,
                data: $.param({
                    startYear: model.startYear,
                    endYear: model.endYear,
                    employment: model.employment
                })
            });
        },

        showModal: function (view, formClass) {
            var options = {
                model: view.model,
                collection: this.collection
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass(options));
        }
    });
    return IndexView;
});