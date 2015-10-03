define(['backbone'], function (Backbone) {

    var RegistrationModel = Backbone.Model.extend({

        initialize: function (attrs, options) {
            this.reqres = options.reqres;
        },

        url: function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/user/changePassword';
        },

        validate: function (attrs, options) {


            // first_name


// password
            if (!attrs.oldPassword) {
                $('.save-button-password').removeAttr("disabled");
                return 'Old password is a required field.';

            }
            if (!attrs.password) {
                $('.save-button-password').removeAttr("disabled");
                return 'Password is a required field.';

            }
            if (attrs.password.length < 8 || attrs.password.length > 50) {
                $('.save-button-password').removeAttr("disabled");
                return 'Password must be 8 to 50 characters in length.';

            }

            if (attrs.repeatPassword !== attrs.password) {
                $('.save-button-password').removeAttr("disabled");
                return 'Both Passwords must be the same.';

            }
        }

        });

    return RegistrationModel;
});