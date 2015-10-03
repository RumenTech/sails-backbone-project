define([
    'backbone',
    'models/portfolio/future_self'
], function(Backbone, Challenge) {

    var FutureSelfCollection = Backbone.Collection.extend({
        model: Challenge,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');

            this.fetch({
                data: $.param({ id: attributes}),
                success: _.bind(function() {
                    this.trigger('loaded');
                }, this)
            });

        },

        parse: function(response) {
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/futureself/getFutureSelf';
        }
    });

    return FutureSelfCollection;
});
