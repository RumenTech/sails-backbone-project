define([
    'backbone',
    'models/college/college_event'
], function(Backbone, Event) {

    var CollegeEventsCollection = Backbone.Collection.extend({
        model: Event,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },
        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/collegeevent';
        }
    });

    return CollegeEventsCollection;
});
