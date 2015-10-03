/**
 * Created by semir.sabic on 23.4.2014.
 */
define([
    'backbone',
    'models/careerpath/careerpath_vote'
], function(Backbone, CareerPathVote) {

    var CareerPathVotesCollection = Backbone.Collection.extend({
        model: CareerPathVote,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.fetch({
                data: $.param({ resId: attributes}),
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

        url:function(){
            var config = this.reqres.request('config');
            return  config.restUrl + '/careerpathresourcevote/getvotes'
        }
    });

    return CareerPathVotesCollection;
});
