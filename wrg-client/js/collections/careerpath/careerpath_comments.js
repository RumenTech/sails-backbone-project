/**
 * Created by semir.sabic on 20.4.2014.
 */
define([
    'backbone',
    'models/careerpath/careerpath_comment'
], function(Backbone, CareerPathComment) {

    var CareerPathCommentsCollection = Backbone.Collection.extend({
        model: CareerPathComment,

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
            return  config.restUrl + '/careerpathresourcecomment/getcomments'
        }
    });

    return CareerPathCommentsCollection;
});
