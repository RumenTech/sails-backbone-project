module.exports = {

    attributes: {
        title:{
            type: 'string',
            required: true
        },
        presentor:{
            type: 'string'
        },
        date:{
            type: 'date'
        },
        description:{
            type: 'text'
        },
        alumnistory_id :{
            type: 'int',
            required: true
        },
        toJSON: function() {
            var obj = this.toObject();
            //delete obj.password;

            return obj;
        }
    }

};
