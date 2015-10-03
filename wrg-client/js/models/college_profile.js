/**
 * Created by semir.sabic on 3/20/14.
 */
define(['backbone'], function(Backbone) {

    var CollegeProfile = Backbone.Model.extend({

        initialize: function(collegeId, options) {
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.session = this.reqres.request('session');
            this.fetch({
                data: $.param({ id: collegeId}),
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
            return config.restUrl + '/college/getbyid';
        }
    });

    return CollegeProfile;
});