/**
 * Skill
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

    attributes: {
        name:{
            type: 'string',
            required: false
        },
        state:{
            type: 'string',
            required: false
        },
        school_type: {
            type: 'integer',
            requred: true
        },
        sector:{
            type: 'string',
            required: false
        },
        duration:{
            type: 'string',
            required: false
        },
        alias:{
            type: 'string',
            required: false
        }
    }

};
