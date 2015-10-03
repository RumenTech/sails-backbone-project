module.exports = {
    deleteStudent : function (res, userId) {
        // var userId = req.query.id;
        var getStudentId = "SELECT Student.Id from Student WHERE Student.user_id = '" +userId+"'";
        var studentId = '', experienceId=[];

        async.waterfall([
            function(callback) {
                callback(null);
            },
            function(callback) {
                User.query(getStudentId, null, function(err, id){
                    try {
                        if (err) {
                            return res.send(err.message, 500);
                        } else {
                            sails.log.info('Getting student id for destroy');
                            studentId = id.rows[0].id;
                            var getExperienceId = "SELECT Experience.id from Experience WHERE Experience.student_id='" + studentId+"'";
                            callback(null, studentId, getExperienceId);
                        }
                    } catch (err) {
                        res.send('error', 500);
                    }
                });
            },
            function (studentId, getExperienceId, callback) {
                Experience.query(getExperienceId, null, function (err, expId){
                    if (err) {
                        return res.send(err.message, 500);
                    } else {
                        sails.log.info('Getting student experience ids');
                        var textId=[];
                        for(var i=0;i<expId.rows.length;i++) {
                            experienceId[i] = expId.rows[i].id;
                            textId[i]= experienceId[i].toString();
                        }
                        callback(null, studentId, textId);
                    }
                });
            },
            function (studentId, textId, callback) {
                for (var i = 0; i < textId.length; i++) {
                    ExperienceCategory.destroy({experience_id: textId[i]}).done(function(err, expc){
                        if (err) {
                            return res.send({message : err}, 500);
                        } else {
                            sails.log.info('Student experience categories destroyed');
                        }
                    });
                }
                callback(null, textId, studentId);
            },
            function (textId, studentId, callback) {
                for (var i = 0; i < textId.length; i++) {
                    ExperienceMedia.destroy({experience_id: textId[i]}).done(function(err, expc){
                        if (err) {
                            return res.send({message : err}, 500);
                        } else {
                            sails.log.info('Student experience media destroyed');
                        }
                    });
                }
                callback(null, studentId);
            },
            function(studentId, callback) {
                var textStudentId = studentId.toString();
                Experience.destroy({student_id: textStudentId}).done(function(err, exp){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Student experience destroyed');
                        callback(null, studentId);
                    }
                });
            },
            function(studentId, callback) {
                var textStudentId = studentId.toString();
                Skill.destroy({student_id: textStudentId}).done(function(err, skill){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Student skills destroyed');
                        callback(null, studentId);
                    }
                });
            },
            function(studentId, callback) {
                var textStudentId = studentId.toString();
                Award.destroy({student_id: textStudentId}).done(function(err, award){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Student awards destroyed');
                        callback(null, studentId);
                    }
                });
            },
            function(studentId, callback) {
                Connection.destroy({user_id: userId}).done(function(err, award){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Student connections destroyed');
                        callback(null, studentId);
                    }
                });
            },
            function(studentId, callback) {
                Connection.destroy({request_user_id: userId}).done(function(err, award){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Student connection requests destroyed');
                        callback(null, studentId);
                    }
                });
            },
            function(studentId, callback){
                var getUserGroups = "SELECT * FROM groupuser WHERE groupuser.user_id = " + userId + " AND groupuser.role = 'admin'";

                GroupUser.query(getUserGroups, null, function(err, groups){
                    try {
                        if (err) {
                            return res.send(err.message, 500);
                        } else {
                            callback(null, groups.rows, studentId);
                        }
                    } catch (err) {
                        res.send('error', 500);
                    }
                });
            },
            function(groups, studentId, callback){
                if(groups){
                    for(var i = 0; i < groups.length; i++){
                        sails.log.info("Deleting group with id: " + groups[0].group_id);
                        Group.deleteGroup(groups[0].group_id, userId, res);
                    }
                    callback(null, studentId);
                }
                else{
                    callback(null, studentId);
                }
            },
            function(studentId, callback){
                Message.destroy({sender_id: userId}).done(function(err, message){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Student sent messages destroyed');
                        callback(null, studentId);
                    }
                });
            },
            function(studentId, callback){
                Message.destroy({receiver_id: userId}).done(function(err, message){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Student received messages destroyed');
                        callback(null, studentId);
                    }
                });
            },
            function (studentId, callback) {
                Student.destroy({id: studentId}).done(function(err, student){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Student destroyed');
                        callback(null);
                    }
                });
            },
            function () {
                User.destroy({id: userId}).done(function(err, user){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Student has been successfully deleted');
                        return res.send('!', 200);
                    }
                });
            }
        ]);

    },

    deleteAlumni : function (res, userId) {
        var getAlumniId = "SELECT AlumniStory.Id from AlumniStory WHERE AlumniStory.user_id = '" +userId+"'";
        var alumniId = '', experienceId=[];

        async.waterfall([
            function(callback) {
                callback(null);
            },
            function(callback) {
                User.query(getAlumniId, null, function(err, id){
                    try {
                        if (err) {
                            return res.send(err.message, 500);
                        } else {
                            sails.log.info('Getting alumni id for destroy');
                            alumniId = id.rows[0].id;
                            var getExperienceId = "SELECT ProfessionalExperience.id from ProfessionalExperience WHERE ProfessionalExperience.alumnistory_id='" + alumniId+"'";
                            callback(null, alumniId, getExperienceId);
                        }
                    } catch (err) {
                        res.send('error', 500);
                    }
                });
            },
            function (alumniId, getExperienceId, callback) {
                ProfessionalExperience.query(getExperienceId, null, function (err, expId){
                    if (err) {
                        return res.send(err.message, 500);
                    } else {
                        sails.log.info('Getting alumni experience ids');
                        var textId=[];
                        for(var i=0;i<expId.rows.length;i++) {
                            experienceId[i] = expId.rows[i].id;
                            textId[i]= experienceId[i].toString();
                        }
                        callback(null, alumniId, textId);
                    }
                });
            },
            function (alumniId, textId, callback) {
                for (var i = 0; i < textId.length; i++) {
                    ProfessionalExperienceCategory.destroy({experience_id: textId[i]}).done(function(err, expc){
                        if (err) {
                            return res.send({message : err}, 500);
                        } else {
                            sails.log.info('Alumni experience categories destroyed');
                        }
                    });
                }
                callback(null, textId, alumniId);
            },
            function (textId, alumniId, callback) {
                for (var i = 0; i < textId.length; i++) {
                    ProfessionalExperienceMedia.destroy({experience_id: textId[i]}).done(function(err, expc){
                        if (err) {
                            return res.send({message : err}, 500);
                        } else {
                            sails.log.info('Alumni experience media destroyed');
                        }
                    });
                }
                callback(null, alumniId);
            },
            function(alumniId, callback) {
                var textAlumniId = alumniId.toString();
                ProfessionalExperience.destroy({alumnistory_id: textAlumniId}).done(function(err, exp){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Alumni experience destroyed');
                        callback(null, alumniId);
                    }
                });
            },
            function(alumniId, callback) {
                var textAlumniId = alumniId.toString();
                ProfessionalSkill.destroy({alumnistory_id: textAlumniId}).done(function(err, skill){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Alumni skills destroyed');
                        callback(null, alumniId);
                    }
                });
            },
            function(alumniId, callback) {
                var textAlumniId = alumniId.toString();
                ProfessionalAward.destroy({alumnistory_id: textAlumniId}).done(function(err, award){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Alumni awards destroyed');
                        callback(null, alumniId);
                    }
                });
            },
            function(alumniId, callback) {
                Connection.destroy({user_id: userId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Alumni connection destroyed');
                        callback(null, alumniId);
                    }
                });
            },
            function(alumniId, callback) {
                Connection.destroy({request_user_id: userId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Alumni connection requests destroyed');
                        callback(null, alumniId);
                    }
                });
            },
            function(alumniId, callback){
                Message.destroy({sender_id: userId}).done(function(err, message){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Alumni sent destroyed');
                        callback(null, alumniId);
                    }
                });
            },
            function(alumniId, callback){
                Message.destroy({receiver_id: userId}).done(function(err, message){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Alumni received messages destroyed');
                        callback(null, alumniId);
                    }
                });
            },
            function (alumniId, callback) {
                AlumniStory.destroy({id: alumniId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Alumni story destroyed');
                        callback(null);
                    }
                });
            },
            function () {
                User.destroy({id: userId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Alumni has been successfully deleted!');
                        return res.send('!', 200);
                    }
                });
            }
        ]);
    },

    deleteCompany : function (res, userId) {
        var getCompanyId = "SELECT CompanyUser.company_id from CompanyUser WHERE CompanyUser.user_id = " +userId;
        var companyId = '';

        async.waterfall([
            function(callback) {
                callback(null);
            },
            function(callback) {
                User.query(getCompanyId, null, function(err, id){
                    try {
                        if (err) {
                            return res.send(err.message, 500);
                        } else {
                            sails.log.info('Getting company id for destroy');
                            companyId = id.rows[0].company_id;
                            callback(null, companyId);
                        }
                    } catch (err) {
                        res.send('error', 500);
                    }
                });
            },
            function(companyId, callback) {
                CompanyCandidates.destroy({company_id: companyId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Company candidates destroyed');
                        callback(null, companyId);
                    }
                });
            },
            function(companyId, callback) {
                CompanyEvent.destroy({company_id: companyId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Company events destroyed');
                        callback(null, companyId);
                    }
                });
            },
            function (companyId, callback) {
                CompanyMedia.destroy({company_id: companyId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Company media destroyed');
                        callback(null, companyId);
                    }
                });
            },
            function (companyId, callback) {
                Job.destroy({company_id: companyId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Posted jobs destroyed');
                        callback(null, companyId);
                    }
                });
            },
            function (companyId, callback) {
                CompanyUser.destroy({company_id: companyId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Comapny user destroyed');
                        callback(null, companyId);
                    }
                });
            },
            function (companyId, callback) {
                Company.destroy({id: companyId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Company destroyed');
                        callback(null);
                    }
                });
            },
            function(callback){
                Message.destroy({sender_id: userId}).done(function(err, message){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Sent messages fot company destroyed');
                        callback();
                    }
                });
            },
            function(callback){
                Message.destroy({receiver_id: userId}).done(function(err, message){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Received Messages for company destroyed');
                        callback();
                    }
                });
            },
            function () {
                User.destroy({id: userId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Company had been successfully deleted!');
                        return res.send('!', 200);
                    }
                });
            }
        ]);
    },

    deleteCollege : function (res, userId) {
        var getCollegeId = "SELECT CollegeUser.college_id from CollegeUser WHERE CollegeUser.user_id = " +userId;
        var collegeId = '';

        async.waterfall([
            function(callback) {
                callback(null);
            },
            function(callback) {
                User.query(getCollegeId, null, function(err, id){
                    try {
                        if (err) {
                            return res.send(err.message, 500);
                        } else {
                            sails.log.info('Getting college id');
                            collegeId = id.rows[0].college_id;
                            callback(null, collegeId);
                        }
                    } catch (err) {
                        res.send('error', 500);
                    }
                });
            },
            function(collegeId, callback) {
                CollegeCandidates.destroy({college_id: collegeId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('College candidates destroyed');
                        callback(null, collegeId);
                    }
                });
            },
            function(collegeId, callback) {
                CollegeEvent.destroy({college_id: collegeId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('College events destroyed');
                        callback(null, collegeId);
                    }
                });
            },
            function (collegeId, callback) {
                CollegeMedia.destroy({college_id: collegeId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('College media destroyed');
                        callback(null, collegeId);
                    }
                });
            },
            function (collegeId, callback) {
                CollegeUser.destroy({college_id: collegeId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('College user destroyed');
                        callback(null, collegeId);
                    }
                });
            },
            function (collegeId, callback) {
                College.destroy({id: collegeId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('College destroyed');
                        callback(null);
                    }
                });
            },
            function(callback){
                Message.destroy({sender_id: userId}).done(function(err, message){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Message sender destroyed');
                        callback();
                    }
                });
            },
            function(callback){
                Message.destroy({receiver_id: userId}).done(function(err, message){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('Message receiver destroyed');
                        callback();
                    }
                });
            },
            function () {
                User.destroy({id: userId}).done(function(err){
                    if (err) {
                        return res.send({message : err}, 500);
                    } else {
                        sails.log.info('College has been successfully deleted!');
                        return res.send('!', 200);
                    }
                });
            }
        ]);
    }

};

