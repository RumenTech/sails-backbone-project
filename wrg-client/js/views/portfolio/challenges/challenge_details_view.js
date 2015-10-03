/**
 * Created by semir.sabic on 3/11/14.
 */
define([
    'marionette',
    'text!templates/portfolio/challenges/challenge_details.html',
    'models/company/challenge_details',
    'lib/backbone.modelbinder',
    'views/messages/sponsors_view'
], function (Marionette, Template, Model, ModelBinder, SponsorsView) {
    'use strict';

    var ChallengeDetailsView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click #backToChallenges': 'backToChallenges'
        },

        regions: {
            sponsors: '#sponsors-section'
        },

        initialize: function (options) {
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.modelBinder = new ModelBinder();
            var challengeId = document.location.href.split('/')[document.location.href.split('/').length - 1];
            this.model = new Model(challengeId, options);

            this.model.on('loaded', this.render, this);
            this.listenTo(this.model, 'error', this.onErrorMethod, this);
        },

        onRender: function () {
            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('body').css('visibility', 'visible');
            this.sponsors.show(new SponsorsView());
        },

        onErrorMethod: function () {
            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('#error').css('display', 'block');
        },

        backToChallenges: function () {
            window.location = '#challenges_student';
        }
    });
    return ChallengeDetailsView;
});
