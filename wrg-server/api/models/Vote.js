module.exports = {

    attributes: {
        voter_id:{
            type:'INTEGER',
            required:true
        },
        category_id:{
            type:'INTEGER',
            required:true
        },
        competitor_id:{
            type:'INTEGER',
            required:true
        },
        toJSON: function() {
            var obj = this.toObject();
            //delete obj.password;

            return obj;
        }
    }

};
