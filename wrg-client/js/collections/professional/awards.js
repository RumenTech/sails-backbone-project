define([
    'backbone',
    'models/professional/award'
], function(Backbone, Experience) {

    var AwardsCollection = Backbone.Collection.extend({
        model: Experience,

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
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/professionalaward/findAwards';
        }
    });

    return AwardsCollection;
});


