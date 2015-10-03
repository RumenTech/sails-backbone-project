/**
 * Created by semir.sabic on 18.4.2014.
 */
define(['backbone'], function(Backbone) {

    var CareerPathTab = Backbone.Model.extend({

        initialize: function(attributes, options) {
            if (options.reqres) {
                this.reqres = options.reqres;
                this.config = this.reqres.request('config');
                this.session = this.reqres.request('session');
            }
        },

        parse: function(response) {
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/careerpathtab/gettabs';
        }
    });

    return CareerPathTab;
});