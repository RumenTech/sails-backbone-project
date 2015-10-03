/**
 * Created by Mistral on 1/21/14.
 */
/**
 * Created by Mistral on 12/30/13.
 */
define(['backbone'], function (Backbone) {

    var Job = Backbone.Model.extend({

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
            return config.restUrl + '/job';
        },

        validate:function (attrs, options) {
            if (!attrs.job_title) {
                $('.save-button').attr("disabled", false);
                return 'Job Title is a required field';
            }

            if(!attrs.job_title.length > 100 ){
                $('.save-button').removeAttr("disabled");
                return 'Job Title must be 100 characters or fewer.';
            }

            if (!attrs.contact_name) {
                $('.save-button').attr("disabled", false);
                return 'Contact name is a required field.';
            }

            if(!attrs.contact_name.length > 10 ){
                $('.save-button').removeAttr("disabled");
                return 'Contact name must be 100 characters or fewer.';
            }

            if (!attrs.job_description) {
                $('.save-button').attr("disabled", false);
                return 'Job description is a required field.';
            }

            if(!attrs.job_description.length > 5000 ){
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

    return Job;
});

