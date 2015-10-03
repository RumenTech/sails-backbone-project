/**
 * Created by semir.sabic on 29.4.2014.
 */
var async = require('async');
module.exports = {
    attributes: {
        user_id:{
            type: 'integer',
            required: true
        },
        user_name:{
            type: 'string',
            required: true
        },
        user_role:{
            type: 'string',
            required: true
        },
        image:{
            type: 'string',
            required: false
        },
        event_type:{
            type: 'string',
            required: true
        },
        timestamp:{
            type: 'string',
            required: false
        },
        connection_id:{
            type: 'integer',
            required: false
        },
        connection_name:{
            type: 'string',
            required: false
        },
        connection_role:{
            type: 'string',
            required: false
        },
        group_id:{
            type: 'integer',
            required: false
        },
        group_name:{
            type: 'string',
            required: false
        },
        job_id:{
            type: 'integer',
            required: false
        },
        job_name:{
            type: 'string',
            required: false
        },
        challenge_id:{
            type: 'integer',
            required: false
        },
        challenge_name:{
            type: 'string',
            required: false
        },
        company_id:{
            type: 'integer',
            required: false
        },
        company_name:{
            type: 'string',
            required: false
        }
    },

    addFeedEvent: function(feedEntry){
        try{
            async.waterfall([
                function(callback){
                    if(feedEntry.role === 'college'){
                        Feed.getUserName(feedEntry.user_id, function(user){
                            feedEntry.user_name = user.first_name;
                            feedEntry.timestamp = new Date();
                            callback();
                        });
                    }
                    else{
                        Feed.getUserName(feedEntry.user_id, function(user){
                            feedEntry.user_name = user.first_name + ' ' + user.last_name;
                            feedEntry.timestamp = new Date().toISOString();
                            callback();
                        });
                    }
                },
                function(callback){
                    if(feedEntry.event_type === 'connection'){
                        Feed.getUserName(feedEntry.connection_id, function(user){
                            feedEntry.connection_name = user.first_name + ' ' + user.last_name;
                            feedEntry.connection_role = user.role;
                            callback();
                        });
                    }
                    else{
                        callback();
                    }
                },
                function(callback){
                    if(feedEntry.event_type === 'newJob' || feedEntry.event_type === 'newChallenge'){
                        Feed.getCompany(feedEntry.company_id, function(company){
                            feedEntry.company_name = company.name;
                            callback();
                        });
                    }
                    else{
                        callback();
                    }
                },
                function(callback){
                    if(feedEntry.event_type === 'newMember'){
                        Feed.getUserName(feedEntry.user_id, function(user){
                            feedEntry.user_role = user.role;
                            Feed.getGroupName(feedEntry.group_id, function(group){
                                feedEntry.group_name = group.name;
                                callback();
                            });
                        });
                    }
                    else{
                        callback();
                    }
                },
                function(){
                    Feed.create(feedEntry, function(err, fEntry){
                        if(err){
                            sails.log.error('An error occurred during feed entry save: ' + err.message);
                        }
                        else{
                            sails.log.info('Feed entry saved');
                        }
                    });
                }
            ])
        }
        catch (err) {
            sails.log.error('An error occurred during feed entry save!!!');
        }
    },

    getUserName: function(id, callback){
        User.findById(id, function(err, user){
            if(err){
                sails.log.error('Cannot get user with id: ' + id);
            }
            else{
                callback(user[0]);
            }
        });
    },

    getGroupName: function(id, callback){
        Group.findById(id, function(err, group){
            if(err){
                sails.log.error('Cannot get group with id: ' + id);
            }
            else{
                callback(group[0]);
            }
        });
    },

    getCompany: function(id, callback){
        Company.findById(id, function(err, company){
            if(err){
                sails.log.error('Cannot get company with id: ' + id);
            }
            else{
                callback(company[0]);
            }
        });
    }

};