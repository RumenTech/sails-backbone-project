/**
 * StudentController
 *
 * @module        :: Controller
 * @description    :: Contains logic for handling requests.
 */


"use strict";

var mc = (require('../../config/mainConfig.js')());
var async = require('async');


module.exports = {

    find: function (req, res) {

        var user_id = req.param('id');
        Student.findOneByUser_id(user_id).done(function (err, student) {

            // Error handling
            if (err || student == undefined) {
                sails.log.error("Student not found", err);
                return res.send(err, 500);
            } else {
                sails.log.info("Student found for UserId:", user_id);
                Award.find({
                    student_id: student.id
                }).done(function (err, award) {
                        if (err) {
                            sails.log.error(err);
                            return res.send(err, 500);
                        } else {
                            sails.log.error('    Awards found for student: ', student.id);
                            student.awards = award;
                            // Skills
                            Experience.find({
                                student_id: student.id
                            }).done(function (err, experience) {
                                    if (err) {
                                        sails.log.error(err);
                                        return res.send(err, 500);
                                    } else {
                                        sails.log.info('     Experiences found for student: ', student.id);
                                        student.experiences = experience;

                                        var ranking = [];
                                        ranking[1] = 0;
                                        ranking[2] = 0;
                                        ranking[3] = 0;
                                        ranking[4] = 0;
                                        ranking[5] = 0;
                                        ranking[6] = 0;
                                        ranking[7] = 0;

                                        //Projects

                                        if (experience.length > 0) {
                                            var array_where = [];
                                            for (var i = 0; i < experience.length; i++) {
                                                array_where[i] = {experience_id: experience[i].id};
                                            }

                                            //Categories

                                            ExperienceCategory.find(
                                                {
                                                    where: {
                                                        or: array_where
                                                    }
                                                }
                                            ).done(
                                                function (err, expcat) {

                                                    if (err) {
                                                        sails.log.error(err);
                                                        return res.send(err, 500);
                                                    } else {
                                                        sails.log.info('Categories for student: ', student.id);
                                                        for (var i = 0; i < expcat.length; i++) {
                                                            for (var j = 0; j < student.experiences.length; j++) {
                                                                if (student.experiences[j].categories === undefined) {
                                                                    student.experiences[j].categories = [];
                                                                }
                                                                if (student.experiences[j].id === expcat[i].experience_id) {
                                                                    student.experiences[j].categories[student.experiences[j].categories.length] = expcat[i];
                                                                }
                                                            }
                                                            ranking[expcat[i].category_id]++;
                                                        }

                                                        //RANKING
                                                        sails.log.info('    Calculate rank for student: ', student.id);
                                                        student.ranking = ranking;
                                                        return res.send(student, 200);
                                                    }
                                                }
                                            );

                                        }
                                        else {
                                            student.ranking = ranking;
                                            return res.send(student, 200);
                                        }
                                    }
                                });

                        }
                    });
            }
        });

    },

    update: function (req, res) {
        if (!req.isAuthenticated()) {
            return  res.view('404');
        }
        try {
            var userId = req.session.user.id,
                schoolListId = req.body.school_list_id;
            // In case that student changes his school, all previous records from Dashboard should be deleted
            async.waterfall([
                function (callback) {
                    Student.find()
                        .where({user_id: userId})
                        .exec(function(err, student) {
                              if(err) {
                                  sails.log.error('Cannot get student data for user id: ', userId);
                                  res.send(err, 500);
                              } else {
                                   if(student[0].school_list_id !== schoolListId) {
                                        // School has been changed, clear Dashboard
                                       sails.log.info('school_list_id: ', student.school_list_id);
                                       sails.log.info('schoolListId: ', schoolListId);
                                       callback(null, schoolListId);
                                   } else {
                                       //Just Continue
                                       schoolListId = null;
                                       callback(null, schoolListId);
                                   }
                              }
                        });
                },
                function(schoolListId, callback) {
                    if(schoolListId !== null){
                        Dashboard.destroy({user_id: userId}).done(function (err) {
                            if (err) {
                                return res.send({message: err}, 500);
                            } else {
                                sails.log.info('Dashboard for user ' + userId + ' destroyed');
                                callback(null);
                            }
                        });
                    } else {
                        callback(null);
                    }

                },
                function(){
                    Student.update({user_id: userId}, req.body, function (err, student) {
                        if (err) {
                            sails.log.error("Error updating student: ", err);
                            res.send(err, 500);
                        } else {
                            sails.log.info("Student updated");
                            res.send(student, 200);
                        }
                    });
                }
            ]);

        } catch (err) {
            return res.send({message: err.message}, 500);
        }
    },

    searchJobs: function (req, res) {

        if (!req.isAuthenticated()) {
            return  res.view('404');
        }

        if (req.param('applied') === 'true') {
            Student.findAppliedJobs(req, res);
        } else {
            try {
                var jobsearch = req.param('jobsearch');
                jobsearch = jobsearch || '';

                var location = req.param('location');
                location = location || '';

                var limit = req.param('limit');
                limit = limit || 10;

                var query = "SELECT Job.*, Company.name as company_name, Company.state as company_state, Company.city as company_city," +
                    " Company.company_size as company_size, Company.company_website as company_web, Company.facebook_url as company_fb, " +
                    " Company.twitter_url as company_tw, Company.google_url as company_gplus, Company.linkedin_url as company_linkedin, Company.tagline as company_tagline, Company.profile_image as company_image " +
                    " FROM Job, Company " +
                    " WHERE  Job.company_id = Company.id AND (lower(job_title) LIKE lower('%" + jobsearch + "%') OR lower(Company.name) LIKE lower('%" + jobsearch + "%')) AND lower(location) LIKE lower('%" + location + "%') " +
                    " ORDER BY Job.date desc LIMIT " + limit;

                Job.query(query, null,
                    function (err, jobs) {
                        try {
                            if (err) {
                                sails.log.error(err);
                                res.send(err.message, 500);
                            } else {
                                var jobslist = jobs.rows;
                                for (var i = 0; i < jobslist.length; i++) {
                                    var datetime = jobslist[i].createdAt;
                                    jobslist[i].postedOn = datetime.toDateString();
                                }
                                return res.send({request: jobslist}, 200);
                            }
                        } catch (err) {
                            sails.log.error(err);
                            return res.send(err.message, 500);
                        }
                    });
            } catch (err) {
                return res.send({message: err.message}, 500);
            }
        }
    },

    searchChallenges: function (req, res) {

        if (!req.isAuthenticated()) {
            return  res.view('404');
        }

        try {
            var challengesearch = req.param('challengesearch');
            challengesearch = challengesearch || '';

            var location = req.param('location');
            location = location || '';

            var limit = req.param('limit');
            limit = limit || 10;

            var query = "SELECT Challenge.*, Company.name as company_name, Company.state as company_state, Company.city as company_city, Company.company_size as company_size, Company.company_website as company_web, Company.facebook_url as company_fb, Company.twitter_url as company_tw, Company.google_url as company_gplus, Company.linkedin_url as company_linkedin, Company.tagline as company_tagline, Company.profile_image as company_image " +
                "FROM Challenge, Company " +
                "WHERE  Challenge.company_id = Company.id AND (lower(challenge_title) LIKE lower('%" + challengesearch + "%') OR lower(Company.name) LIKE lower('%" + challengesearch + "%')) AND lower(location) LIKE lower('%" + location + "%') " +
                "LIMIT " + limit;

            Challenge.query(query, null,
                function (err, challenges) {
                    try {
                        if (err) {
                            sails.log.error(err);
                            res.send(err.message, 500);
                        } else {
                            var challengeslist = challenges.rows;
                            for (var i = 0; i < challengeslist.length; i++) {
                                var datetime = challengeslist[i].createdAt;
                                challengeslist[i].postedOn = datetime.toDateString();
                            }
                            return res.send({request: challengeslist}, 200);
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

    findMessages: function (req, res) {

        try {
            var user_id = req.session.user.id;

            var query = "SELECT Message.*, UserTable.first_name, UserTable.last_name " +
                "from Message ," + mc.dbSettings.dbName + ".public.User as UserTable " +
                " WHERE  UserTable.id = Message.sender_id AND Message.receiver_id = " + user_id;


            Message.query(query, null,
                function (err, receivedmessages) {
                    try {
                        if (err) {
                            sails.log.error(err);
                            res.send(err.message, 500);
                        } else {

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

    findLeaders: function (req, res) {


        if (!req.isAuthenticated()) {
            return  res.view('404');
        }

        async.waterfall([
            function (callback) {
                try {


                    var limit = req.param('limit');
                    limit = limit || 10;


                    var category = req.param('category');
                    category = category || 1;

                    var filter = req.param('filter');
                    filter = filter || 1;

                    var query = "";

                    if (filter == 1) {
                        query = "select S.first_name, S.last_name, S.profile_image, S.student_id, sum(S.points) " +
                            "from (SELECT  UserTable.first_name, UserTable.last_name, Student.profile_image, Student.id as student_id,SumPoints.points " +
                            "from SumPoints, Student," + mc.dbSettings.dbName + ".public.User as UserTable " +
                            "WHERE UserTable.id = cast(Student.user_id as INT)  AND Student.id = SumPoints.student_id AND  SumPoints.category_id =  " + category +
                            " UNION " +
                            "SELECT  UserTable.first_name, UserTable.last_name, Student.profile_image, Student.id as student_id, 0 " +
                            "from  Student," + mc.dbSettings.dbName + ".public.User as UserTable " +
                            "WHERE UserTable.id = cast(Student.user_id as INT) " +
                            ") as S " +
                            "group by S.first_name, S.last_name, S.profile_image, S.student_id " +
                            "order by sum(S.points) desc LIMIT " + limit;
                    }
                    if (filter == 2) {
                        query = "select S.first_name, S.last_name, S.profile_image, S.student_id, sum(S.votes) " +
                            "from (SELECT  UserTable.first_name, UserTable.last_name, Student.profile_image, Student.id as student_id,SumVotes.votes " +
                            "from SumVotes, Student," + mc.dbSettings.dbName + ".public.User as UserTable " +
                            "WHERE UserTable.id = cast(Student.user_id as INT)  AND Student.id = SumVotes.competitor_id AND  SumVotes.category_id =  " + category +
                            " UNION " +
                            "SELECT  UserTable.first_name, UserTable.last_name, Student.profile_image, Student.id as student_id, 0 " +
                            "from  Student," + mc.dbSettings.dbName + ".public.User as UserTable " +
                            "WHERE UserTable.id = cast(Student.user_id as INT) " +
                            ") as S " +
                            "group by S.first_name, S.last_name, S.profile_image, S.student_id " +
                            "order by sum(S.votes) desc LIMIT " + limit;
                    }

                    User.query(query, null,
                        function (err, students) {
                            try {
                                if (err) {
                                    sails.log.error(err);
                                    res.send(err.message, 500);
                                } else {
                                    var studentlist = students.rows;
                                    callback(null, studentlist);
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
            function (studentlist, callback) {

                if (studentlist) {
                    var idps = [];
                    for (var i = 0; i < studentlist.length; i++) {
                        idps[i] = studentlist[i].student_id;
                    }
                    SumPoints.find()
                        .where({student_id: idps})
                        .exec(function (err, points) {
                            if (points) {
                                for (var i = 0; i < points.length; i++) {
                                    for (var j = 0; j < studentlist.length; j++) {
                                        if (studentlist[j].student_id === points[i].student_id) {

                                            if (points[i].category_id === 1) {
                                                studentlist[j].internship = points[i].points;
                                            }
                                            if (points[i].category_id === 2) {
                                                studentlist[j].community = points[i].points;
                                            }
                                            if (points[i].category_id === 3) {
                                                studentlist[j].public = points[i].points;
                                            }
                                            if (points[i].category_id === 4) {
                                                studentlist[j].research = points[i].points;
                                            }
                                            if (points[i].category_id === 5) {
                                                studentlist[j].leadership = points[i].points;
                                            }
                                            if (points[i].category_id === 6) {
                                                studentlist[j].innovation = points[i].points;
                                            }
                                            if (points[i].category_id === 7) {
                                                studentlist[j].industry = points[i].points;
                                            }
                                            if (points[i].category_id === 8) {
                                                studentlist[j].grit = points[i].points;
                                            }
                                        }
                                        studentlist[j].index = j + 1;
                                    }
                                }
                            }
                            callback(null, studentlist);
                        });
                }

            },

            function (studentlist, callback) {

                if (studentlist) {
                    var idps = [];
                    for (var i = 0; i < studentlist.length; i++) {
                        idps[i] = studentlist[i].student_id;
                    }
                    SumVotes.find()
                        .where({competitor_id: idps})
                        .exec(function (err, votes) {
                            if (votes) {
                                for (var i = 0; i < votes.length; i++) {
                                    for (var j = 0; j < studentlist.length; j++) {
                                        if (studentlist[j].student_id === votes[i].competitor_id) {

                                            if (votes[i].category_id === 1) {
                                                studentlist[j].internship_votes = votes[i].votes;
                                            }
                                            if (votes[i].category_id === 2) {
                                                studentlist[j].community_votes = votes[i].votes;
                                            }
                                            if (votes[i].category_id === 3) {
                                                studentlist[j].public_votes = votes[i].votes;
                                            }
                                            if (votes[i].category_id === 4) {
                                                studentlist[j].research_votes = votes[i].votes;
                                            }
                                            if (votes[i].category_id === 5) {
                                                studentlist[j].leadership_votes = votes[i].votes;
                                            }
                                            if (votes[i].category_id === 6) {
                                                studentlist[j].innovation_votes = votes[i].votes;
                                            }
                                            if (votes[i].category_id === 7) {
                                                studentlist[j].industry_votes = votes[i].votes;
                                            }
                                            if (votes[i].category_id === 8) {
                                                studentlist[j].grit_votes = votes[i].votes;
                                            }
                                        }

                                    }
                                }
                            }
                            return res.send({request: studentlist}, 200);
                        });
                }

            }
        ]);
    },


    findSentMessages: function (req, res) {

        try {
            var user_id = req.session.user.id;

            var query = "SELECT Message.*, UserTable.first_name, UserTable.last_name " +
                "from Message ," + mc.dbSettings.dbName + ".public.User as UserTable " +
                " WHERE  UserTable.id = Message.receiver_id AND Message.sender_id = " + user_id;


            Message.query(query, null,
                function (err, receivedmessages) {
                    try {
                        if (err) {
                            sails.log.error(err);
                            res.send(err.message, 500);
                        } else {

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

    searchReceivers: function (req, res) {

        try {
            var receiversearch = req.param('receiversearch');
            receiversearch = receiversearch || '';

            var location = req.param('location');
            location = location || '';

            var limit = req.param('limit');
            limit = limit || 10;

            var query = "SELECT UserTable.first_name , UserTable.last_name , UserTable.id " +
                "from " + mc.dbSettings.dbName + ".public.User as UserTable " +
                " WHERE UserTable.role = 'student'  AND  (lower(UserTable.first_name) LIKE lower('%" + receiversearch + "%') OR lower(UserTable.last_name) LIKE lower('%" + receiversearch + "%')) " +
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

    me: function (req, res) {

        try {
            var user_id = req.session.user.id;
            //var user_id =  req.param('id');
            Student.findOneByUser_id(user_id).done(function (err, student) {
                // Error handling
                if (student === undefined) {
                    sails.log.info("Did not find student");
                    return res.send({message: 'Student is undefined'}, 500);
                }

                if (err) {
                    sails.log.error("Did not find student", err);
                    return res.send({message: err.detail}, 500);
                } else {
                    sails.log.info("Student found with user id: " + user_id);
                    student.first_name = req.user.first_name;
                    student.last_name = req.user.last_name;
                    student.email = req.user.username;
                    student.tutorial = req.user.tutorial;

                    //Tutorial display logic
                    if (req.user.tutorial === true) {
                        User.update({
                            id: user_id}, {
                            tutorial: false
                        }, function (err, tutorial) {
                            if (err) {
                                sails.log.error("User id: " + user_id + " tutorials status is NOT updated");
                            } else {
                                sails.log.info("User id: " + user_id + " tutorials status is updated");
                            }
                        });
                    }

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
                        " WHERE Connection.user_id = '" + req.session.user.id + "' AND Connection.confirmation ='1' AND " +
                        " CAST(UserTable.id as FLOAT)= CAST(Connection.request_user_id as FLOAT) " +
                        " GROUP BY Connection.user_id,Connection.request_user_id,UserTable.first_name,UserTable.last_name ,StudentTable.id,AlumniTable.id " +
                        " LIMIT 4 ";

                    Connection.query(query, null,
                        function (err, connections) {
                            try {
                                // Error handling
                                if (err) {
                                    sails.log.error(err.message);
                                    return res.send(err.message, 500);

                                } else {
                                    student.connections = connections.rows;
                                    Student.getUser(user_id, res, student, null);
                                }
                            } catch (err) {
                                return res.send(err.message, 500);
                            }
                        });
                }
            });
        } catch (err) {
            sails.log.error(err.message);
            return res.send(err.message, 500);
        }

    },

    you: function (req, res) {
        async.waterfall([
            function (callback) {
                if (req.session) {
                    var userId = req.session.user.id,
                        userType = req.session.user.role,
                        myId = req.query.id,
                        query = "SELECT COUNT(*) FROM connection " +
                            " WHERE (user_id = " + userId + " AND request_user_id = " + myId + " AND confirmation = 1)" +
                            " OR (user_id = " + myId + " AND request_user_id = " + userId + " AND confirmation = 1)";

                    if (userType === "student" || userType === "alumni") {
                        var role = null;
                        Connection.query(query, null, function (err, status) {
                            try {
                                if (err) {
                                    sails.log.error(err.message);
                                    return res.send(err.message, 500);

                                } else {
                                    if (status.rows[0].count == 2) {
                                        callback(null, userId, myId, role);
                                    }
                                    else {
                                        sails.log.info("Requested user is not your friend");
                                        role = 'general';
                                        callback(null, userId, myId, role);
                                        //return res.send({user: 'General'}, 200);
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
                }
            },
            function (user_id, my_id, role, callback) {
                User.findOneById(user_id).done(function (err, user) {
                    if (err) {
                        sails.log.error("Cannot find user. Error: " + err);
                        return res.send(err, 500);
                    } else {
                        var viewerRole;
                        sails.log.info("User found with id: " + user_id);
                        if (role) {
                            sails.log.info("Viewer role is GENERAL");
                            viewerRole = 'general'
                        } else if (user.role === 'alumni' || user.role === 'student') {
                            viewerRole = 'friend';
                        } else if (user.role === 'company') {
                            viewerRole = 'company';
                        }
                        callback(null, user_id, my_id, viewerRole);
                    }
                });
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
            function (user_id, my_id, viewerRole, friendRequest, callback) {
                User.findOneById(my_id).done(function (err, user) {
                    if (err) {
                        sails.log.error("Cannot find user. Error: " + err);
                        return res.send(err, 500);
                    } else {
                        sails.log.info("User found with id: " + user_id);
                        var viewedUser = {};
                        viewedUser.first_name = user.first_name;
                        viewedUser.last_name = user.last_name;
                        if (friendRequest !== 'send') {
                            viewedUser.viewer = viewerRole;
                        }
                        callback(null, viewedUser, my_id, user_id, viewerRole);
                    }
                });
            },
            function (viewedUser, myId, userId, viewerRole, callback) {
                Privacy.find({user_id: myId, role: viewerRole}).done(function (err, privacy) {
                    if (err) {
                        sails.log.error('Error finding privacy', err);
                        return res.send(err, 500);
                    } else {
                        var privacySettings = {};
                        sails.log.info("    Privacy settings found for student");
                        privacySettings.privacy_skills = privacy[0].skills;
                        privacySettings.privacy_gpa = privacy[0].gpa;
                        privacySettings.privacy_wrg = privacy[0].wrg_points;
                        privacySettings.privacy_future = privacy[0].future_self;
                        privacySettings.privacy_awards = privacy[0].awards;
                        privacySettings.privacy_video = privacy[0].video;
                        privacySettings.privacy_connections = privacy[0].connections;
                        callback(null, viewedUser, userId, myId, privacySettings);
                    }
                });
            },

            function (viewedUser, userId, myId, privacySettings, callback) {
                if (myId === null || myId === undefined) {
                    return res.send('User ID is not valid', 500);
                } else {
                    Student.findOneByUser_id(myId).done(function (err, student) {

                        if (student === undefined) {
                            sails.log.info('Could not find student', err);
                            return res.send({message: 'Student is undefined'}, 500);
                        }

                        if (err) {
                            sails.log.info('Did not find student', err);
                            return res.send({message: err.detail}, 500);
                        } else {
                            sails.log.info("Student found with UserId:", myId);
                            student.first_name = viewedUser.first_name;
                            student.last_name = viewedUser.last_name;
                            student.viewer = viewedUser.viewer;
                            if (privacySettings.privacy_gpa === false) {
                                delete student.gpa;
                            }
                            if (privacySettings.privacy_video === false) {
                                delete student.personal_statement;
                                delete student.video_url;
                            }
                            callback(null, student, myId, privacySettings);
                        }
                    });
                }
            },
            function (student, myId, privacySettings, callback) {
                if (privacySettings.privacy_future === true) {
                    FutureSelf.find({
                        user_id: myId
                    }).done(function (err, futureSelf) {
                            if (err) {
                                sails.log.error(err);
                                return res.send(err, 500);
                            } else {
                                sails.log.info('    Future self found for student', student.id);
                                student.future_self = futureSelf;
                                callback(null, student, myId, privacySettings);
                            }
                        });
                } else {
                    callback(null, student, myId, privacySettings);
                }
            },
            function (student, myId, privacySettings) {
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
                            if (privacySettings.privacy_connections === true) {
                                student.connections = connections.rows;
                            }
                            Student.getReadOnlyUser(student, privacySettings, res);
                        }
                    } catch (err) {
                        return res.send(err.message, 500);
                    }
                });
            }
        ]);
    },

    create: function (req, res) {
        return res.send('Function disabled', 200);
    }
};
