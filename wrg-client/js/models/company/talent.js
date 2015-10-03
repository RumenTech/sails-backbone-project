define(['backbone'], function(Backbone) {

    var friend = Backbone.Model.extend({

        initialize: function(attributes, options) {
            this.reqres = options.reqres;
        },

        fetch:function(){
            this.trigger('fetch');
        },

        onLoad:function(){
            this.trigger('load');
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/talent/friends';
        }
    });

    return friend;
});
