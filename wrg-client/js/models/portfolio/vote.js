define(['backbone'], function (Backbone) {

    var Vote = Backbone.Model.extend({

        initialize: function(attributes,reqres) {
            this.reqres = reqres;

        },

        urlRoot: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/vote';
        }
    });

    return Vote;
});