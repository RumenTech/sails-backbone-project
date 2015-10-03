/**
 * Created by Mistral on 1/22/14.
 */

/**
 * Created by Mistral on 1/21/14.
 */
/**
 * Created by Mistral on 12/30/13.
 */
define([
    'backbone',
    'models/portfolio/job'
], function(Backbone, Job) {

    var JobsCollection = Backbone.Collection.extend({
        model: Job,

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
            return config.restUrl + '/student/searchJobs';
        }
    });

    return JobsCollection;
});
