define([
    'backbone',
    'models/college/candidate'
], function(Backbone, Candidate) {

    var CandidatesCollection = Backbone.Collection.extend({
        model: Candidate,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },

        url:function(){
            var config = this.reqres.request('config');
            return  config.restUrl + '/candidate'
        }
    });

    return CandidatesCollection;
});
