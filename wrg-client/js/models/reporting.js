define(['backbone'], function(Backbone) {

    var CollegeReporting = Backbone.Model.extend({

        initialize: function(attrs, options) {
            this.reqres = options.reqres;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/reporting/me'
        }
    });

    return CollegeReporting;
});