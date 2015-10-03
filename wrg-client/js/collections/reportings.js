define([
    'backbone',
    'models/reporting'
], function(Backbone, Candidate) {

    var ReportingCollection = Backbone.Collection.extend({
        model: Candidate,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },

        fetching : function(){
            this.fetch({
                success: _.bind(function() {
                    this.trigger('loaded');
                }, this)
            });
        },

        parse: function(response) {
            return response;
        },

        url:function(){
            var config = this.reqres.request('config');
            return config.restUrl + '/reporting/allAlumnus' ;
        }
    });

    return ReportingCollection;
});
