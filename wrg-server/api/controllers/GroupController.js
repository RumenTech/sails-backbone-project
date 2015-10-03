'use strict';

var mc = (require('../../config/mainConfig.js')());
var async = require('async');

module.exports = {

    create: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Groups create controller");
            return  res.view('404');
        }
        try {
            var userId = req.session.user.id,
                groupName = req.param('name');
            async.waterfall([
                function (callback) {
                    callback(null);
                },
                function (callback) {
                    Group.findOneByName(groupName).done(
                        function (err, group) {
                            if (err) {
                                res.send('Cannot attempt to find group', 500);
                            } else {
                                if (group) {
                                    sails.log.info("The group is already created");
                                    return res.send({message: "Group with that name already exists."}, 500);
                                } else {
                                    callback(null);
                                }
                            }
                        }
                    );
                },
                function (callback) {
                    var dataGroup = {
                        name: req.param('name'),
                        websiteUrl: req.param('websiteUrl'),
                        startedBy: req.session.user.first_name + " " + req.session.user.last_name,
                        googleUrl: req.param('googleUrl'),
                        facebookUrl: req.param('facebookUrl'),
                        linkedinUrl: req.param('linkedinUrl'),
                        twitterUrl: req.param('twitterUrl')
                    };
                    Group.create(dataGroup).done(
                        function (err, group) {
                            if (err) {
                                res.send('Cannot create group', 500);
                            } else {
                                sails.log.info('Group ' + dataGroup.name + ' is created');
                                callback(null, group);
                            }
                        }
                    );
                },
                function (group) {
                    var groupId = group.id;
                    var dataGroupUser = {
                        group_id: groupId,
                        user_id: userId,
                        role: 'admin',
                        status: 'approved'
                    };
                    GroupUser.create(dataGroupUser).done(
                        function (err) {
                            if (err) {
                                res.send('Cannot create group user', 500);
                            } else {
                                sails.log.info('Group User is created');
                                var feedEntry = {};
                                feedEntry.user_id = req.session.user.id;
                                feedEntry.user_role = req.session.user.role;
                                feedEntry.event_type ='groupCreated';
                                feedEntry.group_id = group.id;
                                feedEntry.group_name = group.name;
                                Feed.addFeedEvent(feedEntry);
                                res.send(group, 200);
                            }
                        }
                    );
                }
            ]);
        } catch (err) {
            return res.send({message: err}, 500);
        }
    },

    update: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Groups Update Controller");
            return  res.view('404');
        }
        var id = conversionutils.returnInteger(req.body.id, 'Could not convert group update id'),
            userId = req.session.user.id;
        try {
            async.waterfall([
                function (callback) {
                    callback(null);
                },
                function (callback) {
                    Group.checkUserRolePermissions(callback, res, id, userId, 'admin', 'moderator');
                },
                function () {
                    Group.update({id: id}, req.body, function (err, group) {
                        if (err) {
                            sails.log.error("Error updating group ", err);
                            res.send(err, 500);
                        } else {
                            sails.log.info("Group updated");
                            res.send(group, 200);
                        }
                    });
                }
            ]);

        } catch (err) {
            return res.send({message: err.message}, 500);
        }
    },

    destroy: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Groups Delete Controller");
            return  res.view('404');
        }
        var id = conversionutils.returnInteger(req.param('id'), 'Could not convert group id'),
            userId = req.session.user.id;

        async.waterfall([
            function (callback) {
                callback(null);
            },
            function (callback) {
                Group.checkUserRolePermissions(callback, res, id, userId, 'admin', null);
            },
            function (callback) {
                GroupEvent.destroy({group_id: id}).done(function (err) {
                    if (err) {
                        return res.send({message: err}, 500);
                    } else {
                        sails.log.info('Events destroyed');
                        callback(null);
                    }
                });
            },
            function (callback) {
                GroupPost.find({group_id: id}).done(function (err, posts) {
                    if (err) {
                        return res.send({message: err}, 500);
                    } else {
                        var postIds = [];
                        for (var i = 0; i < posts.length; i++) {
                            postIds[i] = posts[i].id;
                        }
                        callback(null, postIds);
                    }
                });
            },
            function (postIds, callback) {
                if (postIds.length > 0) {
                    GroupComment.destroy({post_id: postIds}).done(function (err) {
                        if (err) {
                            return res.send({message: err}, 500);
                        } else {
                            sails.log.info('Comments destroyed');
                            callback(null);
                        }
                    });
                } else {
                    callback(null);
                }
            },
            function (callback) {
                GroupPost.destroy({group_id: id}).done(function (err) {
                    if (err) {
                        return res.send({message: err}, 500);
                    } else {
                        sails.log.info('Posts destroyed');
                        callback(null);
                    }
                });
            },
            function (callback) {
                Group.destroy({id: id}).done(function (err) {
                    if (err) {
                        return res.send({message: err}, 500);
                    } else {
                        sails.log.info('Group destroyed');
                        callback(null);
                    }
                });
            },
            function () {
                GroupUser.destroy({group_id: id}).done(function (err, user) {
                    if (err) {
                        return res.send({message: err}, 500);
                    } else {
                        sails.log.info('Group users destroyed');
                        return res.send(user, 200);
                    }
                });
            }
        ]);
    },

    // Check on client if this is used anywhere???
    getAdmins: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Groups Delete Controller");
            return  res.view('404');
        } else {
            var role = 'admin';
            GroupUser.find({
                role: role
            }).done(function (err, admins) {
                    if (err) {
                        return res.send({message: err}, 500);
                    } else {
                        sails.log.info("Admins are found");
                        return res.send(admins.rows, 200);
                    }
                });
        }

    },

    getMyGroup: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Groups Delete Controller");
            return  res.view('404');
        }

        var groupId = req.param('id'),
            userId = req.session.user.id;

        if (groupId !== null && groupId !== undefined) {
            async.waterfall([
                function (callback) {
                    callback(null);
                },
                // Check if I'm actually user of this group
                function (callback) {
                    GroupUser.find({
                        group_id: groupId,
                        user_id: userId
                    }).done(function (err, groupUser) {
                            if (err) {
                                return res.send({message: err}, 500);
                            } else {
                                if (groupUser.length > 1) {
                                    sails.log.info('Bad db data, one user - one group multiple times');
                                    return res.send({message: 'Bad data'}, 500);
                                } else {
                                    callback(null);
                                }
                            }
                        });
                },
                //Get Main Group Data
                function () {
                    Group.find({
                        id: groupId
                    }).done(function (err, groupFullData) {
                            if (err) {
                                return res.send({message: err}, 500);
                            } else {
                                sails.log.info('Group Fetched with id: ', groupId);
                                return res.send(groupFullData, 200);
                            }
                        });
                }
            ]);
        }
    },

    getGroup: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.info("Not authenticated entry from Groups Delete Controller");
            return  res.view('404');
        }

        var groupId = req.param('id'),
            userId = req.session.user.id,
            fullData = {};

        if (groupId !== null && groupId !== undefined) {
            async.waterfall([
                function (callback) {
                    callback(null);
                },
                function (callback) {
                    Group.checkIfUserIsInGroup(res, userId, groupId, callback);
                },
                function (callback) {
                    Group.findGroup(res, groupId, fullData, callback);
                },
                function (groupFullData, callback) {
                    Group.findGroupEvents(res, groupFullData, callback);
                },
                function (groupFullData, callback) {
                    Group.findGroupMedia(res, groupFullData, callback);
                },
                function (groupFullData, callback) {
                    Group.findGroupUsers(res, groupFullData, callback);
                },
                function (groupFullData, callback) {
                    Group.findUsersNames(res, groupFullData, callback);
                },
                //Find picture
                function (groupFullData, ids, callback) {
                    Group.findUsersPhotos(res, ids, groupFullData, callback);
                },
                // Check if user is admin
                function (groupFullData) {
                    Group.checkIfUserIsAdmin(res, userId, groupId, groupFullData)
                }
            ]);
        }
    },

    getReadOnlyGroup: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error('Not authenticated entry from Group getGroup');
            return  res.view('404');
        }

        try{
            var groupId = req.param('id'),
                userId = req.session.user.id,
                fullData = {};

            if (groupId !== null && groupId !== undefined) {
                async.waterfall([
                    function (callback) {
                        callback(null);
                    },
                    function (callback) {
                        Group.findGroup(res, groupId, fullData, callback);
                    },
                    function (groupFullData, callback) {
                        Group.findGroupEvents(res, groupFullData, callback);
                    },
                    function (groupFullData, callback) {
                        Group.findGroupMedia(res, groupFullData, callback);
                    },
                    function (groupFullData, callback) {
                        Group.findGroupUsers(res, groupFullData, callback, 'readonly');
                    },
                    function (groupFullData, callback) {
                        Group.findUsersNames(res, groupFullData, callback);
                    },
                    function (groupFullData, ids) {
                        Group.findUsersPhotos(res, ids, groupFullData)
                    }
                ]);
            }
        }
        catch(err){
            sails.log.error('Error occurred: ' + err.message);
            return  res.send({error: 'Group deleted'}, 500);
        }
    },

    searchGroup: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Groups Delete Controller");
            return  res.view('404');
        } else {
            var userId = req.session.user.id;
            if (userId !== null && userId !== undefined) {
                var name = req.param('name');
                name = name || '';

                var limit = req.param('limit');
                limit = limit || 5;

                var offset = req.param('offset');
                offset = offset || 0;
                if (name === '') {
                    Group.find().limit(limit).sort('updatedAt DESC').done(function (err, groups) {
                        try {
                            if (err) {
                                sails.log.error(err);
                                return res.send(err, 500);
                            } else {
                                sails.log.info("Groups are found");
                                return res.send(groups, 200);
                            }
                        } catch (err) {
                            sails.log.error("Error : ", err);
                            return res.send(err, 500);
                        }
                    });
                } else {
                    Group.find({
                        name: {contains: name}
                    }).limit(limit).done(function (err, groups) {
                            try {
                                if (err) {
                                    sails.log.info(err);
                                    return res.send(err, 500);
                                } else {
                                    sails.log.info("Groups are found");
                                    return res.send(groups, 200);
                                }
                            } catch (err) {
                                sails.log.info("Error : ", err);
                                return res.send(err, 500);
                            }
                        });
                }
            } else {
                res.send({message: 'You are not a valid user'}, 500);
            }
        }
    },

    getMyGroups: function (req, res) {
        Group.getMyGroups(req, res, mc.dbSettings.dbName);
    },

    getMyPendingGroups: function (req, res) {
        Group.getMyPendingGroups(req, res, mc.dbSettings.dbName);
    },

    getAdminGroups: function (req, res) {
        Group.getAdminGroups(req, res, mc.dbSettings.dbName);
    },

    sendMessage: function (req, res) {
        //  Group.getMyPendingGroups(req, res, mc.dbSettings.dbName);

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Groups Delete Controller");
            return  res.view('404');
        }


        var userId = req.session.user.id;

        GroupUser.find({
            group_id: req.body.group_id,
            status: 'approved'
        }).done(function (err, users) {
                if (err) {
                    sails.log.error('This user is not in this group');
                    return res.send({message: err}, 500);
                } else {

                    for (var i = 0; i < users.length; i++) {

                        if (users[i].user_id !== userId) {
                            try {
                                req.body.receiver_id = users[i].user_id;
                                req.body.owner_id = users[i].user_id;
                                req.body.sender_id = userId;
                                if (req.body.receiver_id !== req.body.sender_id) {
                                    Message.new_update(req.body, function (err, studentmessage) {
                                        try {
                                            if (err) {
                                                return res.send(err, 500);
                                            } else {
                                                // return res.send(studentmessage, 200);
                                            }
                                        } catch (err) {
                                            return res.send({message: err.message}, 500);
                                        }
                                    });
                                }
                            } catch (err) {
                                return res.send({message: err.message}, 500);
                            }
                        }
                    }
                    return res.send([], 200);
                }
            });
    },

    isUserMemberOfGroup: function (req, res) {
        var userId = req.session.user.id,
            groupId = req.param('group_id');
        try {
            GroupUser.find()
                .where({user_id: userId, group_id: groupId})
                .exec(function (err, groupUser) {
                    if(err) {
                        sails.log.error('An error occurred');
                        res.send({message:'An error occurred'}, 500);
                    } else {
                        if(groupUser[0]) {
                            if(groupUser[0].status === 'approved') {
                                sails.log.info('User is approved member of this group');
                                res.send(groupUser, 200);
                            } else {
                                sails.log.info('User is not approved yet');
                                res.send({message: 'pending'}, 200);
                            }
                        } else {
                            sails.log.info('Cannot find group user');
                            res.send({message: 'New'}, 200);
                        }
                    }
                });
        } catch (err) {
            sails.log.error('An error occurred: ', err);
            res.send({messgae: 'Error'}, 500);
        }

    }
};
