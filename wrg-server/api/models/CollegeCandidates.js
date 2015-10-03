/**
 * CollegeCandidates
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
"use strict";

module.exports = {

    attributes: {
        college_id:{
            type: 'INTEGER',
            required: true
        },
        field:{
            type: 'STRING',
            required: true
        },
        description:{
            type: 'TEXT',
            required: true
        }
    },

    new_update: function(data, next, remove){
        try{
            // delete
            if (remove) {
                CollegeCandidates.destroy({id: data.id}).done(function(err, candidates) {
                    try {
                        if (err) {
                            next(err);
                        } else {
                            next(null, candidates);
                        }
                    } catch (err) {
                        next(err);
                    }
                });
            }
            // is new
            if (data.id === undefined || data.id === ""){
                delete data.id;
                CollegeCandidates.create(data).done(function(err, college_candidate){
                    try{
                        if (err) {
                            next(err, null);
                        } else {
                            next(null, college_candidate);
                        }
                    } catch(err) {

                    }
                });

                //is update
            } else {
                CollegeCandidates.update({id : data.id}, data, function(err, college_candidate){
                    try{
                        if (err) {
                            next(err, null);
                        } else {
                            if (college_candidate.length === 1){
                                next(null, college_candidate[0]);
                            } else {
                                next(null, Array);
                            }
                        }
                    } catch(err) {
                        next(err);
                    }
                });
            }
        } catch(err){
            next(err);
        }
    }
};