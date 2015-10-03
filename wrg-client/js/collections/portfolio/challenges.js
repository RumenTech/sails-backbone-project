define([
    'backbone',
    'models/portfolio/challenge'
], function(Backbone, Challenge) {

    var ChallengesCollection = Backbone.Collection.extend({
        model: Challenge,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');


            this.fetch({
                success: _.bind(function() {
                    this.trigger('loaded');
                }, this)
            });

        },

        parse: function(response) {
            return response.request;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/student/searchChallenges';
        }
    });

    return ChallengesCollection;
});
