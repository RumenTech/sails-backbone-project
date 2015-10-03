module.exports = {

    attributes: {
        title:{
            type: 'string',
            required: true
        },
        organization:{
            type: 'string',
            required: true
        },
        start_date:{
            type: 'date',
            required: true
        },
        end_date:{
            type: 'string',
            required: true
        },
        description:{
            type: 'text'/*,
             required: true*/
        },
        reference_name:{
            type: 'string'/*,
             required: true*/
        },
        reference_title:{
            type: 'string'/*,
             required: true*/
        },
        reference_email:{
            type: 'string'/*,
             required: true*/
        },
        alumnistory_id:{
            type: 'int',
            required: true
        },
        present:{
            type: 'BOOLEAN'/*,
             required: false*/
        },
        toJSON: function() {
            var obj = this.toObject();
            //delete obj.password;

            return obj;
        }
    }


};

