define([
    'marionette',
    'text!templates/company/findtalents/search_criteria.html',
    'views/company/findtalents/filter_form_view',
    'regions/modal_region'
], function (Marionette, Template, FilterFormView, ModalRegion) {
    "use strict";

    var SuggestionItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        regions: {
            modal: ModalRegion
        },

        events: {
            'click #seeSearch': 'showFilter',
            'click #delete-criteria': 'deleteCriteria'

        },

        initialize: function (params) {
        },

        deleteCriteria: function () {
            var id = this.model.get('id');
            this.model.destroy({ data: $.param({ id: id})});
        },

        showFilter: function () {
            //NOT a good solution! overriding
            var criterias = {};
            criterias = this.model.attributes;

            $('.button.clear-search').click();
            $('#criteria_name').val(criterias.criteria_name);
            $('#name').val(criterias.name);
            $('#company').val(criterias.company);
            $('#school').val(criterias.school);
            $('#major').val(criterias.major);
            $('#talent_gpa').val(criterias.gpa);
            $('#talent_job_title').val(criterias.job_title);
            $('#talent_skill').val(criterias.talent_skill);
            $('#experience_criteria').val(criterias.experience_criteria);
            $('#experience_points').val(criterias.experience_points);
            if (criterias.experiences) {
                var exp = JSON.parse(criterias.experiences);
                for (var i = 0; i < exp.length; i++) {
                    $('#experience_criteria').val(exp[i].category_id);
                    $('#experience_points').val(exp[i].points);
                    $('#add-criteria').click();
                }
            }
            $('.filter').click();
        }
    });

    return SuggestionItemView;
});