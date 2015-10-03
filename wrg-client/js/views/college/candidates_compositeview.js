define([
    'marionette',
    'text!templates/college/candidates.html',
    'views/college/candidate_itemview',
    'collections/college/candidates',
    'views/college/edit/candidate_form_view'
], function (Marionette, Template, ItemView, CandidatesCollection, FormView) {
    "use strict";

    var CandidatesCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.college-list.candidate-list',

        initialize: function (params) {
            this.lastSelected = null;
            this.collection = new CandidatesCollection(params.data, params);
        },

        events: {
            'click .icon-plus.tip-top': 'newCandidate',
            'click .field': 'addColor'
        },

        newCandidate: function () {
            this.trigger('showModal', this, FormView, this.collection);
        },

        addColor: function (e) {
            $('#descriptionDiv').html($('#description' + e.target.id).html());
            $('#editCandidate' + e.target.id).css('display', 'block');
            $('#' + e.target.id).css('background-color', '#00b3f0');
            if (this.lastSelected !== e.target.id) {
                $('#' + this.lastSelected).css('background-color', 'white');
                $('#editCandidate' + this.lastSelected).css('display', 'none');
            }
            this.lastSelected = e.target.id;
        }
    });
    return CandidatesCollectionView;
});
