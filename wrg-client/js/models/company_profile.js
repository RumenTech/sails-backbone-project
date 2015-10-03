/**
 * Created by semir.sabic on 3/18/14.
 */
define(['backbone'], function(Backbone) {

    var CompanyProfile = Backbone.Model.extend({

        initialize: function(companyId, options) {
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.session = this.reqres.request('session');
            this.fetch({
                data: $.param({ id: companyId}),
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
            return config.restUrl + '/company/getbyid';
        }
    });

    return CompanyProfile;
});
