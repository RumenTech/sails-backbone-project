define([
    'marionette',
    'text!templates/company/challenges/challenges.html',
    'views/company/challenges/challenge_itemview',
    'collections/company/challenges',
    'views/company/challenges/add_challenge_form_view'
], function (Marionette, Template, ItemView, ChallengesCollection, FormView) {
    "use strict";

    var ChallengesCollectionView = Marionette.CompositeView.extend({
        template: Template,
        itemViewContainer: '.company-list.challenge-list',
        itemView: ItemView,

        events: {
            'click #addChallenge': 'newChallenge'
        },

        initialize: function (params) {
            for (var i = 0; i < params.data.length; i++) {
                params.data[i].company_image = params.company.get('profile_image');
            }
            this.collection = new ChallengesCollection(params.data, params);
        },

        newChallenge: function () {
            this.trigger('showModal', this, FormView, this.collection);
        }
    });
    return ChallengesCollectionView;
});
