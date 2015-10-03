"use strict";

module.exports = {

    attributes:{
        group_id:{
            type:'integer',
            required:true
        },

        user_id:{
            type:'integer',
            required:true
        },

        role:{
            type:'string'
        },

        status:{
            type:'string'
        }
    }
};
