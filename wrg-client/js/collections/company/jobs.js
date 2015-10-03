/**
 * Created by Mistral on 12/30/13.
 */
define([
    'backbone',
    'models/company/job'
], function(Backbone, Job) {

    var JobsCollection = Backbone.Collection.extend({
        model: Job,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },
        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/job';
        }
    });

    return JobsCollection;
});