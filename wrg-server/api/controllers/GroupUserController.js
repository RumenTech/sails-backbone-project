/**
 * GroupUserController
 *
 * @module        :: Controller
 * @description    :: Contains logic for handling requests and operations regarding group users.
 */


'use strict';

var async = require('async');

module.exports = {

    create: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group User Controller");
            return  res.view('404');
        }
        // User sends request to join group, his status needs to be set to 'pending'
        var userId = req.body.user_id,
            groupId = req.body.group_id;
        try {
            async.waterfall([
                function (callback) {
                    callback(null);
                },
                function (callback) {
                    GroupUser.find({
                        user_id: userId,
                        group_id: groupId
                    }, function (err, user) {
                        if (err) {
                            sails.log.error("Error getting group user", err);
                            res.send(err, 500);
                        } else {
                            if (user.length !== 0) {
                                if (user[0].status === 'pending') {
                                    sails.log.info("User is already pending approval");
                                    return res.send({message: 'pending'}, 500);
                                } else {
                                    sails.log.error("Something went wrong");
                                    return res.send({message: err}, 500);
                                }
                            } else {
                                callback(null)
                            }
                        }
                    });
                }, function () {
                    // If there is no user in Group user associated with that group, create one
                    GroupUser.create(req.body).done(
                        function (err, user) {
                            if (err) {
                                res.send('Cannot create user', 500);
                            } else {
                                sails.log.info("New user is added to group");
                                res.send(user, 200);
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
            sails.log.error("Not authenticated entry from Group User update");
            return  res.view('404');
        } else {
            var id = conversionutils.returnInteger(req.param('id'), 'Could not convert group user update id'),
                userId = conversionutils.returnInteger(req.session.user.id, 'Could not convert userId'),
                groupId = conversionutils.returnInteger(req.body.group_id, 'Could not convert userId');

            try {
                var role = req.body.role,
                    status = req.body.status;
                async.waterfall([
                    function (callback) {
                        callback(null);
                    },
                    function (callback) {
                        Group.checkUserRolePermissions(callback, res, groupId, userId, 'admin', 'moderator');
                    }, function () {
                        GroupUser.update({id: id}, {role: role, status: status}, function (err, groupUser) {
                            if (err) {
                                sails.log.error("Error updating group user ", err);
                                res.send(err, 500);
                            } else {
                                sails.log.info("Group user updated");
                                var feedEntry = {};
                                feedEntry.user_id = req.body.user_id;
                                feedEntry.event_type ='newMember';
                                feedEntry.group_id = req.body.group_id;
                                Feed.addFeedEvent(feedEntry);
                                res.send(groupUser, 200);
                            }
                        });
                    }
                ]);
            } catch (err) {
                return res.send({message: err.message}, 500);
            }
        }

    },

    //used when administering user roles on groups
    getSpecificGroupData: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group User Controller");
            return  res.view('404');
        } else {
            var groupId = conversionutils.returnInteger(req.param('group_id'), 'Could not convert userId'),
                userId = conversionutils.returnInteger(req.session.user.id, 'Could not convert userId');
            if (groupId !== null && groupId !== undefined) {
                async.waterfall([
                    function (callback) {
                        callback(null);
                    },
                    function (callback) {
                        Group.checkUserRolePermissions(callback, res, groupId, userId, 'admin', 'moderator');
                    },
                    function (callback) {
                        var groupIdInt = conversionutils.returnInteger(groupId, 'Cannot convert group id - Group');
                        GroupUser.find({
                            group_id: groupIdInt
                        }).done(function (err, groupUsers) {
                                if (err) {
                                    sails.log.error("Error: This user is not in this group");
                                    return res.send({message: err}, 500);
                                } else {
                                    callback(null, groupUsers);
                                }
                            });
                    },

                    //Add first and last name to group posts
                    function (groupFullData, callback) {
                        var usersLength = groupFullData.length;

                        if (usersLength) {
                            var idps = [];
                            for (var i = 0; i < usersLength; i++) {
                                idps[i] = groupFullData[i].user_id;
                            }
                            User.find()
                                .where({id: idps})
                                .exec(function (err, users) {
                                    if (users) {
                                        for (var i = 0; i < users.length; i++) {
                                            for (var j = 0; j < groupFullData.length; j++) {
                                                if (groupFullData[j].user_id === users[i].id) {
                                                    groupFullData[j].firstName = users[i].first_name;
                                                    groupFullData[j].lastName = users[i].last_name;
                                                }
                                            }
                                        }
                                    }
                                    callback(null, groupFullData, idps);
                                });
                        }
                    },
                    //find pictures for posters
                    function (groupFullData, idps, callback) {
                        for (var i = 0; i < idps.length; i++) {
                            idps[i] = idps[i].toString();
                        }
                        Student.find()
                            .where({user_id: idps})
                            .exec(function (err, student) {
                                if (student) {

                                    for (var i = 0; i < student.length; i++) {
                                        for (var j = 0; j < groupFullData.length; j++) {
                                            if (groupFullData[j].user_id == student[i].user_id) {
                                                groupFullData[j].profileImage = student[i].profile_image;

                                            }
                                        }
                                    }
                                }
                                return res.send(groupFullData, 200);
                                //callback(null, groupFullData);
                            });
                    }
                ]);
            }
        }


    },

    destroy: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group User Destroy");
            return  res.view('404');
        } else {
            var id = conversionutils.returnInteger(req.param('id'), 'Could not convert group user id'),
                userId = conversionutils.returnInteger(req.session.user.id, 'Could not convert userId'),
                groupId = conversionutils.returnInteger(req.param('groupId'), 'Could not convert userId');
            try {
                async.waterfall([
                    function (callback) {
                        callback(null);
                    },
                    function (callback) {
                        Group.checkUserRolePermissions(callback, res, groupId, userId, 'admin', 'moderator');
                    },
                    function () {
                        GroupUser.destroy({id: id}, function (err, user) {
                            if (err) {
                                sails.log.error('Error deleting group user', err);
                                res.send(err, 500);
                            } else {
                                sails.log.info("Group user deleted");
                                res.send(user, 200);
                            }
                        });
                    }
                ]);

            } catch (err) {
                return res.send({message: err.message}, 500);
            }
        }

    },

    // Used when sending requests to group
    isUserInGroup: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group User Controller");
            return  res.view('404');
        } else {
            var userId = req.session.user.id,
                groupId = conversionutils.returnInteger(req.param('group_id'), 'Could not convert group user id');
            try {
                GroupUser.find({
                    user_id: userId,
                    group_id: groupId
                }, function (err, user) {
                    if (err) {
                        sails.log.error("Error getting group user ", err);
                        res.send(err, 500);
                    } else {
                        if (user.length !== 0) {
                            if (user[0].role !== undefined && user[0].role !== "" && user[0].role !== null) {
                                sails.log.info("User is this group!");
                                return res.send(user, 200);
                            } else {
                                sails.log.info("This user is waiting for approval!");
                                return res.send({message: 'pending'}, 200);
                            }
                        } else {
                            sails.log.info("This user is new!");
                            return res.send({message: 'new'}, 200);
                        }
                    }
                });
            } catch (err) {
                return res.send({message: err.message}, 500);
            }
        }
    }
};
