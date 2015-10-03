'use strict';
module.exports = {

    attributes : {

        category_id : {
            type : 'integer',
            required : true
        },

        competitor_id : {
            type : 'integer',
            required : true
        },

        votes : {
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
