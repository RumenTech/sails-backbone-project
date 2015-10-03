/**
 * Event
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

      name:{
          type: 'string',
          required: true
      },
      date:{
          type: 'date',
          required: true
      },
      start:{
          type: 'string',
          required: true
      },
      end:{
          type: 'string',
          required: true
      },
      location:{
          type: 'string',
          required: true
      }

  },

    new_update: function(data,next){
        try{
            //is new
            if (data.id == undefined || data.id == ""){
                delete data.id;
                Event.create(data).done(function(err,event){
                    try{
                        if (err){
                            next(err,null);
                        } else{
                            next(null,event);
                        }
                    }catch(err){
                        next(err);
                    }
                });

                //is update
            }else{

                Event.update(
                    {
                        id: data.id,
                        company_id : data.company_id
                    },
                    data,
                    function(err,event){
                        try{
                            if (err){
                                next(err,null);
                            } else{
                                if (event.length ==1){
                                    next(null,event[0]);
                                }else{
                                    next(null,Array);
                                }
                            }
                        }catch(err){
                            next(err);
                        }
                    }
                );

            }
        }catch(err){
            next(err);
        }
    }


};
