define([
    'backbone',
    'models/company/applicant'
], function(Backbone, Applicant) {

    var ApplicantsCollection = Backbone.Collection.extend({
        model:Applicant,

        initialize:function (attributes, options) {
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.session = this.reqres.request('session');
            this.fetch({
                data: $.param({ jobId: attributes}),
                success: _.bind(function(data) {
                    this.trigger('loaded');
                }, this),
                error: _.bind(function(err) {
                    this.trigger('error');
                }, this)
            });
        },

        parse:function (response) {
            return response.request;
        },

        url:function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/jobapplication/findApplicants';
        }
    });

    return ApplicantsCollection;
});


