define(['backbone'], function (Backbone) {

    var Challenge = Backbone.Model.extend({

        initialize:function (attributes, options) {
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.session = this.reqres.request('session');
        },

        parse:function (response) {
            return response;
        },

        urlRoot:function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/challenge';
        },

        validate:function (attrs, options) {
            if (!attrs.challenge_title) {
                $('.save-button').attr("disabled", false);
                return 'Challenge Title is a required field';
            }

            if(!attrs.challenge_title.length > 100 ){
                $('.save-button').removeAttr("disabled");
                return 'Challenge Title must be 100 characters or fewer.';
            }

            if (!attrs.contact_name) {
                $('.save-button').attr("disabled", false);
                return 'Contact name is a required field.';
            }

            if(!attrs.contact_name.length > 10 ){
                $('.save-button').removeAttr("disabled");
                return 'Contact name must be 100 characters or fewer.';
            }

            if (!attrs.challenge_description) {
                $('.save-button').attr("disabled", false);
                return 'Challenge description is a required field.';
            }

            if(!attrs.challenge_description.length > 5000 ){
                $('.save-button').removeAttr("disabled");
                return 'Description must be 5000 characters or fewer.';
            }

            if(attrs.expected_deliverable){
                if(!attrs.expected_deliverable.length > 5000 ){
                    $('.save-button').removeAttr("disabled");
                    return 'Expected Deliverable must be 5000 characters or fewer.';
                }
            }

            if (!attrs.location) {
                $('.save-button').attr("disabled", false);
                return 'Location is a required field.';
            }

            if(!attrs.location.length > 100 ){
                $('.save-button').removeAttr("disabled");
                return 'Location must be 100 characters or fewer.';
            }

            if (!attrs.apply_link) {
                $('.save-button').attr("disabled", false);
                return 'Apply link is a required field.';
            }
        }
    });

    return Challenge;
});

