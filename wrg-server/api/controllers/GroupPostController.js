var async = require('async');

module.exports = {

    //TODO: DEFENSES!!!!!!

    create:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group Post Controller");
            return  res.view('404');
        }
        try {
            var userId = req.session.user.id;
            GroupPost.create(req.body).done(function (err, post) {
                if (err) {
                    sails.log.error("Cannot create post: ", err);
                    res.send(err, 500);
                } else {
                    sails.log.info("Post created");
                    res.send(post, 200);
                }
            });
        } catch (err) {
            return res.send({message:err}, 500);
        }
    },

    update:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group Post update");
            return  res.view('404');
        }
        var id = conversionutils.returnInteger(req.param('id'), 'Could not convert group post id');
        if (id !== null && id !== undefined) {
            try {
                var userId = req.session.user.id;

                GroupPost.find()
                    .where({id:id})
                    .done(function (err, post) {
                        if (err) {
                            return res.send({message:err}, 500);
                        } else {
                            if (post[0].user_id !== userId) {
                                return res.send({message:"You don't have permissions to edit post."}, 401);
                            }
                            else {
                                GroupPost.update({id:id}, req.body, function (err, event) {
                                    if (err) {
                                        sails.log.error("Error updating group post: ", err);
                                        res.send(err, 500);
                                    } else {
                                        sails.log.info("Post updated");
                                        res.send(event, 200);
                                    }
                                });
                            }
                        }
                    });
            } catch (err) {
                return res.send({message:err.message}, 500);
            }
        } else {
            sails.log.error("Post id is not valid");
            return res.send({message:err.message}, 500);
        }

    },

    destroy:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group post Destroy");
            return  res.view('404');
        }
        var id = conversionutils.returnInteger(req.param('id'), 'Could not convert group post id');
        try {
            var userId = req.session.user.id;
            GroupPost.find()
                .where({id:id})
                .done(function (err, posts) {
                    if (err) {
                        return res.send({message:err}, 500);
                    } else {

                        GroupUser.find()
                            .where({user_id:userId,
                                group_id:posts[0].group_id})
                            .done(function (err, groupUser) {

                                if (groupUser) {

                                    if (posts[0].user_id !== userId && groupUser[0].role !== "admin" && groupUser[0].role !== "moderator") {
                                        return res.send({message:"You don't have permissions to delete post."}, 401);
                                    }
                                    else {
                                        GroupPost.destroy({id:id}, function (err, post) {
                                            if (err) {
                                                sails.log.error("Error deleting group post. ", err);
                                                res.send(err, 500);
                                            } else {
                                                sails.log.info("Group post deleted.");
                                                res.send(post, 200);
                                            }
                                        });
                                    }
                                }
                                else {
                                    return res.send({message:"You don't have permissions to delete post."}, 401);
                                }

                            });


                    }
                });
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    },

    getPosts:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group Post getPosts");
            return  res.view('404');
        }

        var groupId = req.param('id'),
            userId = req.session.user.id,
            postLimit = req.param('limit');

        postLimit = postLimit || 5;


        if (groupId !== null && groupId !== undefined) {
            async.waterfall([
                function (callback) {
                    callback(null);
                },
                //Check if user is in the group
                function (callback) {
                    GroupPost.find()
                        .where({group_id:groupId})
                        .limit(postLimit)
                        .sort('updatedAt DESC')
                        .done(function (err, groupPostsData) {
                            if (err) {
                                return res.send({message:err}, 500);
                            } else {
                                var posts = groupPostsData;

                                for (var i = 0; i < posts.length; i++) {
                                    var datetime = posts[i].createdAt;
                                    posts[i].postedOn = datetime.toLocaleDateString() + " " + datetime.toLocaleTimeString();
                                }
                                sails.log.info("Group post data fetched");
                                callback(null, posts);
                            }
                        });
                },

                //get roles for post
                function (posts, callback) {
                    GroupUser.find()
                        .where({group_id:groupId,
                            user_id:userId  })
                        .done(function (err, groupuser) {
                            if (err) {
                                return res.send({message:err}, 500);
                            } else {

                                for (var i = 0; i < posts.length; i++) {

                                    posts[i].role = groupuser[0].role;
                                    if (posts[i].user_id == groupuser[0].user_id) {
                                        posts[i].role = "owner";
                                    }
                                }
                                sails.log.info("Group post data fetched");
                                callback(null, posts);
                            }
                        });
                },

                //Add first and last name to group posts
                function (posts, callback) {
                    var usersLength = posts.length;

                    if (posts) {
                        var idps = [];
                        for (var i = 0; i < usersLength; i++) {
                            idps[i] = posts[i].user_id;
                        }
                        User.find()
                            .where({id:idps})
                            .exec(function (err, users) {
                                if (users) {
                                    for (var i = 0; i < users.length; i++) {
                                        for (var j = 0; j < posts.length; j++) {
                                            if (posts[j].user_id === users[i].id) {
                                                posts[j].firstName = users[i].first_name;
                                                posts[j].lastName = users[i].last_name;
                                            }
                                        }
                                    }
                                }
                                callback(null, posts, idps);
                            });
                    }
                },
                //find pictures for posters
                function (posts, idps, callback) {
                    for (var i = 0; i < idps.length; i++) {
                        idps[i] = idps[i].toString();
                    }
                    Student.find()
                        .where({user_id:idps})
                        .exec(function (err, student) {
                            if (student) {

                                for (var i = 0; i < student.length; i++) {
                                    for (var j = 0; j < posts.length; j++) {
                                        if (posts[j].user_id == student[i].user_id) {
                                            posts[j].profileImage = student[i].profile_image;

                                        }
                                    }
                                }
                            }
                            return res.send(posts, 200);
                        });

                }

            ]);
        }
    }

};
