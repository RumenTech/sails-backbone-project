/**
 * Connection
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

    attributes: {
        user_id:{
            type: 'integer',
            required: true
        },
        request_user_id:{
            type: 'integer',
            required: true
        },
        confirmation:{
            type: 'integer',
            required: true
        }
    }

};
