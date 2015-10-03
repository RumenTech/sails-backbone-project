/**
 * Created by semir.sabic on 3/13/14.
 */
define(['backbone'], function(Backbone) {

    var ReadOnlyAlumni = Backbone.Model.extend({

        initialize: function(attributes, options) {
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.session = this.reqres.request('session');
            this.fetch({
                data: $.param({ id: attributes}),
                success: _.bind(function(data) {
                    this.trigger('loaded');
                }, this),
                error: _.bind(function(err) {
                    this.trigger('error');
                }, this)
            });
        },

        parse:function (response) {
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/alumnistory/you';
        }
    });

    return ReadOnlyAlumni;
});

