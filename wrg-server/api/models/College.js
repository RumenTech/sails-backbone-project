"use strict";

var mc = (require('../../config/mainConfig.js')());
var async = require('async');

module.exports = {

    attributes: {
        name:{
            type: 'STRING',
            required: true,
            unique : true
        },
        school_list_id: {
            type: 'integer'
        },
        state:{
            type: 'STRING'
        },
        city:{
            type: 'STRING'
        },
        college_size:{
            type: 'STRING'
        },
        college_website:{
            type: 'STRING'
        },
        facebook_url:{
            type: 'STRING'
        },
        twitter_url:{
            type: 'STRING'
        },
        google_url:{
            type: 'STRING'
        },
        linkedin_url:{
            type: 'STRING'
        },
        tagline:{
            type: 'TEXT'
        },
        description:{
            type: 'TEXT'
        },
        show_twitter:{
            type: 'BOOLEAN'
        },
        profile_image:{
            type: 'TEXT'
        }/*,
        type:{
            type: 'TEXT'
        }*/
    },

    findMe: function(user_id, next){
        try{

            var query = "SELECT College.* " +
                " FROM College," + mc.dbSettings.dbName + ".public.User as UserTable, CollegeUser "+
                " WHERE UserTable.id = '" + user_id + "' AND " +
                " CollegeUser.user_id = UserTable.id AND "+
                " CollegeUser.college_id = College.id  ";


            College.query(query, null, function(err, request) {
                try {
                    if (err) {
                        next(err);
                    } else {
                        if (request.rows.length === 1) {
                            var college = request.rows[0];
                            next(null, college);
                        } else {
                            next({ message : "No college found" });
                        }
                    }
                } catch(err) {
                    next({ message : err.message});
                }
            });
        }catch(err) {
            next({ message : err.message });
        }
    },

    getCollegeData: function(college, res){
        async.waterfall([
            function(callback){
                CollegeMedia.findByCollege_id(college.id).done(
                    function (err, collegeMedia) {
                        try {
                            if(err) {
                                return res.send({ message : err.message }, 500);
                            } else {
                                college.media = collegeMedia;
                                callback(null, college);
                            }
                        } catch(err) {
                            return res.send({ message : err.message }, 500)
                        }
                    }
                );
            },
            function(college, callback){
                CollegeCandidates.findByCollege_id(college.id).done(
                    function (err, cc) {
                        try {
                            if (err) {
                                return res.send({message: err.message}, 500);
                            } else {
                                college.candidates = cc;
                                callback(null, college);
                            }
                        } catch (err) {
                            return res.send({message: err.message}, 500)
                        }
                    }
                );
            },
            function(college, callback){
                CollegeEvent.findByCollege_id(college.id).done(
                    function (err, collegeEvents) {
                        try {
                            if (err) {
                                return res.send({ message: err.message }, 500);
                            } else {
                                var currentDate = new Date();
                                var events = [];
                                for (var i = 0; i < collegeEvents.length; i++) {
                                    if(collegeEvents[i].date >= currentDate){
                                        var event = collegeEvents[i];
                                        var datetime = event.date;
                                        event.date = CollegeEvent.getDateFormat(datetime);
                                        events.push(event);
                                    }
                                }
                                college.events = events;
                                callback(null, college);
                            }
                        } catch (err) {
                            return res.send({ message: err.message }, 500)
                        }
                    }
                );
            }
        ],function(err, college, callback){
            if(err){
                return res.send('Internal Server Error', 500);
            }else{
                return res.send(college, 200);
            }
        });
    }
};
