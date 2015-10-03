define(['backbone'], function(Backbone){

    var CriteriaSearch = Backbone.Model.extend({

        initialize: function(attributes, options) {
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.session = this.reqres.request('session');
        },

        parse: function(response) {
            return response;
        },

        onLoad:function(){
            this.trigger('loaded');
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/criteriasearch';
        }
    });

    return CriteriaSearch;
});