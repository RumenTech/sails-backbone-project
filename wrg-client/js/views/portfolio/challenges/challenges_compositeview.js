define([
    'marionette',
    'text!templates/portfolio/challenges/challenges.html',
    'views/portfolio/challenges/challenge_itemview',
    'collections/portfolio/challenges'
], function (Marionette, Template, ItemView, ChallengesCollection) {
    'use strict';

    var ChallengesCollectionView = Marionette.CompositeView.extend({
        template: Template,
        itemViewContainer: '.company-list.challenge-list',
        itemView: ItemView,

        events: {
            'click #moreChallenges': 'moreChallenges'
        },

        initialize: function (params) {
            this.collection = params.data;
            //Scroll event
            _.bindAll(this, "checkScroll");
            $(window).scroll(this.checkScroll);
        },

        checkScroll: function () {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                this.moreChallenges();
            }
        },

        moreChallenges: function () {
            this.result_length = this.collection.length;
            this.collection.fetch({ data: $.param({
                    challengesearch: $('#challengesearch').val(),
                    location: $('#location').val(),
                    limit: this.collection.length + 10
                }),
                    success: _.bind(function () {
                        if (this.collection.length === this.result_length) {
                            $('#moreChallenges').html('No more challenges found');
                        }
                    }, this)
                }
            );
        }
    });
    return ChallengesCollectionView;
});


