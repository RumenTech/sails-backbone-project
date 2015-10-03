//this model only use to sent data to login in login_view.js

define(['backbone'], function (Backbone) {

    var Login = Backbone.Model.extend({


        initialize: function (attrs, options) {
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.restUrl = this.config.restUrl;
        },

        url: function () {
            return this.restUrl + '/auth/process';
        },

        validate: function (attrs, options) {
            if (!attrs.username) {
                this.spinnerControl();
                return "Username is a required field";
            }
            if (attrs.username !== this.config.admin.username) {
                if (!attrs.username.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/)) {
                    this.spinnerControl();
                    return 'Username is not valid email';
                }
            }

            if (!attrs.password) {
                this.spinnerControl();
                return "Password is a required field";
            }
        },

        spinnerControl: function () {

            $("#pageloader").fadeIn(800).delay(500).fadeOut(800);

        }

    });

    return Login;
});