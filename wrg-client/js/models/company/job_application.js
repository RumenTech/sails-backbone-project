define(['backbone'], function(Backbone) {

    var JobApplication = Backbone.Model.extend({

        initialize: function(options, params) {
            this.reqres = params.reqres;

        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/jobapplication';
        },

        validate:function (attrs) {
            if (!attrs.cover_letter) {
                return 'Cover letter is required';
            }
        }
    });

    return JobApplication;
});