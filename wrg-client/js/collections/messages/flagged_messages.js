define([
    'backbone',
    'models/message'
], function(Backbone, StudentMessage) {

    var FlaggedMessagesCollection = Backbone.Collection.extend({
        model: StudentMessage,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.fetch({
                success: _.bind(function(data) {
                    this.trigger('loaded');
                }, this)
            });
        },

        parse: function(response) {
            return response.request;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/message/findFlaggedMessages';
        }
    });

    return FlaggedMessagesCollection;
});



