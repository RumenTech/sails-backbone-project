define(['backbone'], function (Backbone) {

    var AdminEmail = Backbone.Model.extend({

        initialize: function (attributes, options) {
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.session = this.reqres.request('session');
        },

        parse: function (response) {
            return response;
        },

        url: function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/admin/massemail';
        },

        validate: function (attrs) {
            if (!attrs.type) {
                return 'You need to choose receivers first';
            }
            if (!attrs.content) {
                return 'You need to enter email content';
            }
        }
    });

    return AdminEmail;
});