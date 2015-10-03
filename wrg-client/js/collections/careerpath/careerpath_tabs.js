/**
 * Created by semir.sabic on 18.4.2014.
 */
define([
    'backbone',
    'models/careerpath/careerpath_tab'
], function(Backbone, CareerPathTab) {

    var CareerPathTabsCollection = Backbone.Collection.extend({
        model: CareerPathTab,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.fetch({
                success: _.bind(function(data) {
                    var message = data.models[0].attributes.message;
                    if (message === 'User does not have college set') {
                        this.trigger('no college');
                    } else {
                        this.trigger('loaded');
                    }
                }, this),
                error: _.bind(function(err) {
                    this.trigger('error');
                }, this)
            });
        },

        url:function(){
            var config = this.reqres.request('config');
            return  config.restUrl + '/careerpathtab/getFullTabs';
        }
    });

    return CareerPathTabsCollection;
});