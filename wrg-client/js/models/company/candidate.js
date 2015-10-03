define(['backbone'], function(Backbone) {

    var Candidate = Backbone.Model.extend({

        initialize: function(attributes,params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },

        parse: function(response) {
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return  config.restUrl+'/companycandidates'
        },

        validate: function(attrs, options){
            if(!attrs.department){
                $('.save-button').attr("disabled", false);
                return 'Department is a required field.';
            }
            if(!attrs.position){
                $('.save-button').attr("disabled", false);
                return 'Position is a required field.';
            }
            if(!attrs.description){
                $('.save-button').attr("disabled", false);
                return 'Qualification is a required field.';
            }
            if(!attrs.preffereddescription){
                $('.save-button').attr("disabled", false);
                return 'Preferred Qualification is a required field.';
            }

        }
    });

    return Candidate;
});