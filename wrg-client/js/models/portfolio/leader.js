define(['backbone'], function(Backbone) {

    var Leader = Backbone.Model.extend({

        initialize: function(attributes,params) {
            this.reqres = params.collection.reqres;

            this.session = this.reqres.request('session');

        }




    });

    return Leader;
});