define(['backbone'], function (Backbone) {

    var RegistrationModel = Backbone.Model.extend({

        initialize: function (attrs, options) {
            this.reqres = options.reqres;
        },

        url: function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/user/new_' + this.get('role');
        },

        validate: function (attrs, options) {

            if (attrs.role === 'college' || attrs.role === 'student' || attrs.role === 'company' || attrs.role === 'alumni') {

                if (attrs.role !== 'college') {
                    // first_name
                    if (attrs.first_name.length > 50) {
                        return 'First name must be 50 characters or fewer.';
                    }
                    if (!attrs.first_name.match(/^[a-z, A-Z, -]+$/)) {
                        return 'First name may only contain letters.';
                    }

                    // last_name
                    if (attrs.last_name.length > 50) {
                        return 'Last name must be 50 characters or fewer.';
                    }
                    if (!attrs.last_name.match(/^[a-z, A-Z, -]+$/)) {
                        return 'Last name may only contain letters.';
                    }

                    if (attrs.role === 'company') {
                        if (!attrs.company_name) {
                            return 'Company name is a required field.';
                        }
                    }

                    // 	referenceTitle: 'President, Ford Motor Company',
                    if (attrs.role === 'student') {
                    }

                    if (attrs.role === 'alumni') {
                    }
                } else {
                    //this is college case
                    if (!attrs.name) {
                        return 'College name is a required field.';
                    }
                }
                //Common property check
                // email
                if (!attrs.email) {
                    return 'Email address name is a required field.';
                }
                if (attrs.email.length > 50) {
                    return 'Email address must be 50 characters or fewer.';
                }
                if (!attrs.email.match(/@/)) {
                    return 'Please enter a valid email address. Example: john@example.com';
                }

                // password
                if (!attrs.password) {
                    return 'Password is a required field.';
                }
                if (attrs.password.length < 8 || attrs.password.length > 50) {
                    return 'Password must be 8 to 50 characters in length.';
                }

                if (attrs.repeatPassword !== attrs.password){
                    return 'Both Passwords must be the same.';
                }


            }
        }
    });

    return RegistrationModel;
});