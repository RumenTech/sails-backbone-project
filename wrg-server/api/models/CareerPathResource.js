/**
 * Created by semir.sabic on 16.4.2014.
 */
var async = require('async');
module.exports = {

    attributes: {
        cp_tab_category_id:{
            type: 'integer',
            required: true
        },
        user_id:{
            type: 'integer',
            required: true
        },
        college_id:{
            type: 'integer',
            required: true
        },
        content:{
            type: 'string',
            required: true
        },
        title:{
            type: 'string',
            required: true
        }
    },

    deleteResource: function(id, mainCallback){
        async.waterfall([
            function(callback){
                CareerPathResourceComment.find({resource_id:id}, function(err, comments){
                    if(err){
                        sails.log.error('Cannot get resource comment with id ' + id);
                        return res.send({message: err.message}, 500);
                    }
                    else{
                        if(comments.length > 0){
                            callback(null, comments);
                        }
                        else{
                            callback(null, null);
                        }
                    }
                });
            },
            function(comments, callback){
                if(comments){
                    for(var i = 0; i< comments.length; i++){
                        CareerPathResourceComment.destroy({id: comments[i].id}).done(function(err){
                            if(err){
                                sails.log.error('Cannot delete resource comment');
                            }
                            else{
                                sails.log.info('Resource comment deleted');
                            }
                        });
                    }
                    callback();
                }
                else{
                    sails.log.info('No comments to delete');
                    callback();
                }

            },
            function(callback){
                CareerPathResourceVote.find({resource_id:id}, function(err, votes){
                    if(err){
                        sails.log.error('Cannot get resource vote with id ' + id);
                        res.send({message: err.message}, 500);
                    }
                    else{
                        if(votes.length > 0){
                            callback(null, votes);
                        }
                        else{
                            callback(null, null);
                        }
                    }
                });
            },
            function(votes, callback){
                if(votes){
                    for(var i = 0; i< votes.length; i++){
                        CareerPathResourceVote.destroy({id: votes[i].id}).done(function(err){
                            if(err){
                                sails.log.error('Cannot delete resource vote');
                            }
                            else{
                                sails.log.info('Resource vote deleted');
                            }
                        });
                    }
                    callback();
                }
                else{
                    sails.log.info('No votes to delete');
                    callback();
                }
            },
            function(){
                CareerPathResource.destroy({id:id}).done(function(err){
                    if(err){
                        sails.log.error('Cannot get resource vote with id ' + id);
                        return res.send({message: err.message}, 500);
                    }
                    else{
                       mainCallback(true);
                    }
                });
            }
        ]);
    },

    getResourcesByCategoryId: function(res, collegeId, catId, mainCallback){
        async.waterfall([
            function(callback){
                CareerPathResource.find({cp_tab_category_id: catId, college_id: collegeId}, function(err, resources){
                    if(err) {
                        sails.log.error('Cannot get resource for category with id ' + catId);
                        return res.send({message: err.message}, 500);
                    }
                    else {
                        callback(null, resources);
                    }
                })
            },
            //Get names of users who posted resource
            function (resources, callback) {
                if(resources && resources.length > 0){
                    var user_ids = [];
                    for (var i = 0; i < resources.length; i++) {
                        user_ids[i] = resources[i].user_id;
                    }
                    User.find({id: user_ids}, function(err, users){
                        if(err){
                            sails.log.error('Cannot get resource users');
                            return res.send({message: err.message}, 500);
                        }
                        else{
                            if (users.length > 0) {
                                for (var i = 0; i < resources.length; i++) {
                                    for (var j = 0; j < users.length; j++) {
                                        if (resources[i].user_id === users[j].id) {
                                            var name = users[j].first_name + ' ' + users[j].last_name;
                                            resources[i].userName = name;
                                        }
                                    }
                                }
                            }
                           callback(null, resources);
                        }
                    });
                } else {
                    callback(null, resources);
                }
            },
            function(resources){
                if(resources && resources.length > 0){
                    var res_ids = [];
                    for (var i = 0; i < resources.length; i++) {
                        res_ids[i] = resources[i].id;
                    }
                    CareerPathResourceVote.find({resource_id:res_ids}, function(err, votes){
                        if(err){
                            sails.log.error('Cannot get votes for resource');
                            return res.send({message: err.message}, 500);
                        }
                        else{
                            if (votes.length > 0) {
                                for (var i = 0; i < resources.length; i++) {
                                    resources[i].votes = [];
                                    for (var j = 0; j < votes.length; j++) {
                                        if (resources[i].id === votes[j].resource_id) {
                                            resources[i].votes.push(votes[j]);
                                        }
                                    }
                                }
                            }
                            mainCallback(null, resources);
                        }
                    });
                }
                else {
                    mainCallback(null, resources);
                }
            }
        ]);
    }
};