/**
 * Created by semir.sabic on 21.4.2014.
 */
define(['backbone'], function(Backbone) {

    var CareerPathResourceComment = Backbone.Model.extend({

        initialize: function(attributes, options) {
            if(options.model) {
                this.reqres = options.model.collection.reqres;
            } else if(options.collection) {
                this.reqres = options.collection.reqres;
            }else {
                this.reqres = options.reqres;
            }
            this.config = this.reqres.request('config');
            this.session = this.reqres.request('session');

        },

        parse: function(response) {
            return response;
        },

        urlRoot: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/careerpathresourcecomment';
        }
    });

    return CareerPathResourceComment;
});