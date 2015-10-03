define(['backbone'], function (Backbone) {

    var Challenge = Backbone.Model.extend({

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
            var config = this.reqres.request('config');
            return config.restUrl  + '/challenge/searchChallenges';
        }
    });

    return Challenge;
});



