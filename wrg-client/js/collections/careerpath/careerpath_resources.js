/**
 * Created by semir.sabic on 21.4.2014.
 */
define([
    'backbone',
    'models/careerpath/careerpath_category'
], function(Backbone, CareerPathCategory) {

    var CareerPathResourcesCollection = Backbone.Collection.extend({
        model: CareerPathCategory,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.fetch({
                data: $.param({ catId: attributes}),
                success: _.bind(function(data) {
                    this.trigger('loaded');
                }, this),
                error: _.bind(function(err) {
                    this.trigger('error');
                }, this)
            });
        },

        url:function(){
            var config = this.reqres.request('config');
            return  config.restUrl + '/careerpathresource/getResources'
        }
    });

    return CareerPathResourcesCollection;
});