define([
    'marionette',
    'text!templates/portfolio/leaderboard/leader.html',
    'models/portfolio/vote'

], function (Marionette, Template, Vote) {
    'use strict';

    var EventItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .leaderboard-vote-button': 'vote'
        },

        initialize: function () {
        },

        vote: function (e) {
            var vote = new Vote(null, this.model.collection.reqres);
            vote.set('category_id', e.currentTarget.id);
            vote.set('competitor_id', this.model.attributes.student_id);
            vote.save(null, {
                success: _.bind(function () {
                    this.model.collection.fetch({ data: $.param({
                            category: 1
                        }),
                            success: _.bind(function () {
                                $('#internship-leaders').css('text-decoration', 'underline');
                                $('#community-leaders').css('text-decoration', 'none');
                                $('#public-leaders').css('text-decoration', 'none');
                                $('#research-leaders').css('text-decoration', 'none');
                                $('#leadership-leaders').css('text-decoration', 'none');
                                $('#innovation-leaders').css('text-decoration', 'none');
                                $('#industry-leaders').css('text-decoration', 'none');
                                $('#grit-leaders').css('text-decoration', 'none');
                            }, this)
                        }
                    );
                }, this),
                error: _.bind(function (model, response) {
                }, this)
            });
        }
    });
    return EventItemView;
});