define([
    'backbone',
    'models/company/challenge'
], function(Backbone, Challenge) {

    var ChallengesCollection = Backbone.Collection.extend({
        model: Challenge,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },
        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/challenge';
        }
    });

    return ChallengesCollection;
});