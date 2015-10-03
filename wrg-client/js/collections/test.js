/**
 * Created by Mistral on 12/9/13.
 */

define([
    'backbone',
    'models/test'
], function(Backbone, test) {
    var test = Backbone.Collection.extend({
        model: test,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.on('add', _.bind(this.onAdd, this));

        },
        fetching : function(){
            this.fetch({
                success: _.bind(function() {
                    this.trigger('loaded');
                }, this)
            });
        },
        onAdd: function(model) {
            //model.set('user_id', this.session.id);
        },
        parse: function(response) {
            return response.request;
        },
        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/test/sayHello' ;
        }
    });

    return test;

});