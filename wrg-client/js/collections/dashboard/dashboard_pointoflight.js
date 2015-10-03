define([
    'backbone',
    'models/dashboard/dashboard'
], function (Backbone, Event) {

    var PointsOfLightCollection = Backbone.Collection.extend({
        model: Event,

        initialize: function (attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },

        url: function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/dashboard/moocs';
        }
    });

    return PointsOfLightCollection;
});