define(['backbone'], function(Backbone) {

    var User = Backbone.Model.extend({

        initialize: function(attributes,params) {
            //this.reqres = params.collection.reqres;//params.reqres;
            this.reqres =  params.reqres;

            //this.session = this.reqres.request('session');
        },
        fetch: function(attributes, options) {
            options = _.defaults((options || {}), {url: this.url()});
            return Backbone.Model.prototype.fetch.call(this, attributes, options);
        },
        url: function() {
            var config = this.reqres.request('config');
            return  config.restUrl+'/companyuser'
        },

        validate: function(attrs, options){
        }
    });

    return User;
});