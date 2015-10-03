define(['backbone'], function(Backbone) {

    var AdminUser = Backbone.Model.extend({

        initialize: function(options) {
            this.reqres = options.reqres;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/dbparser/detailview';
        }
    });

    return AdminUser;
});