/**
 * Created by Mistral on 2/5/14.
 */
/**
 * Created by Mistral on 2/3/14.
 */

"use strict";

var mc = (require('../../config/mainConfig.js')()),
    async = require('async');

module.exports = {
    create: function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Message Controller");
            return  res.view('404');
        }
        try {
            req.body.owner_id = req.body.sender_id;
            req.body.send_on = new Date();
            Message.new_update(req.body, function (err, studentmessage) {
                try {
                    if (err) {
                        sails.log.error(err);
                        return res.send(err, 500);
                    } else {
                        return res.send(studentmessage, 200);
                    }
                } catch (err) {
                    return res.send({message: err.message}, 500);
                }
            });

            req.body.owner_id = req.body.receiver_id;
            req.body.is_read = false;
            Message.new_update(req.body, function (err, studentmessage) {
                try {
                    if (err) {
                        return res.send(err, 500);
                    } else {

                        return res.send(studentmessage, 200);
                    }
                } catch (err) {
                    return res.send({message: err.message}, 500);
                }
            });

        } catch (err) {
            return res.send({message: err.message}, 500);
        }
    },

    update: function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Message Controller");
            return  res.view('404');
        }
        if (req.session.user.id !== req.body.owner_id) {
            sails.log.error("User does not have permissions to edit message.");
            return res.send({message: "You don't have permissions to edit message."}, 401);
        }

        try {
            Message.new_update(req.body, function (err, studentmessage) {
                try {
                    if (err) {
                        return res.send(err, 500);
                    } else {

                        return res.send(studentmessage, 200);
                    }
                } catch (err) {
                    return res.send({message: err.message}, 500);
                }
            });
        } catch (err) {
            return res.send({message: err.message}, 500);
        }
    },

    destroy: function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Message Controller");
            return  res.view('404');
        }

        if (req.session.user.id !== req.body.owner_id) {
            sails.log.error("User does not have permissions to edit message.");
            return res.send({message: "You don't have permissions to delete message."}, 401);
        }

        try {
            Message.new_update(req.session.req.body, function (err, studentmessage) {
                try {
                    if (err) {
                        return res.send(err, 500);
                    } else {
                        sails.log.info('Message deleted');
                        return res.send(studentmessage, 200);
                    }
                } catch (err) {
                    return res.send({message: err.message}, 500);
                }
            }, 'remove');
        } catch (err) {
            return res.send({message: err.message}, 500);
        }
    },

    findMessages: function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Message Controller");
            return  res.view('404');
        }

        try {
            var user_id = req.session.user.id;

            var limit = req.param('limit');
            limit = limit || 5;

            var offset = req.param('offset');
            offset = offset || 0;
            async.waterfall([
                function(callback){
                    Message.find()
                        .where({receiver_id: user_id, sender_id: null, is_deleted: false})
                        .exec(function (err, message) {
                            if (err) {
                                return res.send({message: err.message}, 500);
                            } else {
                                callback(null, message);
                            }
                        });
                },
                function (message) {
                    var query = "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Student.profile_image as messageImage " +
                        "from Message  join Student on Message.sender_id = cast(Student.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable" +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, AlumniStory.profile_image as messageImage " +
                        "from Message  join AlumniStory on Message.sender_id = cast(AlumniStory.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Company.profile_image as messageImage " +
                        "from Message  join CompanyUser on Message.sender_id = cast(CompanyUser.user_id as int) join Company on CompanyUser.company_id = Company.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, College.profile_image as messageImage " +
                        "from Message  join CollegeUser on Message.sender_id = cast(CollegeUser.user_id as int) join College on CollegeUser.college_id = College.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false +
                        " LIMIT " + limit + " OFFSET " + offset;


                   // query = "select MessageTable.* from (" + query + ") as MessageTable ORDER BY MessageTable.send_on DESC";

                    Message.query(query, null,
                        function (err, receivedmessages) {
                            try {
                                if (err) {
                                    sails.log.error(err);
                                    res.send(err.message, 500);
                                } else {
                                    if( message ) {
                                        for (var i = 0; i<message.length; i++) {
                                            message[i].first_name = 'WRG Team';
                                            message[i].messageimage = mc.appSettings.wrgImageUrl;
                                            receivedmessages.rows[receivedmessages.rowCount + i] = message[i];
                                        }
                                    }
                                    receivedmessages.rows.sort(function(a, b) {
                                        a = new Date(a.send_on);
                                        b = new Date(b.send_on);
                                        return a>b ? -1 : a<b ? 1 : 0;
                                    });
                                    return res.send({request: receivedmessages.rows}, 200);
                                }
                            } catch (err) {
                                sails.log.error(err);
                                return res.send(err.message, 500);
                            }
                        });
                }
            ]);


        }
        catch (err) {
            return res.send({message: err.message}, 500);
        }

    },

    findUnreadMessages: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Message Controller");
            return  res.view('404');
        }
        try {
            var user_id = req.session.user.id;

            var limit = req.param('limit');
            limit = limit || 5;

            var offset = req.param('offset');
            offset = offset || 0;
            async.waterfall([
                function(callback){
                    Message.find()
                        .where({receiver_id: user_id, sender_id: null, is_deleted: false, is_read:false})
                        .exec(function (err, message) {
                            if (err) {
                                return res.send({message: err.message}, 500);
                            } else {
                                callback(null, message);
                            }
                        });
                },
                function (message) {
                    var query = "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Student.profile_image as messageImage " +
                        "from Message  join Student on Message.sender_id = cast(Student.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable" +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false + " AND Message.is_read=" + false +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, AlumniStory.profile_image as messageImage " +
                        "from Message  join AlumniStory on Message.sender_id = cast(AlumniStory.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false + " AND Message.is_read=" + false +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Company.profile_image as messageImage " +
                        "from Message  join CompanyUser on Message.sender_id = cast(CompanyUser.user_id as int) join Company on CompanyUser.company_id = Company.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false + " AND Message.is_read=" + false +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, College.profile_image as messageImage " +
                        "from Message  join CollegeUser on Message.sender_id = cast(CollegeUser.user_id as int) join College on CollegeUser.college_id = College.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false + " AND Message.is_read=" + false +
                        " LIMIT " + limit + " OFFSET " + offset;


                    Message.query(query, null,
                        function (err, unreadMessages) {
                            try {
                                if (err) {
                                    sails.log.error(err);
                                    res.send(err.message, 500);
                                } else {
                                    if( message ) {
                                        for (var i = 0; i<message.length; i++) {
                                            message[i].first_name = 'WRG Team';
                                            message[i].messageimage = mc.appSettings.wrgImageUrl;
                                            unreadMessages.rows[unreadMessages.rowCount + i] = message[i];
                                        }
                                    }
                                    unreadMessages.rows.sort(function(a, b) {
                                        a = new Date(a.send_on);
                                        b = new Date(b.send_on);
                                        return a>b ? -1 : a<b ? 1 : 0;
                                    });
                                    sails.log.info("Found unread messages");
                                    return res.send({request: unreadMessages.rows}, 200);
                                }
                            } catch (err) {
                                sails.log.error(err);
                                return res.send(err.message, 500);
                            }
                        });
                }
            ]);


        }
        catch (err) {
            return res.send({message: err.message}, 500);
        }

    },

    findFlaggedMessages: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Message Controller");
            return  res.view('404');
        }
        var user_id = req.session.user.id;

        var limit = req.param('limit');
        limit = limit || 5;

        var offset = req.param('offset');
        offset = offset || 0;

        var query = "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Student.profile_image as messageImage " +
            "from Message  join Student on Message.sender_id = cast(Student.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable" +
            " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false + " AND Message.is_flagged=" + true +
            " UNION " +
            "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, AlumniStory.profile_image as messageImage " +
            "from Message  join AlumniStory on Message.sender_id = cast(AlumniStory.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
            " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false + " AND Message.is_flagged=" + true +
            " UNION " +
            "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Company.profile_image as messageImage " +
            "from Message  join CompanyUser on Message.sender_id = cast(CompanyUser.user_id as int) join Company on CompanyUser.company_id = Company.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
            " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false + " AND Message.is_flagged=" + true +
            " UNION " +
            "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, College.profile_image as messageImage " +
            "from Message  join CollegeUser on Message.sender_id = cast(CollegeUser.user_id as int) join College on CollegeUser.college_id = College.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
            " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false + " AND Message.is_flagged=" + true +
            " LIMIT " + limit + " OFFSET " + offset;

        query = "select MessageTable.* from (" + query + ") as MessageTable ORDER BY MessageTable.send_on DESC";

        Message.query(query, null, function (err, flaggedMessages) {
            try {
                if (err) {
                    sails.log.error(err);
                    res.send(err.message, 500);
                } else {
                    sails.log.info('Found flagged messages');
                    return res.send({request: flaggedMessages.rows}, 200);
                }
            } catch (err) {
                sails.log.error(err);
                return res.send(err.message, 500);
            }
        });
    },


    findSentMessages: function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Message Controller");
            return  res.view('404');
        }

        try {
            var user_id = req.session.user.id;

            var limit = req.param('limit');
            limit = limit || 5;

            var offset = req.param('offset');
            offset = offset || 0;

            var query = "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Student.profile_image as messageImage " +
                "from Message  join Student on Message.receiver_id = cast(Student.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable" +
                " WHERE  UserTable.id = Message.receiver_id  AND Message.sender_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false +
                " UNION " +
                "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, AlumniStory.profile_image as messageImage " +
                "from Message  join AlumniStory on Message.receiver_id = cast(AlumniStory.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                " WHERE  UserTable.id = Message.receiver_id  AND Message.sender_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false +
                " UNION " +
                "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Company.profile_image as messageImage " +
                "from Message  join CompanyUser on Message.receiver_id = cast(CompanyUser.user_id as int) join Company on CompanyUser.company_id = Company.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                " WHERE  UserTable.id = Message.receiver_id  AND Message.sender_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false +
                " UNION " +
                "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, College.profile_image as messageImage " +
                "from Message  join CollegeUser on Message.receiver_id = cast(CollegeUser.user_id as int) join College on CollegeUser.college_id = College.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                " WHERE  UserTable.id = Message.receiver_id  AND Message.sender_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + false +
                " LIMIT " + limit + " OFFSET " + offset;

            query = "select MessageTable.* from (" + query + ") as MessageTable ORDER BY MessageTable.send_on DESC";

            Message.query(query, null,
                function (err, receivedmessages) {
                    try {
                        if (err) {
                            sails.log.error(err);
                            res.send(err.message, 500);
                        } else {
                            sails.log.info("found sent messages");
                            return res.send({request: receivedmessages.rows}, 200);
                        }
                    } catch (err) {
                        sails.log.error(err);
                        return res.send(err.message, 500);
                    }
                });
        }
        catch (err) {
            return res.send({message: err.message}, 500);
        }

    },

    findDeletedMessages: function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Message Controller");
            return  res.view('404');
        }

        try {
            var user_id = req.session.user.id;

            var limit = req.param('limit');
            limit = limit || 5;

            var offset = req.param('offset');
            offset = offset || 0;
            async.waterfall([
                function(callback){
                    Message.find()
                        .where({receiver_id: user_id, sender_id: null, is_deleted: true})
                        .exec(function (err, message) {
                            if (err) {
                                return res.send({message: err.message}, 500);
                            } else {
                                callback(null, message);
                            }
                        });
                },
                function (message) {
                    var query = "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Student.profile_image as messageImage " +
                        "from Message  join Student on Message.sender_id = cast(Student.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable" +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + true +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, AlumniStory.profile_image as messageImage " +
                        "from Message  join AlumniStory on Message.sender_id = cast(AlumniStory.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + true +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Company.profile_image as messageImage " +
                        "from Message  join CompanyUser on Message.sender_id = cast(CompanyUser.user_id as int) join Company on CompanyUser.company_id = Company.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + true +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, College.profile_image as messageImage " +
                        "from Message  join CollegeUser on Message.sender_id = cast(CollegeUser.user_id as int) join College on CollegeUser.college_id = College.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.sender_id  AND Message.receiver_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + true +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Student.profile_image as messageImage " +
                        "from Message  join Student on Message.receiver_id = cast(Student.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable" +
                        " WHERE  UserTable.id = Message.receiver_id  AND Message.sender_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + true +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, AlumniStory.profile_image as messageImage " +
                        "from Message  join AlumniStory on Message.receiver_id = cast(AlumniStory.user_id as int) LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.receiver_id  AND Message.sender_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + true +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, Company.profile_image as messageImage " +
                        "from Message  join CompanyUser on Message.receiver_id = cast(CompanyUser.user_id as int) join Company on CompanyUser.company_id = Company.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.receiver_id  AND Message.sender_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + true +
                        " UNION " +
                        "SELECT Message.*, UserTable.first_name, UserTable.last_name, GroupTable.name, College.profile_image as messageImage " +
                        "from Message  join CollegeUser on Message.receiver_id = cast(CollegeUser.user_id as int) join College on CollegeUser.college_id = College.id LEFT OUTER JOIN " + mc.dbSettings.dbName + ".public.Group as GroupTable on Message.group_id = GroupTable.id, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE  UserTable.id = Message.receiver_id  AND Message.sender_id = " + user_id + "AND Message.owner_id = " + user_id + " AND Message.is_deleted =" + true +
                        " LIMIT " + limit + " OFFSET " + offset;


                    // query = "select MessageTable.* from (" + query + ") as MessageTable ORDER BY MessageTable.send_on DESC";

                    Message.query(query, null,
                        function (err, deletedmessages) {
                            try {
                                if (err) {
                                    sails.log.error(err);
                                    res.send(err.message, 500);
                                } else {
                                    if( message ) {
                                        for (var i = 0; i<message.length; i++) {
                                            message[i].first_name = 'WRG Team';
                                            message[i].messageimage = mc.appSettings.wrgImageUrl;
                                            deletedmessages.rows[deletedmessages.rowCount + i] = message[i];
                                        }
                                    }

                                    var deletedmessageslist = deletedmessages.rows;
                                    for (var i = 0; i < deletedmessageslist.length; i++) {
                                        if (deletedmessageslist[i].receiver_id === user_id) {
                                            deletedmessageslist[i].from = {};
                                            deletedmessageslist[i].from = true;
                                        }
                                        else {
                                            deletedmessageslist[i].from = {};
                                            deletedmessageslist[i].from = false;
                                        }
                                    }
                                    sails.log.info('Found deleted messages');

                                    deletedmessageslist.sort(function(a, b) {
                                        a = new Date(a.send_on);
                                        b = new Date(b.send_on);
                                        return a>b ? -1 : a<b ? 1 : 0;
                                    });
                                    return res.send({request: deletedmessageslist}, 200);
                                }
                            } catch (err) {
                                sails.log.error(err);
                                return res.send(err.message, 500);
                            }
                        });
                }
            ]);


        }
        catch (err) {
            return res.send({message: err.message}, 500);
        }


    },

    searchReceivers: function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Message Controller");
            return  res.view('404');
        }

        try {
            var receiversearch = req.param('receiversearch');
            receiversearch = receiversearch || '';

            var location = req.param('location');
            location = location || '';

            var limit = req.param('limit');
            limit = limit || 10;

            var query = "SELECT UserTable.first_name , UserTable.last_name , UserTable.username, UserTable.id " +
                "from " + mc.dbSettings.dbName + ".public.User as UserTable " +
                " WHERE  (lower(UserTable.first_name) LIKE lower('%" + receiversearch + "%') OR lower(UserTable.last_name) LIKE lower('%" + receiversearch + "%')) " +
                " LIMIT " + limit;

            User.query(query, null,
                function (err, users) {
                    try {
                        if (err) {
                            sails.log.error(err);
                            res.send(err.message, 500);
                        } else {

                            return res.send({request: users.rows}, 200);
                        }
                    } catch (err) {
                        sails.log.error(err);
                        return res.send(err.message, 500);
                    }
                });
        } catch (err) {
            return res.send({message: err.message}, 500);
        }
    },

    getNumberOfUnreadMessages: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Message Controller");
            return  res.view('404');
        }

        try {
            var user_id = req.session.user.id;
            Message.find()
                .where({receiver_id: user_id, owner_id: user_id, is_read: false})
                .done(function (err, messages) {
                    if (err) {
                        return res.send({message: err}, 500);
                    } else {
                        sails.log.info('Found ' + messages.length + ' unread messages');
                        return res.send(messages, 200);
                    }
                });
        } catch (err) {
            return res.send({message: err.message}, 500);
        }
    },

    _config: {}
};


