module.exports = {

    attributes:{

        /* e.g.
         nickname: 'string'
         */

        name:{
            type:'STRING'
        },

        type:{
            type:'STRING',
            required:true
        },

        data:{
            type:'TEXT',
            required:true
        },

        experience_id:{
            type:'INTEGER',
            required:true
        }
    }

};
