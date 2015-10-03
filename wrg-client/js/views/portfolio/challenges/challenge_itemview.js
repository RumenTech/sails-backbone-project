/**
 * Created by Mistral on 1/22/14.
 */
define([
    'marionette',
    'text!templates/portfolio/challenges/challenge.html',
    'models/portfolio/challenge'

], function (Marionette, Template, Challenge) {
    'use strict';

    var EventItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #viewChallenge': 'viewChallenge'
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

        viewChallenge: function () {
            window.location = '#challenge_student/' + this.model.get('id');
        }
    });
    return EventItemView;
});


