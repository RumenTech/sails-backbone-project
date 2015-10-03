define([
    'backbone',
    'models/portfolio/privacy_settings'
], function(Backbone, Privacy) {

    var PrivacySettingsCollection = Backbone.Collection.extend({
        model: Privacy,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.config = this.reqres.request('config');
            var that = this;
            this.fetch({
                type: 'GET',
                url: that.config.restUrl + '/privacy/getPrivacySettings',
                dataType: 'json',
                success: _.bind(function(data) {
                    this.trigger('loaded');
                }, this),
                error: _.bind(function(err) {
                    this.trigger('error');
                }, this)
            });

        },

        parse: function(response) {
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/privacy';
        }
    });

    return PrivacySettingsCollection;
});
