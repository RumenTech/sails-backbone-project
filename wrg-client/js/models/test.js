/**
 * Created by Mistral on 12/9/13.
 */
define(['backbone'], function(Backbone) {

    var test = Backbone.Model.extend({

        initialize: function(attributes,options) {
            this.reqres = options.reqres;
        },
        fetch:function(){
            this.trigger('fetch');
        },
        onLoad:function(){
            this.trigger('load');
        }
        ,
        url: function() {
            var suffix;
            if (this.get('id')) {
                // Editing an existing connection.
                suffix = '/' + this.get('id') + '.json';
            } else {
                // Adding a new connection.
                suffix = '.json'
            }
            //return 'http://192.168.0.17:1337/rest/connections' + suffix;
            //return 'http://192.168.0.17:1337/connection';
            var config = this.reqres.request('config');
            return config.restUrl  + '/test/sayHello';
        }
    });

    return test;
});
