"use strict";

module.exports = {

    attributes:{

        name: {
            type: 'string',
            required: true
        },

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

        date: {
            type: 'date',
            required: true
        },
        start: {
            type: 'string',
            required: true
        },
        end: {
            type: 'string',
            required: true
        },
        location: {
            type: 'string',
            required: true
        },

        img_url:{
            type:'string'
        },

        video_url:{
            type:'string'
        },

        facebook_url:{
            type: 'STRING'
        }

    },


    getDateFormat : function (date) {
        var month = date.getUTCMonth() + 1,
            day = date.getUTCDate(),
            year = date.getUTCFullYear();
        return  month + '/' + day + '/' + year;
    }

};
