/**
 * Award
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

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
        student_id :{
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
