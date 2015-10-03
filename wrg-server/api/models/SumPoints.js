'use strict';
module.exports = {

    attributes : {

        category_id : {
            type : 'integer',
            required : true
        },

        student_id : {
            type : 'integer',
            required : true
        },

        points : {
            type : 'integer',
            required : true
        },

        toJSON: function() {
            var obj = this.toObject();
            //delete obj.password;

            return obj;
        }
    }
};
