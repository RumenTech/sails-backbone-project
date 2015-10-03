define(['backbone'], function (Backbone) {

    var BasicInformation = Backbone.Model.extend({

        initialize:function (attributes, options) {
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.id = this.session.id;
        },

        urlRoot:function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/student';
        },

        validate:function (attrs, options) {
//            if (!attrs.first_name) {
//                return 'First name is a required field.';
//            }
//            if (!attrs.first_name.length > 50) {
//                return 'First name must be 50 characters or fewer.';
//            }
//            if (attrs.first_name.indexOf("/") > -1 || attrs.first_name.indexOf("\\") > -1) {
//                return 'First name cannot contain the symbol / or \\';
//            }
//
//            if (!attrs.last_name) {
//                return 'Last name is a required field.';
//            }
//            if (!attrs.last_name.length > 50) {
//                return 'Last name must be 50 characters or fewer.';
//            }
//            if (attrs.last_name.indexOf("/") > -1 || attrs.last_name.indexOf("\\") > -1) {
//                return 'First name cannot contain the symbol / or \\';
//            }
//
//            if (attrs.major) {
//                if (attrs.major.length > 50) {
//                    return 'Major must be 50 characters or fewer.';
//                }
//            }
//            if (attrs.gpa !== null && attrs.gpa !== undefined) {
//
//                if(parseFloat(attrs.gpa) > 5.0 || parseFloat(attrs.gpa) < 0) {
//                    return 'GPA is not in valid range';
//                }
//            }
//            if (attrs.tagline) {
//                if (attrs.tagline.length > 50) {
//                    return 'Tagline must be 50 characters or fewer';
//                }
//                if (attrs.tagline.indexOf("/") > -1 || attrs.tagline.indexOf("\\") > -1) {
//                    return 'Tagline cannot contain the symbol / or \\';
//                }
//            }

        }
    });

    return BasicInformation;
});