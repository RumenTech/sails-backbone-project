/**
 * Created by semir.sabic on 16.4.2014.
 */
module.exports = {

    attributes: {
        resource_id:{
            type: 'integer',
            required: true
        },
        user_id:{
            type: 'integer',
            required: true
        },
        vote:{
            type: 'string',
            required: true
        }
    }
};