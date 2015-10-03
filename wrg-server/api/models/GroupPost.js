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

        content:{
            type:'text',
            required:true
        },

        img_url:{
            type:'string'
        },

        video_url:{
            type:'string'
        }
    }

};
