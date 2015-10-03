/*
 *       DASHBOARD TYPES:
 *       1 - alumni / mentors
 *       2 - internships / companies
 *       3 - challenges
 *       4 - clubs on campus
 *       5 - fellow students
 *       6 - MOOCs
 */
var mc = (require('../../config/mainConfig.js')()),
    async = require('async');

module.exports = {

    getAllDashboardData: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.info("Not authenticated entry from Dashboard");
            return  res.view('404');
        }
        var alumniMentorsType = 1,
            internshipsType = 2,
            challengesType = 3,
            clubsType = 4,
            fellowStudentType = 5;
        var bigObject = {};

        async.waterfall([
            function (callback) {
                var userId = req.session.user.id;
                Student.getBasicStudentData(userId, res, function (currentUserSchool, currentUserMajor, currentUserStudentId, currentUserObjective) {
                    bigObject.currentUser = {};
                    bigObject.currentUser.major = currentUserMajor;
                    bigObject.currentUser.objective = currentUserObjective;
                    callback(null, currentUserSchool, currentUserMajor, currentUserStudentId, userId);
                });
            },
            function (userSchool, userMajor, studentId, userId, callback) {
                Dashboard.getPreviousIds(userId, alumniMentorsType, res, function (resultIds) {
                    callback(null, userSchool, userMajor, studentId, userId, resultIds);
                });
            },
            function (userSchool, userMajor, studentId, userId, resultIds, callback) {
                var limit = req.param('limit') || 30,
                    offset = req.param('offset') || 0;
                var query = "SELECT AlumniStory.*,UserTable.first_name,UserTable.last_name " +
                    " FROM AlumniStory, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                    " WHERE CAST(UserTable.id as FLOAT)= CAST(AlumniStory.user_id as FLOAT) and " +
                    " ( " +
                    "       (lower(AlumniStory.alma_mater) LIKE lower('%" + userSchool + "%') AND UserTable.role = 'alumni') " +
                    "  ) " +
                    " AND UserTable.id <> '" + userId + "'" +
                    " ORDER BY lower(AlumniStory.major) LIKE lower('%" + userMajor + "%') DESC " +
                    " LIMIT " + limit + " OFFSET " + offset;

                AlumniStory.query(query, null, function (err, alumni) {
                    try {
                        if (err) {
                            sails.log.error('Error: ' + err);
                            return res.send(err, 500);
                        } else {
                            var numberOfMentors = alumni.rows.length,
                                quantity = resultIds.length;
                            if (quantity === 0) {
                                for (var i = 0; i < numberOfMentors; i++) {
                                    Dashboard.addNewRecordToDashboard(alumniMentorsType, numberOfMentors, alumni.rows[i].id, userId, res);

                                }
                            } else if (numberOfMentors > quantity) {
                                sails.log.info('There are new mentors, write it into db');

                                for (var j = 0; j < alumni.rows.length; j++) {
                                    var index = resultIds.indexOf(alumni.rows[j].id);
                                    if (index === -1) {
                                        sails.log.info('Differing ids: ', alumni.rows[j].id);
                                        alumni.rows[j].new = true;
                                        Dashboard.addNewRecordToDashboard(alumniMentorsType, numberOfMentors, alumni.rows[j].id, userId, res);
                                    }
                                }

                            }
                            bigObject.alumniMentors = alumni;
                            callback(null, userSchool, userMajor, studentId, userId);
                        }
                    } catch (err) {
                        sails.log.error('Error: ' + err);
                        return res.send(err, 500);
                    }
                });
            },

            // ********************************************** INTERNSHIPS **********************************************
            function (userSchool, userMajor, studentId, userId, callback) {
                Dashboard.getSkills(studentId, res, function (skills) {
                    callback(null, userSchool, userMajor, studentId, userId, skills);
                });
            },
            function (userSchool, userMajor, studentId, userId, userSkills, callback) {
                Dashboard.getPreviousIds(userId, internshipsType, res, function (resultIds) {
                    callback(null, userSchool, userMajor, studentId, userId, userSkills, resultIds);
                });
            },
            function (userSchool, userMajor, studentId, userId, userSkills, resultIds, callback) {
                if (userSkills !== null) {
                    var skillsArray = [];
                    for (var i = 0; i < userSkills.length; i++) {
                        if (i < userSkills.length - 1) {
                            skillsArray += userSkills[i].name + ',';
                        } else {
                            skillsArray += userSkills[i].name;
                        }
                    }
                    var limit = req.param('limit') || 30,
                        offset = req.param('offset') || 0;
                    var query = "SELECT distinct Company.* FROM Company, CompanyCandidates " +
                        "WHERE  CAST(Company.id as INT) = CAST(CompanyCandidates.company_id as INT) " +
                        "AND string_to_array(lower('" + skillsArray + "'), ',') && " +
                        " string_to_array(array_to_string((SELECT array_agg(lower(CompanyCandidates.skill_keywords)) " +
                        " FROM CompanyCandidates WHERE CAST(Company.id as INT) = CAST(CompanyCandidates.company_id as INT)), ','), ',')";

                    Company.query(query, null, function (err, companies) {
                        try {
                            if (err) {
                                sails.log.error('Error: ' + err);
                                return res.send(err, 500);
                            } else {
                                var numberOfCompanies = companies.rows.length;
                                var quantity = resultIds.length;
                                if (quantity === 0) {
                                    for (var i = 0; i < numberOfCompanies; i++) {
                                        Dashboard.addNewRecordToDashboard(internshipsType, numberOfCompanies, companies.rows[i].id, userId, res);
                                    }
                                } else if (numberOfCompanies > quantity) {
                                    sails.log.info('quantity: ', quantity);
                                    sails.log.info('number fo companies: ', numberOfCompanies);

                                    sails.log.info('There are new internships, write it into db');
                                    for (var j = 0; j < companies.rows.length; j++) {
                                        var index = resultIds.indexOf(companies.rows[j].id);
                                        if (index === -1) {
                                            sails.log.info('Differing ids: ', companies.rows[j].id);
                                            companies.rows[j].new = true;
                                            Dashboard.addNewRecordToDashboard(internshipsType, numberOfCompanies, companies.rows[j].id, userId, res);
                                        }
                                    }

                                }
                                bigObject.companies = companies;
                                callback(null, userSchool, userMajor, studentId, userId, userSkills);

                            }
                        } catch (err) {
                            sails.log.error('Error: ' + err);
                            return res.send(err, 500);
                        }
                    });
                } else {
                    bigObject.newInternships = null;
                    var companies = null;
                    callback(null, userSchool, userMajor, studentId, userId, userSkills);
                }
            },
            // *********************************************************************************************************
            // ******************************************** CHALLENGES *************************************************
            function (userSchool, userMajor, studentId, userId, userSkills, callback) {
                Dashboard.getPreviousIds(userId, challengesType, res, function (resultIds) {
                    callback(null, userSchool, userMajor, studentId, userId, userSkills, resultIds);
                });
            },
            function (userSchool, userMajor, studentId, userId, userSkills, resultIds, callback) {
                if (userSkills !== null) {
                    var skillsArray = [];
                    for (var i = 0; i < userSkills.length; i++) {
                        if (i < userSkills.length - 1) {
                            skillsArray += userSkills[i].name + ',';
                        } else {
                            skillsArray += userSkills[i].name;
                        }
                    }
                    var limit = req.param('limit') || 30,
                        offset = req.param('offset') || 0;
                    var query = "SELECT Challenge.* FROM Challenge " +
                        "WHERE string_to_array(lower('" + skillsArray + "'), ',') && " +
                        "string_to_array(lower(Challenge.skill_keywords), ',')";

                    Challenge.query(query, null, function (err, challenges) {
                        try {
                            if (err) {
                                sails.log.error('Error: ' + err);
                                return res.send(err, 500);
                            } else {
                                var numberOfChallenges = challenges.rows.length,
                                    quantity = resultIds.length;
                                if (quantity === 0) {
                                    for (var i = 0; i < numberOfChallenges; i++) {
                                        Dashboard.addNewRecordToDashboard(challengesType, numberOfChallenges, challenges.rows[i].id, userId, res);
                                    }
                                } else if (numberOfChallenges > quantity) {

                                    sails.log.info('There are new mentors, write it into db');
                                    for (var j = 0; j < challenges.rows.length; j++) {
                                        var index = resultIds.indexOf(challenges.rows[j].id);
                                        if (index === -1) {
                                            sails.log.info('Differing ids: ', challenges.rows[j].id);
                                            challenges.rows[j].new = true;
                                            Dashboard.addNewRecordToDashboard(challengesType, numberOfChallenges, challenges.rows[j].id, userId, res);

                                        }
                                    }

                                }
                                bigObject.challenges = challenges;
                                callback(null, userSkills, userSchool, userMajor, studentId, userId);
                            }
                        } catch (err) {
                            sails.log.error('Error: ' + err);
                            return res.send(err, 500);
                        }
                    });
                } else {
                    bigObject.newChallenges = null;
                    var challenges = null;
                    callback(null, userSkills, userSchool, userMajor, studentId, userId);
                }

            },
            // *********************************************************************************************************
            // ******************************************* FELLOW STUDENTS *********************************************
            function (userSkills, userSchool, userMajor, studentId, userId, callback) {
                Dashboard.getPreviousIds(userId, fellowStudentType, res, function (resultIds) {
                    callback(null, userSkills, userSchool, userMajor, userId, studentId, resultIds);
                });
            },
            function (userSkills, userSchool, userMajor, userId, studentId, resultIds, callback) {
                var skillsArray = '';
                if (userSkills !== null) {
                    for (var i = 0; i < userSkills.length; i++) {
                        if (i < userSkills.length - 1) {
                            skillsArray += userSkills[i].name + ',';
                        } else {
                            skillsArray += userSkills[i].name;
                        }
                    }
                }

                // TODO: sort by number of same skills
                var limit = req.param('limit') || 30,
                    offset = req.param('offset') || 0;
                var query;
                if (userSkills === null) {
                    query = "SELECT Student.*,UserTable.first_name,UserTable.last_name " +
                        " FROM Student, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE CAST(UserTable.id as FLOAT)= CAST(Student.user_id as FLOAT) and " +
                        " ((lower(Student.school) LIKE lower('%" + userSchool + "%') AND UserTable.role = 'student'))    " +
                        " AND UserTable.id <> '" + userId + "'" +
                        " ORDER BY lower(Student.major) LIKE lower('%" + userMajor + "%') DESC " +
                        " LIMIT " + limit + " OFFSET " + offset;
                } else {
                    query = "SELECT Student.*,UserTable.first_name,UserTable.last_name " +
                        " FROM Student, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                        " WHERE CAST(UserTable.id as FLOAT)= CAST(Student.user_id as FLOAT) and " +
                        " ( " +
                        "       (lower(Student.school) LIKE lower('%" + userSchool + "%') AND UserTable.role = 'student') " +
                        "  ) " +
                        " and  string_to_array(lower('" + skillsArray + "'), ',') && " +
                        " (SELECT array_agg(lower(name)) FROM Skill WHERE CAST(Student.id as INT) = CAST(Skill.student_id as INT))" +
                        " AND UserTable.id <> '" + userId + "'" +
                        " ORDER BY lower(Student.major) LIKE lower('%" + userMajor + "%') DESC " +
                        " LIMIT " + limit + " OFFSET " + offset;
                }
                Student.query(query, null, function (err, students) {
                    try {
                        if (err) {
                            sails.log.error('Error: ' + err);
                            return res.send(err, 500);
                        } else {
                            var numberOfStudents = students.rows.length,
                                quantity = resultIds.length;
                            if (quantity === 0) {
                                for (var i = 0; i < numberOfStudents; i++) {
                                    Dashboard.addNewRecordToDashboard(fellowStudentType, numberOfStudents, students.rows[i].id, userId, res);


                                }
                            } else if (numberOfStudents > quantity) {

                                sails.log.info('There are new fellow students, write it into db');
                                for (var j = 0; j < students.rows.length; j++) {
                                    index = resultIds.indexOf(students.rows[j].id);
                                    if (index === -1) {
                                        sails.log.info('Differing ids: ', students.rows[j].id);
                                        students.rows[j].new = true;
                                        Dashboard.addNewRecordToDashboard(fellowStudentType, numberOfStudents, students.rows[j].id, userId, res);
                                    }
                                }

                            }
                            bigObject.fellowStudents = students;
                            callback(null, userSchool, userMajor, studentId, userId);
                        }
                    } catch (err) {
                        sails.log.error('Error: ' + err);
                        return res.send(err, 500);
                    }
                });
            },
            // *********************************************************************************************************
            // ************************************************ GROUPS ************************************************
            function (userSchool, userMajor, studentId, userId, callback) {
                Dashboard.getPreviousIds(userId, clubsType, res, function (resultIds) {
                    callback(null, userSchool, userMajor, userId, resultIds);
                });
            },
            function (userSchool, userMajor, userId, resultIds, callback) {
                var limit = req.param('limit') || 30,
                    offset = req.param('offset') || 0;
                var query = "SELECT GroupTable.* FROM " + mc.dbSettings.dbName + ".public.Group as GroupTable " +
                    " WHERE lower(GroupTable.description) LIKE lower('%" + userSchool + "%') " +
                    " ORDER BY lower(GroupTable.description) LIKE lower('%" + userMajor + "%') desc " +
                    " LIMIT " + limit + " OFFSET " + offset;
                Group.query(query, null, function (err, groups) {
                    try {
                        if (err) {
                            sails.log.error('Error: ' + err);
                            return res.send(err, 500);
                        } else {
                            var numberOfClubs = groups.rows.length,
                                quantity = resultIds.length;
                            if (quantity === 0) {
                                for (var i = 0; i < numberOfClubs; i++) {
                                    Dashboard.addNewRecordToDashboard(clubsType, numberOfClubs, groups.rows[i].id, userId, res);


                                }
                            } else if (numberOfClubs > quantity) {

                                sails.log.info('There are new groups, write it into db');
                                for (var j = 0; j < groups.rows.length; j++) {
                                    var index = resultIds.indexOf(groups.rows[j].id);
                                    if (index === -1) {
                                        sails.log.info('Differing ids: ', groups.rows[j].id);
                                        groups.rows[j].new = true;
                                        Dashboard.addNewRecordToDashboard(clubsType, numberOfClubs, groups.rows[j].id, userId, res);
                                    }
                                }

                            }
                            bigObject.groups = groups;
                            callback(null, userId);
                        }
                    } catch (err) {
                        sails.log.error('Error: ' + err);
                        return res.send(err, 500);
                    }
                })
            },
            function (userId, callback) {
                Dashboard.getSeenStatus(userId, alumniMentorsType, bigObject.alumniMentors, res, function (alumnus) {
                    if (alumnus !== null) {
                        bigObject.alumniMentors = alumnus.rows;
                        bigObject.alumniUnSeen = alumnus.anyUnSeen;
                        bigObject.alumniUnSeenCounter = alumnus.unSeenCounter;
                    }

                    callback(null, userId);
                });
            },
            function (userId, callback) {
                Dashboard.getSeenStatus(userId, challengesType, bigObject.challenges, res, function (challenge) {
                    if (challenge !== null) {
                        bigObject.challenges = challenge.rows;
                        bigObject.challengesUnSeen = challenge.anyUnSeen;
                        bigObject.challengesUnSeenCounter = challenge.unSeenCounter;
                    }

                    callback(null, userId);
                });
            },
            function (userId, callback) {
                Dashboard.getSeenStatus(userId, internshipsType, bigObject.companies, res, function (company) {
                    if (company !== null) {
                        bigObject.internships = company.rows;
                        bigObject.internshipsUnSeen = company.anyUnSeen;
                        bigObject.internshipsUnSeenCounter = company.unSeenCounter;
                    }
                    callback(null, userId);
                });
            },
            function (userId, callback) {
                Dashboard.getSeenStatus(userId, fellowStudentType, bigObject.fellowStudents, res, function (student) {
                    if (student !== null) {
                        bigObject.fellowStudents = student.rows;
                        bigObject.fellowUnSeen = student.anyUnSeen;
                        bigObject.fellowUnSeenCounter = student.unSeenCounter;
                    }
                    callback(null, userId)
                });

            },
            function (userId, callback) {
                Dashboard.getSeenStatus(userId, clubsType, bigObject.groups, res, function (group) {
                    if (group !== null) {
                        bigObject.groups = group.rows;
                        bigObject.groupsUnSeen = group.anyUnSeen;
                        bigObject.groupsUnSeenCounter = group.unSeenCounter;
                    }
                    callback(null);
                });
            },
            function () {
                if (bigObject.alumniUnSeen) {
                    bigObject.alumniMentors.sort(function (x, y) {
                        return (x.is_seen === y.is_seen) ? 0 : x.is_seen ? -1 : 1;
                    });
                    bigObject.alumniMentors.reverse();
                }
                if (bigObject.internshipsUnSeen) {
                    bigObject.internships.sort(function (x, y) {
                        return (x.is_seen === y.is_seen) ? 0 : x.is_seen ? -1 : 1;
                    });
                    bigObject.internships.reverse();
                }
                if (bigObject.challengesUnSeen) {
                    bigObject.challenges.sort(function (x, y) {
                        return (x.is_seen === y.is_seen) ? 0 : x.is_seen ? -1 : 1;
                    });
                    bigObject.challenges.reverse();
                }
                if (bigObject.groupsUnSeen) {
                    bigObject.groups.sort(function (x, y) {
                        return (x.is_seen === y.is_seen) ? 0 : x.is_seen ? -1 : 1;
                    });
                    bigObject.groups.reverse();
                }
                if (bigObject.fellowUnSeen) {
                    bigObject.fellowStudents.sort(function (x, y) {
                        return (x.is_seen === y.is_seen) ? 0 : x.is_seen ? -1 : 1;
                    });
                    bigObject.fellowStudents.reverse();
                }
                res.send(bigObject, 200);
            }
        ]);
    },

    update: function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Not authenticated entry from Dashboard");
            return  res.view('404');
        } else {
            try {
                var userId = req.session.user.id,
                    type = req.param('type'),
                    resultId = req.param('resultId');
                Dashboard.updateDashboard(userId, type, resultId, res);
            } catch (err) {
                sails.log.error('Error while updating dashboard ', err);
                res.send(err, 500);
            }
        }

    }
};