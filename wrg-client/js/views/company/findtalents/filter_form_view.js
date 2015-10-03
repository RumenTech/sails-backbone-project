define([
    'marionette',
    'text!templates/company/findtalents/filter_form.html',
    'models/company/talent',
    'models/company/criteria_search',
    'views/error_message_view',
    'views/company/findtalents/search_criteria_compositeview',
    'utils/notifier',
    'lib/backbone.modelbinder',
    'collections/company/criterias_search'
], function (Marionette, Template, Talent, CriteriaSearchModel, ErrorMessageView, SearchCriteriaCompositeView, Notifier, ModelBinder, CriteriaSearchCollection) {
    "use strict";

    var FilterFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .button.filter': 'filter',
            'click .button.clear-search': 'clearSearch',
            'click .button.save-criteria': 'saveCriteria',
            'click #add-criteria': 'addCriteria',
            'keypress #name': 'keyManager',
            'keypress #company': 'keyManager',
            'keypress #school': 'keyManager',
            'keypress #major': 'keyManager',
            'keypress #talent_skill': 'keyManager'
        },

        regions: {
            message: '.validation-messages',
            searchCriterias: '#filter-search-criterias'
        },

        bindings: {
            'criteria_name': '#criteria_name',
            'name': '#name',
            'company': '#company',
            'school': '#school',
            'major': '#major',
            'gpa': '#talent_gpa',
            'job_title': '#talent_job_title',
            'talent_skill': '#talent_skill'
        },

        initialize: function (params) {
            $('#searchCriteria').css('visibility', 'hidden');
            this.reqres = params.reqres;
            this.collection = new CriteriaSearchCollection(params.colData, params);
            this.modelBinder = new ModelBinder();
            this.companyId = params.id;
            if (!this.model) {
                this.model = new Talent(params.data, params);
            }
            if (!this.model.experiences) {
                this.model.set('experiences', []);
            }
            this.listenTo(this.model, 'load', this.onLoaded, this);
            this.listenTo(this.collection, 'loaded', this.viewCriteria, this);
            this.listenTo(this.collection, 'saved', this.viewCriteria, this);
        },

        keyManager: function (e) {
            if (e.which === 13) {
                this.filter();
            }
        },

        onLoaded: function () {
            this.searchCriterias.show(new SearchCriteriaCompositeView({
                reqres: this.reqres,
                collection: this.collection
            }));
        },

        viewCriteria: function () {
            this.searchCriterias.show(new SearchCriteriaCompositeView({
                reqres: this.reqres,
                collection: this.collection
            }));
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
            this.collection.trigger('loaded');
        },

        saveCriteria: function () {
            if (this.model.get('criteria_name') === '' || this.model.get('criteria_name') === undefined) {
                Notifier.validate('You must enter criteria name', "error");
            } else {
                var data = this.model.attributes;
                data.experiences = JSON.stringify(this.model.get('experiences'));
                data.reqres = this.reqres;
                data.company_id = this.companyId;
                var criteriaModel = new CriteriaSearchModel(data, data);
                criteriaModel.save(null, {
                    success: _.bind(function () {
                        this.collection.add(criteriaModel);
                        Notifier.validate('Criteria successfully created', "success");
                        this.collection.trigger('saved');
                    }, this),
                    error: _.bind(function (model, response) {
                        var message = response.responseJSON.message;
                        Notifier.validate(response.responseJSON.message, "error");
                    }, this)
                });
            }
        },

        filter: function () {
            // NOT a good solution!!! Overriding binding, because of Saved Criteria
            this.model.set('criteria_name', $('#criteria_name').val());
            this.model.set('name', $('#name').val());
            this.model.set('company', $('#company').val());
            this.model.set('major', $('#major').val());
            this.model.set('job_title', $('#talent_job_title').val());
            this.model.set('gpa_criteria', $('#gpa_criteria').val());
            this.model.set('talent_skill', $('#talent_skill').val());
            this.model.set('experience_points', $('#experience_points').val());
            this.model.set('experience_criteria', $('#experience_criteria').val());
            this.model.set('school', $('#school').val());
            this.model.set('gpa', $('#talent_gpa').val());


            var gpaValue = this.model.get('gpa');
            if (gpaValue === '' || gpaValue === undefined) {
                this.model.set('gpa_criteria', 'IS NULL');
            } else {
                this.model.set('gpa_criteria', '>=');
            }
            this.trigger('filter', this, this.model);
        },

        clearSearch: function () {
            this.model.set('name', '');
            this.model.set('company', '');
            this.model.set('major', '');
            this.model.set('school', '');
            this.model.set('gpa', '');
            this.model.set('job_title', '');
            this.model.set('talent_skill', '');
            this.model.set('gpa_criteria', '');
            this.model.set('experience_criteria', '');
            this.model.set('experience_points', '');
            this.model.set('criteria_name', '');
            $('#added-criterias').empty();
            this.model.set('experiences', []);
            this.trigger('filter', this, this.model);
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        },

        addCriteria: function () {
            var exp = {};
            exp.category_id = $('#experience_criteria').val();
            exp.points = $('#experience_points').val();
            exp.category_text = $("#experience_criteria option:selected").text();
            var experiences = this.model.get('experiences');
            experiences.push(exp);
            this.model.set('experiences', experiences);
            this.render();
        }
    });
    return FilterFormView;
});