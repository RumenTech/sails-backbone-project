define(['backbone'], function(Backbone) {

    var Experience = Backbone.Model.extend({

        initialize: function(attributes,params) {
            this.reqres = params.collection.reqres;

            this.session = this.reqres.request('session');
            if (this.get('start_date')) {
                var startDateArray = this.get('start_date').split('-');
                this.set('start_year', startDateArray[0]);
                this.set('start_month', startDateArray[1]);
            }

            if (this.get('end_date')) {
                var endDateArray = this.get('end_date').split('-');
                this.set('end_year', endDateArray[0]);
                this.set('end_month', endDateArray[1]);
            }
        },

        parse: function(response) {
            return response;
        },
        urlRoot:function()
        {
            var config = this.reqres.request('config');
            return config.restUrl+'/professionalexperience'
        },

        validate: function(attrs, options){
            if(!attrs.title){
                $('.save-button').removeAttr("disabled");
                return 'Title is a required field.';
            }
            if(!attrs.title.length > 50 ){
                $('.save-button').removeAttr("disabled");
                return 'Title must be 50 characters or fewer.';
            }
            if(attrs.title.indexOf("/") > -1 || attrs.title.indexOf("\\") > -1) {
                $('.save-button').removeAttr("disabled");
                return 'Title name cannot contain the symbol / or \\';
            }

            // 	organization: 'BMW',

            if(!attrs.organization){
                $('.save-button').removeAttr("disabled");
                return 'Organization is a required field.';
            }
            if(!attrs.organization.length > 50 ){
                $('.save-button').removeAttr("disabled");
                return 'Organization must be 50 characters or fewer.';
            }
            if(attrs.organization.indexOf("/") > -1 || attrs.organization.indexOf("\\") > -1) {
                $('.save-button').removeAttr("disabled");
                return 'Organization name cannot contain the symbol / or \\';
            }

            if(attrs.start_month == 0 || attrs.start_month === 'undefined'){
                $('.save-button').removeAttr("disabled");
                return 'Select a start month.';
            }
            if(attrs.start_year == 0 || attrs.start_year === 'undefined' ){
                $('.save-button').removeAttr("disabled");
                return 'Select a start year.';
            }
            if(attrs.end_month == 0 || attrs.end_month  === 'undefined'){
                $('.save-button').removeAttr("disabled");
                return 'Select a end month.';
            }
            if(attrs.end_year == 0 || attrs.end_year  === 'undefined'){
                $('.save-button').removeAttr("disabled");
                return 'Select a end year.';
            }

            if (new Date(attrs.start_year,attrs.start_month,1) > new Date(attrs.end_year,attrs.end_month,1)){
                $('.save-button').removeAttr("disabled");
                return 'The start date can´t be greater than the end date.';
            }

            if(!attrs.description){
                $('.save-button').removeAttr("disabled");
                return 'Description is a required field.';
            }
            if(!attrs.description.length > 250 ){
                $('.save-button').removeAttr("disabled");
                return 'Description must be 250 characters or fewer.';
            }
            if(attrs.description.indexOf("/") > -1 || attrs.description.indexOf("\\") > -1) {
                $('.save-button').removeAttr("disabled");
                return 'Description name cannot contain the symbol / or \\';
            }
            // 	referenceName: 'Henry Ford',
            /*if(!attrs.reference_name){
                $('.save-button').removeAttr("disabled");
                return 'Reference Name is a required field.';
            }
            if(!attrs.reference_name.length > 30 ){
                $('.save-button').removeAttr("disabled");
                return 'Reference Name must be 30 characters or fewer.';
            }
            if(attrs.reference_name.indexOf("/") > -1 || attrs.reference_name.indexOf("\\") > -1) {
                $('.save-button').removeAttr("disabled");
                return 'Reference name cannot contain the symbol / or \\';
            }
            // 	referenceTitle: 'President, Ford Motor Company',
            if(!attrs.reference_title){
                $('.save-button').removeAttr("disabled");
                return 'Reference Title is a required field.';
            }
            if(!attrs.reference_title.length > 50 ){
                $('.save-button').removeAttr("disabled");
                return 'Reference Title must be 50 characters or fewer.';
            }
            if(attrs.reference_title.indexOf("/") > -1 || attrs.reference_title.indexOf("\\") > -1) {
                $('.save-button').removeAttr("disabled");
                return 'Reference title cannot contain the symbol / or \\';
            }*/

            // 	referenceEmail: 'henry@ford.com',
           /* if(!attrs.reference_email){
             $('.save-button').removeAttr("disabled");
             return 'Reference Email is a required field.';
             }
             if(!attrs.reference_email.length > 50 ){
             $('.save-button').removeAttr("disabled");
             return 'Reference Email must be 50 characters or fewer.';
             }

             if (attrs.mediaErrors){
             if( attrs.mediaErrors !='' ){
             return attrs.mediaErrors;
             }
             }

             if(!attrs.reference_email.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/)) {
             $('.save-button').removeAttr("disabled");
             return 'Reference Email is not valid email';
             }*/
        }
    });

    return Experience;
});