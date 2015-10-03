'use strict';
module.exports = {

    attributes : {

        company_id : {
            type : 'integer',
            required : true
        },

        company : {
            type : 'string'
        },

        name : {
            type : 'string'
        },

        school : {
            type : 'string'
        },

        major : {
            type : 'string'
        },

        gpa : {
            type : 'float'
        },

        job_title : {
            type : 'string'
        },

        experiences : {
            type : 'string'
        },

        talent_skill : {
            type : 'string'
        },

        criteria_name : {
            type : 'string'
        },

        toJSON: function() {
            var obj = this.toObject();
            //delete obj.password;

            return obj;
        }
    }
};
