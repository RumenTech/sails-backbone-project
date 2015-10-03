/**
 * Created by semir.sabic on 16.4.2014.
 */

var async = require ('async'),
    mc = (require('../../config/mainConfig.js')());

module.exports = {

    attributes: {
        resource_id:{
            type: 'integer',
            required: true
        },
        user_id:{
            type: 'integer',
            required: true
        },
        content:{
            type: 'string',
            required: true
        }
    },

    getCommentsByResourceId: function(res, resId, userId, userRole, mainCallback){
        async.waterfall([
            function (callback) {
                CareerPathResourceComment.find({resource_id: resId}, function(err, comments){
                    if(err){
                        sails.log.error('Cannot get comments for resource with id ' + resId);
                        return res.send({message: err.message}, 500);
                    }
                    else{
                        sails.log.info('Fetching comments for resource ' + resId);
                        callback(null, comments);
                    }
                });
            },
            function (comments, callback) {
                var user_ids = [];
                for (var i = 0; i < comments.length; i++) {
                    user_ids[i] = comments[i].user_id;
                }
                User.find()
                    .where({id: user_ids})
                    .exec(function (err, users) {
                        if (users) {
                            sails.log.info('Fetching user names for resource comments');
                            for (var i = 0; i < users.length; i++) {
                                for (var j = 0; j < comments.length; j++) {
                                    if (comments[j].user_id == users[i].id) {
                                        var name = users[i].first_name + ' ' + users[i].last_name;
                                        comments[j].userName = name;
                                    }
                                }
                            }
                        }
                        callback(null, comments);
                    });
            },
            function (comments) {
                var query = "SELECT CareerPathResourceComment.*, Student.profile_image as messageImage " +
                    " from CareerPathResourceComment join Student on CareerPathResourceComment.user_id = cast(Student.user_id as int) " +
                    ", " + mc.dbSettings.dbName + ".public.User as UserTable WHERE  UserTable.id = CareerPathResourceComment.user_id " +
                    " AND CareerPathResourceComment.resource_id = "+ resId +" AND UserTable.role = 'student' " +
                    " UNION " +
                    " SELECT CareerPathResourceComment.*, AlumniStory.profile_image as messageImage " +
                    " from CareerPathResourceComment join AlumniStory on CareerPathResourceComment.user_id = cast(AlumniStory.user_id as int), " + mc.dbSettings.dbName + ".public.User as UserTable " +
                    " WHERE  UserTable.id = CareerPathResourceComment.user_id AND CareerPathResourceComment.resource_id = "+ resId +" "+
                    " AND UserTable.role = 'alumni' "  +
                    " UNION " +
                    " SELECT CareerPathResourceComment.*, College.profile_image as messageImage "+
                    " from CareerPathResourceComment join CollegeUser on CareerPathResourceComment.user_id = cast(CollegeUser.user_id as int)  join College on CollegeUser.college_id = College.id , " + mc.dbSettings.dbName + ".public.User as UserTable " +
                    " WHERE  UserTable.id = CareerPathResourceComment.user_id AND CareerPathResourceComment.resource_id = "+ resId +" " +
                    " AND UserTable.role = 'college' ";

                CareerPathResourceComment.query(query, null, function(err, users) {
                    try {
                        if (err) {
                            return res.send({ message : err.message }, 500);
                        } else {
                            for (var i=0; i<users.rows.length; i++) {
                                for (var j=0; j<comments.length; j++) {
                                    if(users.rows[i].id === comments[j].id) {
                                        comments[j].profileImage = users.rows[i].messageimage;
                                    }
                                }
                            }
                            mainCallback(null, comments);
                        }
                    } catch (err) {
                        return res.send({ message : err.message }, 500);
                    }
                });

            }
        ]);
    }
};