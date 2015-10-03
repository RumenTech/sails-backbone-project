'use strict';

module.exports = {

    attributes: {

        name : {
            type: 'STRING'
        },

        company_id: {
            type: 'INTEGER',
            required: true
        },

        media_url : {
            type: 'TEXT'
        },

        type: {
            type: 'text'
        },

        photo_caption : {
            type: 'TEXT'
        },

        video_caption : {
            type: 'TEXT'
        }
    }
};
