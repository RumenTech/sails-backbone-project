/**
 * GroupCommentController
 *
 * @module        :: Controller
 * @description    :: Contains logic for handling requests and operations regarding post comments.
 *
 */



'use strict';

var async = require('async');

module.exports = {

    create: function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Not authenticated entry from Group comment controller");
            return  res.view('404');
        }

        var postId = req.param('postid');
        var userId = req.session.user.id;
        var properStudentId = conversionutils.returnInteger(req.session.user.id, 'Could not convert group user id');

        try {
            async.waterfall([
                function (callback) {
                    callback(null);
                },
                function (callback) {
                    GroupComment.create(req.body).done(function (err, comment) {
                        if (err) {
                            console.log('Cannot create comment: ', err);
                            res.send(err, 500);
                        } else {
                            Student.find()
                                .where({user_id: properStudentId})
                                .exec(function (err, student) {
                                    if (err) {
                                        console.log("Error getting student ", err);
                                        res.send(err, 500);
                                    } else {
                                        comment.profileImage = student[0].profile_image;
                                        //no need to call db for user name. It is already contained in the session
                                        comment.firstName = req.session.user.first_name;
                                        comment.lastName = req.session.user.last_name;
                                        res.send(comment, 200);
                                    }
                                });
                        }
                    });
                },
                function (comment, callback) {
                    Student.find()
                        .where({id: properStudentId})
                        .exec(function (err, student) {
                            console.log("just before the fall" + student);
                            comment.profileImage = student[0].profile_image;
                            //no need to call db for user name. It is already contained in the session
                            comment.firstName = req.session.user.first_name;
                            comment.lastName = req.session.user.last_name;
                            res.send(comment, 200);
                        });
                }
            ]);
        } catch (err) {
            return res.send({message: err}, 500);
        }
    },

    update: function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Not authenticated entry from Group comment controller");
            return  res.view('404');
        }

        var postId = conversionutils.returnInteger(req.param('id'), 'Could not convert group comment id');
        var userId = req.session.user.id;
        var postContent = req.param('postContent');

        if (postId !== null && postId !== undefined) {
            try {
                GroupComment.update({id: postId, user_id: userId}, {content: postContent}, function (err, comment) {
                    if (err) {
                        console.log("Error updating group comment ", err);
                        res.send(err, 500);
                    } else {
                        console.log("Comment updated");
                        res.send(comment, 200);
                    }
                });
            } catch (err) {
                return res.send({message: err.message}, 500);
            }
        } else {
            console.log('Comment id is not valid!');
            return res.send({message: err.message}, 500);
        }
    },

    destroy: function (req, res) {
        //first line of defense: is user authenticated
        if (!req.isAuthenticated()) {
            console.log("Not authenticated entry from Group comment controller");
            return  res.view('404');
        }

        var id = conversionutils.returnInteger(req.param('id'), 'Could not convert group comment id');
        var userId = req.session.user.id;

        if (id !== null && id !== undefined) {
            async.waterfall([
                function (callback) {
                    callback(null);
                },

                //Based on commentid fetch post_id
                function (callback) {
                    GroupComment.find({
                        id: id
                    }).done(function (err, singleComment) {
                            if (err) {
                                //console.log('This user is not in this group');
                                return res.send({message: err}, 500);
                            } else {
                                var size = singleComment.length;

                                //final line of defense. Request is forged.
                                if(size != 0) {
                                    callback(null, singleComment[0]);
                                } else {
                                    //if it gets here, it is personal and intentional
                                    hackingharvester.proccessReq(req, "GroupCommentCtr - Probably using Fiddler to make false Post comment delete requests");
                                    return res.view('404');
                                }
                            }
                        });
                },
                //Based on post_id fetch mi a Group_id
                function (singleComment, callback) {
                    GroupPost.find({
                        id: singleComment.post_id
                    }).done(function (err, mainPost) {
                            if (err) {
                                //console.log('This user is not in this group');
                                return res.send({message: err}, 500);
                            } else {
                                callback(null, mainPost[0]);
                            }
                        });
                },
                //Fetch group id here
                function (mainPost, callback) {
                    GroupUser.find({
                        group_id: mainPost.group_id,
                        user_id: userId
                    }).done(function (err, GroupUserData) {
                            var userRole = GroupUserData[0].role;
                            if (userRole === "admin" || userRole === "moderator") {
                                console.log("Delete the post. User who wanted deletion is either admin or moderator");
                                try {
                                    GroupComment.destroy({id: id}, function (err, comment) {
                                        if (err) {
                                            console.log("Error deleting group comment", err);
                                            res.send(err, 500);
                                        } else {
                                            console.log("Comment deleted");
                                            res.send(comment, 200);
                                        }
                                    });
                                } catch (err) {
                                    return res.send({message: err.message}, 500);
                                }
                            } else {
                                console.log("User is regular user. Delete the post based on his id and postid ");
                                try {
                                    GroupComment.destroy({id: id, user_id: userId}, function (err, comment) {
                                        if (err) {
                                            console.log("Error deleting group comment", err);
                                            res.send(err, 500);
                                        } else {
                                            console.log("Comment deleted");
                                            res.send(comment, 200);
                                        }
                                    });
                                } catch (err) {
                                    return res.send({message: err.message}, 500);
                                }
                            }
                        });
                }
            ]);
        }
    },

    getPostUserRole: function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Not authenticated entry from Group comment controller");
            return  res.view('404');
        }

        var userId = req.session.user.id;
        var groupId = req.param('groupid');

        GroupUser.find({
            user_id: userId,
            group_id: groupId
        }, function (err, user) {
            if (err) {
                console.log("Error getting group user", err);
                res.send(err, 500);
            } else {
                res.send(user.role);
            }
        });
    },

    getComments: function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Not authenticated entry from Group comment controller");
            return  res.view('404');
        }

        var postId = req.param('postid'),
            groupId = req.param('groupid'),
            userId = req.session.user.id,
            limit = req.param('limit');
            limit = limit || 5;
            console.log("This is groupid" + groupId);

        if (postId !== null && postId !== undefined) {
            async.waterfall([
                function (callback) {
                    callback(null);
                },

                function (callback) {
                    GroupComment.find({
                        post_id: postId
                    }).limit(limit).done(function (err, groupCommentsData) {
                            if (err) {
                                return res.send({message: err}, 500);
                            } else {
                                var comments = groupCommentsData;
                                //what is this used for?!?!?

                                 for (var i = 0; i < comments.length; i++) {
                                 var datetime = comments[i].createdAt;
                                 comments[i].postedOn = datetime.toLocaleDateString() + " " + datetime.toLocaleTimeString();
                                 }

                                console.log('Group comment data fetched');
                                callback(null, comments);
                            }
                        });
                },

                //Add first and last name to group comments
                function (comments, callback) {
                    var usersLength = comments.length;
                    if (comments) {
                        var ids = [];
                        for (var i = 0; i < usersLength; i++) {
                            ids[i] = comments[i].user_id;
                        }
                        User.find()
                            .where({id: ids})
                            .exec(function (err, users) {
                                if (users) {
                                    for (var i = 0; i < users.length; i++) {
                                        for (var j = 0; j < comments.length; j++) {
                                            if (comments[j].user_id === users[i].id) {
                                                comments[j].firstName = users[i].first_name;
                                                comments[j].lastName = users[i].last_name;
                                            }
                                        }
                                    }
                                }
                                callback(null, comments, ids);
                            });
                    }
                },
                //find pictures for comments
                function (comments, ids, callback) {
                    for (var i = 0; i < ids.length; i++) {
                        ids[i] = ids[i].toString();
                    }
                    Student.find()
                        .where({user_id: ids})
                        .exec(function (err, student) {
                            if (student) {
                                console.log("This is comments length " + comments.length);
                                console.log("This is students length " + student.length);
                                for (var i = 0; i < student.length; i++) {
                                    for (var j = 0; j < comments.length; j++) {
                                        if (comments[j].user_id == student[i].user_id) {
                                            comments[j].profileImage = student[i].profile_image;
                                        }
                                    }
                                }
                            }
                            callback(null, comments, ids);
                        });
                },

                function (comments, ids, callback) {
                    var groupIdInt = conversionutils.returnInteger(groupId, 'Cannot convert group id - Group');
                    //Dragons be here !!!
                    GroupUser.find()
                        .where({
                            group_id: groupIdInt,
                            user_id: userId
                        })
                        .done(function (err, groupuser) {
                            if (err) {
                                return res.send({message: err}, 500);
                            } else {
                                console.log("These are group users: " + groupuser);
                                for (var i = 0; i < comments.length; i++) {
                                    comments[i].role = groupuser[0].role;
                                    /*if(posts[i].user_id == groupuser[0].user_id){
                                     posts[i].role = "owner";
                                     }*/
                                }
                                console.log('Group Post data fetched');
                                return res.send(comments, 200);
                            }
                        });
                }
            ]);
        }
    }
};
