/**
 * Created by semir.sabic on 20.4.2014.
 */
define([
    'backbone',
    'models/careerpath/careerpath_category'
], function(Backbone, CareerPathCategory) {

    var CareerPathCategoriesCollection = Backbone.Collection.extend({
        model: CareerPathCategory,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            if(!params.data){
                this.fetch({
                    data: $.param({ tabId: attributes}),
                    success: _.bind(function(data) {
                        this.trigger('loaded');
                    }, this),
                    error: _.bind(function(err) {
                        this.trigger('error');
                    }, this)
                });
            }
        },

        url:function(){
            var config = this.reqres.request('config');
            return  config.restUrl + '/careerpathtabcategory/getcategories'
        }
    });

    return CareerPathCategoriesCollection;
});