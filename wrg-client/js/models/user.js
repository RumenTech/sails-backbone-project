define(['backbone'], function(Backbone) {

    var User = Backbone.Model.extend({

        initialize: function(attributes,params) {
            this.reqres = params.reqres;
        },
        fetch: function(attributes, options) {
            options = _.defaults((options || {}), {url: this.url()});
            return Backbone.Model.prototype.fetch.call(this, attributes, options);
        },
        url: function() {
            var config = this.reqres.request('config');
            return  config.restUrl+'/user'
        },

        validate: function(attrs, options){
        }
    });

    return User;
});