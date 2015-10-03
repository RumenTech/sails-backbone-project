define(['backbone'], function (Backbone) {

    var Privacy = Backbone.Model.extend({

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
            var config = this.reqres.request('config');
            return config.restUrl  + '/privacy';
        }
    });

    return Privacy;
});


