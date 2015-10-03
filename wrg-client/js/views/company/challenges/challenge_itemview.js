define([
    'marionette',
    'text!templates/company/challenges/challenge.html',
    'views/company/challenges/add_challenge_form_view',
    'views/company/challenges/challenge_delete'
], function (Marionette, Template, FormView, DeleteView) {
    "use strict";

    var ChallengeItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .icon-edit.tip-top': 'edit',
            'click .icon-delete.tip-top': 'deleteChallenge',
            'click #viewChallenge': 'viewChallenge',
            'click .challengeImage': 'viewChallenge'
        },

        initialize: function () {
            if (this.model.get('challenge_description').length > 1000) {
                this.model.set('challenge_description_short', this.model.get('challenge_description').substring(0, 1000) + '...');
            }
            else {
                this.model.set('challenge_description_short', this.model.get('challenge_description'));
            }
            this.model.on('saved', this.render, this);
        },

        edit: function () {
            this.trigger('showModal', FormView);
        },

        deleteChallenge: function () {
            this.trigger('showModal', DeleteView);
        },

        viewChallenge: function () {
            window.location = '#challenge/' + this.model.get('id');
        }
    });

    return ChallengeItemView;
});

