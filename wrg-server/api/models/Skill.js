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
            required: true
        },
        proficiency_level:{
            type: 'integer',
            required: true
        },
        student_id:{
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
