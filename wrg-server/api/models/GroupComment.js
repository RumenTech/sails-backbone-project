"use strict";

module.exports = {

    attributes:{

        post_id:{
            type:'integer',
            required:true
        },

        user_id:{
            type:'integer',
            required:true
        },

        content:{
            type:'text',
            required:true
        }
    }

};
