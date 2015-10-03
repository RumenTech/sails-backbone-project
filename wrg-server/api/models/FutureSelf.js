/**
 * AlumniStory
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

    attributes: {
        user_id: {
            type: 'integer',
            required: true
        },

        category_id: {
            type: 'integer',
            required: true
        },

        points: {
            type: 'integer',
            required: true
        },

        note: {
            type: 'text'
        },

        end_date: {
            type: 'date',
            required: true
        },

        is_message_sent: {
            type: 'boolean',
            required: true
        },

        finished: {
            type: 'boolean',
            defaultsTo: false
        }
    }
};
