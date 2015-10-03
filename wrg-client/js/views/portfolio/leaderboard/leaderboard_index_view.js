define([
    'marionette',
    'text!templates/portfolio/leaderboard/leaderboard_index.html',
    'regions/modal_region',
    'views/portfolio/leaderboard/leaders_compositeview',
    'views/portfolio/challenges/filter_form_view',
    'collections/portfolio/leaders',
    'views/messages/sponsors_view'
], function (Marionette, Template, ModalRegion, LeaderboardCompositeView, FilterFormView, LeadersCollection, SponsorsView) {
    'use strict';

    var LeaderboardIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            leaders: '#leaderboard',
            sponsors: '#sponsors-section'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;

            this.leadersCollection = new LeadersCollection(null, {reqres: this.reqres});
            this.leadersCollection.on('loaded', this.render, this);
            this.config = this.reqres.request('config');
            this.listenTo(this.leadersCollection, 'loaded', this.onLoaded, this);

            var config = this.reqres.request('config');
            $("#pageloader").fadeIn(config.spinnerTimeout).delay(config.spinnerTimeout).fadeOut(config.spinnerTimeout);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            this.leaders.show(new LeaderboardCompositeView({
                reqres: this.reqres,
                data: this.leadersCollection
            }));
            this.sponsors.show(new SponsorsView());
        },

        onFilter: function (view, model) {
            this.challenges.reset();
            this.challenges.fetch({ data: $.param({
                challengesearch: model.get('challengesearch'),
                location: model.get('location')})
            });

            this.challengesPosted.close();
            this.challengesPosted.show(new ChallengesCompositeView({
                reqres: this.reqres,
                data: this.challenges
            }));
        }
    });
    return LeaderboardIndexView;
});

