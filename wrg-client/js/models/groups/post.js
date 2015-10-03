/**
 * Created by Mistral on 2/24/14.
 */
/**
 * Created by Mistral on 2/19/14.
 */
define(['backbone'], function(Backbone) {

    var GroupPost = Backbone.Model.extend({

        initialize: function(attributes, options) {
            this.reqres = options.reqres;
          //  this.config = this.reqres.request('config');
          //  this.session = this.reqres.request('session');
        },

        parse: function(response) {
            return response;
        },

        url: function() {
            if(this.reqres){
            var config = this.reqres.request('config');
            }
            else{
            var config = this.collection.reqres.request('config');
            }
            return config.restUrl  + '/grouppost';
        }
    });

    return GroupPost;
});


