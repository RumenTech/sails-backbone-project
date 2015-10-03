/**
 * CompanyCandidates
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        company_id:{
            type: 'INTEGER',
            required: true
        },
        position:{
            type: 'STRING',
            required: true
        },
        description:{
            type: 'TEXT',
            required: true
        },
        preffereddescription:{
            type: 'TEXT',
            required: true
        },
        skill_keywords: {
            type: 'TEXT'
        },
        internship: {
             type: 'INTEGER'
        },
        communityservice: {
             type: 'INTEGER'
        },
        publicspeaking: {
            type: 'INTEGER'
        },
        research: {
            type: 'INTEGER'
        },
        leadership: {
            type: 'INTEGER'
        },
        innovation: {
            type: 'INTEGER'
        },
        industryoutreach: {
            type: 'INTEGER'
        },
        grit: {
            type: 'INTEGER'
        },
        department:{
            type: 'TEXT',
            required: true
        }
    },

    new_update: function(data,next){
        try{
            //is new
            if (data.id == undefined || data.id == ""){
                delete data.id;
                CompanyCandidates.create(data).done(function(err,company_candidate){
                    try{
                        if (err){
                            next(err,null);
                        } else{
                            next(null,company_candidate);
                        }
                    }catch(err){
                        next(err);
                    }
                });

                //is update
            }else{

                CompanyCandidates.update({id: data.id},data,function(err,company_candidate){
                    try{
                        if (err){
                            next(err,null);
                        } else{
                            if (company_candidate.length ==1){
                                next(null,company_candidate[0]);
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