define([
    'backbone',
    'models/company/criteria_search'
], function(Backbone, CriteriaSearch) {

    var CriteriasSearchCollection = Backbone.Collection.extend({

        model: CriteriaSearch,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },

        onLoad:function(){

        },

        url:function(){
            var config = this.reqres.request('config');
            return  config.restUrl + '/criteriasearch'
        }
    });

    return CriteriasSearchCollection;
});