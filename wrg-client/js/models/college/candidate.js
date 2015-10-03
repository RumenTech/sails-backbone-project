define(['backbone'], function(Backbone) {

    var Candidate = Backbone.Model.extend({

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },

        parse: function(response) {
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/collegecandidates';
        },

        validate: function(attrs, options){
            if(!attrs.field) {
                return 'Desired degree is a required field.';
            }
            if(!attrs.description) {
                return 'Qualifications are required.';
            }
        }
    });

    return Candidate;
});