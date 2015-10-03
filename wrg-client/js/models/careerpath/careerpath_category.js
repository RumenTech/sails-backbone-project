/**
 * Created by semir.sabic on 20.4.2014.
 */
define(['backbone'], function(Backbone) {

    var CareerPathCategory = Backbone.Model.extend({

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

        rootUrl: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/careerpathtabcategory/getcategories';
        }
    });

    return CareerPathCategory;
});