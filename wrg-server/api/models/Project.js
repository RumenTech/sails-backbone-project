/**
 * Project
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
        date:{
            type: 'date',
            required: true
        },
        video_url:{
            type: 'string'
            //required: true
        },
        image_1:{
            type: 'text'
            //required: true
        },
        image_2:{
            type: 'text'
            //required: true
        },
        experience_id:{
            type: 'int',
            required: true
        },
        toJSON: function() {
            var obj = this.toObject();
            //delete obj.password;
            return obj;
        }
    },



    new_update: function(data,next){
        try{
            //is new
            if (data.id == undefined || data.id == ""){
                delete data.id;
                Project.create(data).done(function(err,project){
                   try{
                       if (err){
                           next(err,null);
                       } else{
                           next(null,project);
                       }
                   }catch(err){
                       next(err);
                   }
                });

            //is update
            }else{

                Project.update({id: data.id},data,function(err,projects){
                    try{
                       if (err){
                           next(err,null);
                       } else{
                           if (projects.length ==1){
                                next(null,projects[0]);
                           }else{
                               next(null,Array);
                           }
                       }
                    }catch(err){
                        next(err);
                    }
                });
            }
        }catch(err){
            next(err);
        }
    }

};
