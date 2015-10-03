//this model only use to sent data to login in login_view.js

define(['backbone'], function(Backbone) {

    var Logout = Backbone.Model.extend({

        initialize: function(attrs, options) {
            this.reqres = options.reqres;
        },

        url: function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/logout';
        }

        
    });

    return Logout;
});