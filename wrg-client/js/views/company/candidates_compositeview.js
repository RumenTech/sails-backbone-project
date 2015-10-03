define([
    'marionette',
    'text!templates/company/candidates.html',
    'views/company/candidate_itemview',
    'collections/company/candidates',
    'views/company/edit/candidate_form_view',
    'text!templates/readonly/skillrepresentation.html'
], function (Marionette, Template, ItemView, CandidatesCollection, FormView, skillRepresentation) {
    "use strict";

    var ExperiencesCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.company-list.candidate-list',

        events: {
            'click .icon-plus.tip-top': 'newCandidate',
            'click .field': 'addColor'
        },

        initialize: function (params) {
            this.lastSelected = null;
            this.collection = new CandidatesCollection(params.data, params);
        },

        newCandidate: function () {
            this.trigger('showModal', this, FormView, this.collection);
        },

        addColor: function (e) {
            $('#descriptionDiv').html($('#description' + e.target.id).html());
            $('#editCandidate' + e.target.id).css('display', 'block');
            $('#' + e.target.id).css('background-color', '#00b3f0');
            if (this.lastSelected != e.target.id) {
                $('#' + this.lastSelected).css('background-color', 'white');
                $('#editCandidate' + this.lastSelected).css('display', 'none');
            }
            this.lastSelected = e.target.id;
        }
    });
    return ExperiencesCollectionView;
});
