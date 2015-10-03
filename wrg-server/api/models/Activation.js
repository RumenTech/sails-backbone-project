/**
 * Activator
 *
 * @module      :: Model
 * @description :: Link to store Accounts that require activation.
 * Initial implementation
 * Will probably need few after/before methods in here
 *
 */

"use strict";


module.exports = {
    attributes: {
        hash:{
            type: 'string',
            required: true
        },
        user_id:{
            type: 'string',
            required: true
        }
    }
};
