'use strict';


var mc = (require('../../config/mainConfig.js')());
var async = require('async');

module.exports = {

    find: function (req, res) {
        var user_id = req.param('id');
        AlumniStory.findOneByUser_id(user_id).done(function (err, alumni) {

            // Error handling
            if (err) {
                console.log(err);
                return res.send(err, 500);
                // The Books were found successfully!
            } else {
                console.log("Alumni found to:", user_id);
                return res.send(alumni, 200);
            }
        });
    },

    me: function (req, res) {

        var user_id = req.session.user.id;

        AlumniStory.findOneByUser_id(user_id).done(function (err, alumni) {

            // Error handling
            if (err) {
                console.log(err);
                return res.send(err, 500);
                // The Books were found successfully!
            } else {
                console.log("Alumni found to:", user_id);
                alumni.first_name = req.user.first_name;
                alumni.last_name = req.user.last_name;
                alumni.email = req.user.username;
                return res.send(alumni, 200);
            }
        });
    },

    you: function (req, res) {

        async.waterfall([
            function (callback) {
                var userId = req.session.user.id,
                    myId = req.query.id,
                    userRole = req.session.user.role,
                    query = "SELECT COUNT(*) FROM connection " +
                        " WHERE (user_id = " + userId + " AND request_user_id = " + myId + " AND confirmation = 1)" +
                        " OR (user_id = " + myId + " AND request_user_id = " + userId + " AND confirmation = 1)";
                var role = null;
                if (userRole === "student" || userRole === "alumni") {
                    Connection.query(query, null, function (err, status) {
                        try {
                            if (err) {
                                sails.log.info(err.message);
                                return res.send(err.message, 500);

                            } else {
                                if (status.rows[0].count == 2) {
                                    callback(null, userId, myId, role);
                                }
                                else {
                                    sails.log.info("Requested user is not your friend");
                                    role = 'general';
                                    callback(null, userId, myId, role);
                                }
                            }
                        } catch (err) {
                            return res.send(err.message, 500);
                        }
                    });
                }
                else {
                    callback(null, userId, myId, role);
                }
            },
            function (userId, myId, role, callback) {

               var query = "SELECT COUNT(*) FROM connection " +
                    " WHERE (user_id = " + userId + " AND request_user_id = " + myId + " )" +
                    " OR (user_id = " + myId + " AND request_user_id = " + userId + " )";

                if (req.session.user.role === "student" || req.session.user.role === "alumni") {
                    Connection.query(query, null, function (err, status) {
                        try {
                            if (err) {
                                sails.log.info(err.message);
                                return res.send(err.message, 500);

                            } else {
                                if (status.rows[0].count > 0) {
                                    var friendRequest = "send";
                                    callback(null, userId, myId, role, friendRequest);
                                }
                                else {
                                    sails.log.info("Requested user is not your friend");
                                    callback(null, userId, myId, role, null);
                                }
                            }
                        } catch (err) {
                            return res.send(err.message, 500);
                        }
                    });
                }
                else {
                    callback(null, userId, myId, role, null);
                }
            },
            function (userId, myId, role, friendRequest, callback) {
                AlumniStory.findOneByUser_id(myId).done(function (err, alumni) {
                    if (err) {
                        console.log(err);
                        return res.send(err, 500);
                    } else {
                        if (friendRequest !== 'send') {
                            alumni.viewer = role;
                        }
                        callback(null, alumni, userId, myId, role);
                    }
                });
            },
            function (alumni, userId, myId, role, callback) {
                var query = "SELECT Connection.user_id,Connection.request_user_id,UserTable.first_name,UserTable.last_name , " +
                    " StudentTable.id as student_id, AlumniTable.id as alumni_id, " +
                    "    CASE WHEN StudentTable.id > 0 THEN StudentTable.profile_image " +
                    " ELSE AlumniTable.profile_image " +
                    " END as profile_image, " +
                    "    CASE WHEN StudentTable.id > 0 THEN StudentTable.major  || ' at ' ||  StudentTable.school " +
                    " ELSE AlumniTable.job_title  || ' at ' ||  AlumniTable.company " +
                    " END as information " +
                    " FROM Connection, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                    " LEFT JOIN " + mc.dbSettings.dbName + ".public.Student as StudentTable ON CAST(StudentTable.user_id as float)= cast(UserTable.id as FLOAT) " +
                    " LEFT JOIN " + mc.dbSettings.dbName + ".public.AlumniStory as AlumniTable ON CAST(AlumniTable.user_id as float)= cast(UserTable.id as FLOAT) " +
                    " WHERE Connection.user_id = '" + myId + "' AND Connection.confirmation ='1' AND " +
                    " CAST(UserTable.id as FLOAT)= CAST(Connection.request_user_id as FLOAT) " +
                    " GROUP BY Connection.user_id,Connection.request_user_id,UserTable.first_name,UserTable.last_name ,StudentTable.id,AlumniTable.id";

                Connection.query(query, null, function (err, connections) {
                    try {
                        if (err) {
                            sails.log.info(err.message);
                            return res.send(err.message, 500);

                        } else {
                            alumni.connections = connections.rows;
                            AlumniStory.getUser(userId, myId, res, alumni, role);
                        }
                    } catch (err) {
                        return res.send(err.message, 500);
                    }
                });
            }
        ]);
    },

    filter: function (req, res) {
        try {
            //this can be a part of first/last name, activities or advices
            var user_id = req.session.user.id;
            var name = req.param('name');
            name = name || '';

            var company = req.param('company');
            company = company || '';

            var major = req.param('major');
            major = major || '';


            var limit = req.param('limit');
            limit = limit || 12;

            var offset = req.param('offset');
            offset = offset || 0;

            async.waterfall([
                function (callback) {
                    var query;
                    if (req.session.user.role === 'student') {
                        query = "SELECT school FROM student WHERE CAST(user_id as FLOAT) = " + req.session.user.id;
                    }
                    else {
                        query = "SELECT alma_mater FROM AlumniStory WHERE CAST(user_id as FLOAT) = " + req.session.user.id;
                    }
                    Student.query(query, null, function (err, resp) {
                        if (err) {
                            sails.log.error('Error: ' + error);
                            res.send(err, 500);
                        }
                        else {
                            if (resp.rows[0]) {
                                var currentUserSchool = resp.rows[0].school || resp.rows[0].alma_mater;
                                callback(null, currentUserSchool);
                            }
                            else {
                                res.send(err, 500);
                            }

                        }
                    })
                },
                function (currentUserSchool) {
                    var query = "SELECT AlumniStory.*,UserTable.first_name,UserTable.last_name " +
                        " FROM AlumniStory, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE CAST(UserTable.id as FLOAT)= CAST(AlumniStory.user_id as FLOAT) and " +
                        " (lower(concat(UserTable.first_name, ' ', UserTable.last_name)) LIKE lower('%" + name + "%') OR " +
                        " AlumniStory.activities LIKE lower('%" + name + "%') OR AlumniStory.advice LIKE '%" + name + "%' )" +
                        " AND ( " +
                        "       (lower(AlumniStory.company) LIKE lower('%" + company + "%') AND UserTable.role = 'alumni') " +
                        "  ) " +
                        " AND ( " +
                        "       (lower(AlumniStory.major) LIKE lower('%" + major + "%') AND UserTable.role = 'alumni') " +
                        "  ) " +
                        " AND UserTable.id <> '" + req.session.user.id + "'" +
                        " ORDER BY AlumniStory.alma_mater = '" + currentUserSchool + "' DESC, NULLIF(AlumniStory.profile_image, '') DESC NULLS LAST" +
                        " LIMIT " + limit + " OFFSET " + offset;

                    AlumniStory.query(query, null, function (err, alumni) {
                        try {
                            if (err) {
                                sails.log.error('Error: ' + err);
                                return res.send(err, 500);
                            } else {
                                delete alumni.fields;
                                delete alumni._parsers;
                                delete alumni.command;
                                delete alumni.oid;
                                return res.send(alumni, 200);
                            }
                        } catch (err) {
                            sails.log.error('Error: ' + err);
                            return res.send(err, 500);
                        }
                    });
                }
            ]);
        } catch (err) {
            sails.log.error('Error: ' + err);
            return res.send(err, 500);
        }
    },

    create: function (req, res) {
        return res.send('Function disabled', 200);
    }
};
