/**
 * Created by Mistral on 12/30/13.
 */
define([
    'backbone',
    'models/company/company_event'
], function(Backbone, Event) {

    var CompanyEventsCollection = Backbone.Collection.extend({
        model: Event,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },
        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/companyevent';
        }
    });

    return CompanyEventsCollection;
});