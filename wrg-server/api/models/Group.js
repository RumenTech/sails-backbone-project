"use strict";

module.exports = {

    attributes: {

        name: {
            type: 'text',
            required: true
        },
        description: {
            type: 'text'
        },
        startedBy: {
            type: 'text'
        },
        twitterUrl: {
            type: 'string'
        },
        facebookUrl: {
            type: 'string'
        },
        googleUrl: {
            type: 'string'
        },
        linkedinUrl: {
            type: 'string'
        },
        websiteUrl: {
            type: 'string'
        },
        groupImage: {
            type: 'string'
        }
    },

    getMyPendingGroups: function (req, res, dbName) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group comment controller");
            return  res.view('404');
        } else {
            var userId = req.session.user.id;
            if (userId !== null && userId !== undefined && userId !== '') {
                var query = "SELECT GroupTable.* FROM " + dbName + ".public.Group as GroupTable, GroupUser WHERE" +
                    " GroupTable.id = GroupUser.group_id AND GroupUser.user_id=" + userId +
                    " AND GroupUser.status='pending'";
                Group.query(query, null, function (err, groups) {
                    try {
                        if (err) {
                            sails.log.error(err);
                            return res.send(err, 500);
                        } else {
                            sails.log.info("Pending groups for this user are found");
                            return res.send(groups.rows, 200);
                        }
                    } catch (err) {
                        sails.log.error("Error : ", err);
                        return res.send(err, 500);
                    }
                });
            } else {
                res.send({message: 'You are not a valid user'}, 500);
            }
        }
    },

    getMyGroups: function (req, res, dbName) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group comment controller");
            return  res.view('404');
        } else {
            var userId = req.session.user.id;
            if (userId !== null && userId !== undefined && userId !== '') {
                var query = "SELECT GroupTable.* FROM " + dbName + ".public.Group as GroupTable, GroupUser WHERE" +
                    " GroupTable.id = GroupUser.group_id AND GroupUser.user_id=" + userId +
                    " AND GroupUser.status<>'pending'";
                Group.query(query, null, function (err, groups) {
                    try {
                        if (err) {
                            sails.log.error(err);
                            return res.send(err, 500);
                        } else {
                            sails.log.info("Groups for this user are found");
                            return res.send(groups.rows, 200);
                        }
                    } catch (err) {
                        sails.log.error("Error : ", err);
                        return res.send(err, 500);
                    }
                });
            } else {
                res.send({message: 'You are not a valid user'}, 500);
            }
        }
    },

    // Groups where requesting user is administrator
    getAdminGroups: function (req, res, dbName) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group comment controller");
            return  res.view('404');
        } else {
            var userId = req.session.user.id;
            if (userId !== null && userId !== undefined && userId !== '') {
                var query = "SELECT GroupTable.* FROM " + dbName + ".public.Group as GroupTable, GroupUser WHERE" +
                    " GroupTable.id = GroupUser.group_id AND GroupUser.role = 'admin' AND GroupUser.user_id=" + userId +
                    " AND GroupUser.status<>'pending'";
                Group.query(query, null, function (err, groups) {
                    try {
                        if (err) {
                            sails.log.error(err);
                            return res.send(err, 500);
                        } else {
                            sails.log.info("Groups for this user are found");
                            return res.send(groups.rows, 200);
                        }
                    } catch (err) {
                        sails.log.error("Error : ", err);
                        return res.send(err, 500);
                    }
                });
            } else {
                res.send({message: 'You are not a valid user'}, 500);
            }
        }
    },

    checkUserRolePermissions: function (callback, res, id, userId, adminRole, moderatorRole) {
        GroupUser.find({
            group_id: id,
            user_id: userId
        }).done(function (err, groupUser) {
                if (err) {
                    return res.send({message: err}, 500);
                } else {
                    if (groupUser.length > 1) {
                        sails.log.error('Bad db data, one user - one group multiple times');
                        return res.send({message: 'Bad data'}, 500);
                    } else {
                        if (adminRole && moderatorRole) {
                            if (groupUser[0].role === adminRole || groupUser[0].role === moderatorRole) {
                                sails.log.error('   This user has permissions', groupUser[0].role);
                                callback(null);
                            } else {
                                sails.log.error('No, not authorized for update');
                                return res.send({message: 'Not authorized for update'}, 500);
                            }
                        } else if (moderatorRole === null) {
                            if (groupUser[0].role === adminRole) {
                                sails.log.error('   This user has permissions', groupUser[0].role);
                                callback(null);
                            } else {
                                sails.log.error('No, not authorized for update');
                                return res.send({message: 'Not authorized for update'}, 500);
                            }
                        }
                    }
                }
            });
    },

    checkIfUserIsInGroup: function (res, userId, groupId, callback) {
        var userIdInt = conversionutils.returnInteger(userId, 'Cannot convert user id - Group'),
            groupIdInt = conversionutils.returnInteger(groupId, 'Cannot convert group id - Group', 'group');
        GroupUser.find({
            group_id: groupIdInt,
            user_id: userIdInt
        }).done(function (err, user) {
                if (err) {
                    sails.log.error('Error finding group user');
                    return res.send({message: err}, 500);
                } else {
                    if (user.length !== 0) {
                        if (user[0].role !== undefined && user[0].role !== "" && user[0].role !== null) {
                            sails.log.info('User is in this group!');
                            callback(null);
                        } else {
                            sails.log.info('This user is waiting for approval');
                            return res.send({message: err}, 500);
                        }
                    } else {
                        sails.log.info('Check: This user is not in this group');
                        return res.send({message: err}, 500);
                    }
                }
            });
    },

    findGroup: function (res, groupId, fullData, callback) {
        try{
            Group.find({
                id: groupId
            }).done(function (err, groupFullData) {
                if (err) {
                    return res.send({message: err}, 500);
                } else {
                    sails.log.info('Group data fetched');
                    fullData = groupFullData[0];
                    callback(null, fullData);
                }
            });
        }
        catch (err){
            sails.log.error('Error occured: ' + err.message);
            return  res.send({message: err}, 500);
        }
    },

    findGroupEvents: function (res, groupFullData, callback) {
        try{
            GroupEvent.find({
                group_id: groupFullData.id
            }).done(function (err, groupEventData) {
                if (err) {
                    return res.send({message: err}, 500);
                } else {
                    var currentDate = new Date();
                    var events = [];
                    for (var i = 0; i < groupEventData.length; i++) {
                        if(groupEventData[i].date >= currentDate){
                            var event = groupEventData[i];
                            var datetime = event.date;
                            event.date = GroupEvent.getDateFormat(datetime);
                            events.push(event);
                        }
                    }
                    groupFullData.events = events;
                    sails.log.info('Group event Data fetched');
                    callback(null, groupFullData);
                }
            });
        }
        catch (err){
            sails.log.error('Error occured: ' + err.message);
            return  res.send({message: err}, 500);
        }
    },

    findGroupMedia: function (res, groupFullData, callback) {
        GroupMedia.find({
            group_id: groupFullData.id
        }).done(function (err, groupMediaData) {
                if (err) {
                    return res.send({message: err}, 500);
                } else {
                    groupFullData.media = groupMediaData;
                    sails.log.info('Starting to fetch Group Media');
                    callback(null, groupFullData);
                }
            });
    },

    findGroupUsers: function (res, groupFullData, callback, readonly) {
        GroupUser.find({
            group_id: groupFullData.id
        }).done(function (err, groupUsersData) {
                if (err) {
                    return res.send({message: err}, 500);
                } else {
                    if (readonly) {
                        for (var i = 0; i<groupUsersData.length; i++) {
                            if(groupUsersData[i].status === 'pending') {
                                groupUsersData.splice(i, 1);
                            }
                        }
                    }
                    groupFullData.users = groupUsersData;
                    sails.log.info('Starting to get user names');
                    callback(null, groupFullData);
                }
            });
    },

    findUsersNames: function (res, groupFullData, callback) {
        var usersLength = groupFullData.users.length;
        if (groupFullData.users) {
            var ids = [];
            for (var i = 0; i < usersLength; i++) {
                ids[i] = groupFullData.users[i].user_id;
            }
            User.find()
                .where({id: ids})
                .exec(function (err, users) {
                    for (var i = 0; i < users.length; i++) {
                        for (var j = 0; j < users.length; j++) {
                            if (groupFullData.users[j].user_id === users[i].id) {
                                groupFullData.users[j].firstName = users[i].first_name;
                                groupFullData.users[j].lastName = users[i].last_name;
                            }
                        }
                    }
                    callback(null, groupFullData, ids);
                });
        }
    },

    findUsersPhotos: function (res, ids, groupFullData, callback) {
        for (var i = 0; i < ids.length; i++) {
            ids[i] = ids[i].toString();
        }
        Student.find()
            .where({user_id: ids})
            .exec(function (err, student) {
                for (var i = 0; i < student.length; i++) {
                    for (var j = 0; j < student.length; j++) {
                        var studentId = conversionutils.returnInteger(student[i].user_id);
                        if (groupFullData.users[j].user_id === studentId) {
                            var profileImage = student[i].profile_image;
                            if (profileImage === null || profileImage === undefined) {
                                profileImage = 'http://placehold.it/100x100';
                            }
                            groupFullData.users[j].profileImage = profileImage;
                        }
                    }
                }
                if(callback) {
                    // For regular view
                    callback(null, groupFullData);
                } else {
                    // For read only view
                    res.send(groupFullData, 200);
                }

            });
    },

    checkIfUserIsAdmin: function (res, userId, groupId, groupFullData) {
        var role = 'admin';
        GroupUser.find()
            .where({user_id: userId})
            .where({group_id: groupId })
            .exec(function (err, users) {
                var userRole = users[0].role;
                if (userRole === 'admin' || userRole === 'moderator') {
                    sails.log.info('User role is: ', userRole);
                    groupFullData.media.role = userRole;
                    groupFullData.role = userRole;
                }
                return res.send(groupFullData, 200);
            });
    }

};
