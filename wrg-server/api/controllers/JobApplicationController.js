"use strict";

var mc = (require('../../config/mainConfig.js')()),
    async = require('async');

module.exports = {
    create: function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from JobApplication Controller");
            return  res.view('404');
        }
        try {
            var applicantId = req.session.user.id;
            async.waterfall([
                function (callback) {
                    JobApplication.checkIfUserApplied(req, res, callback);
                },
                // Find Company id
                function (callback) {
                    Job.find()
                        .where({id: req.body.job_id})
                        .exec(function (err, job) {
                            if (err) {
                                sails.log.error('Could not find job: ', err);
                                res.send(err, 500);
                            } else {
                                callback(null, job[0].company_id);
                            }
                        });
                },
                // Find company user id
                function (companyId, callback) {
                    CompanyUser.find()
                        .where({company_id: companyId})
                        .exec(function (err, companyUser) {
                            if (err) {
                                sails.log.error('Could not find company user: ', err);
                                res.send(err, 500);
                            } else {
                                callback(null, companyUser[0].user_id, companyUser[0].company_id);
                            }
                        });
                },
                // Find company name
                function (companyUserId, companyId, callback) {
                    Company.find()
                        .where({id: companyId})
                        .exec(function (err, company) {
                            if (err) {
                                sails.log.error('Could not find company user: ', err);
                                res.send(err, 500);
                            } else {
                                callback(null, companyUserId, company[0].name);
                            }
                        });
                },
                //Get applicant name
                function (companyUserId, companyName, callback) {
                      User.find()
                          .where({id: req.body.applicant_id})
                          .exec(function (err, user) {
                              if (err) {
                                  sails.log.error('Could not find user: ', err);
                                  res.send(err, 500);
                              } else {
                                  var userName = user[0].first_name + ' ' + user[0].last_name;
                                  callback(null, userName, companyUserId, companyName);
                              }
                          });
                },
                //Get applied position
                function (userName, companyUserId, companyName, callback) {
                    Job.find()
                        .where({id: req.body.job_id})
                        .exec(function (err, job) {
                            if (err) {
                                sails.log.error('Could not find user: ', err);
                                res.send(err, 500);
                            } else {
                                var jobTitle = job[0].job_title;
                                callback(null, userName, jobTitle, companyUserId, companyName);
                            }
                        });
                },
                //Send message to company
                function (userName, jobTitle, userId, companyName, callback) {
                    var messageContent = 'You have a new job applicant ' + userName + ' for the job '+ jobTitle + '.';
                    var body = {};
                    body.receiver_id = userId;
                    body.owner_id = userId;
                    body.sender_id = null;
                    body.content =  messageContent;
                    body.subject =  'Job Application';
                    body.is_read = false;
                    body.is_flagged = false;
                    body.send_on = new Date();
                    body.is_deleted = false;

                    Message.new_update(body, function (err) {
                        try {
                            if (err) {
                                return res.send(err, 500);
                            } else {
                                callback(null, userName, jobTitle, userId, companyName);
                            }
                        } catch (err) {
                            return res.send({message:err.message}, 500);
                        }
                    });
                },
                //Send message to applicant
                function (userName, jobTitle, userId, companyName, callback) {
                    var messageContent = 'You have applied for the '+ jobTitle + ' position at ' + companyName;
                    var body = {};
                    body.receiver_id = applicantId;
                    body.owner_id = applicantId;
                    body.sender_id = null;
                    body.content =  messageContent;
                    body.subject =  'Job Application';
                    body.is_read = false;
                    body.is_flagged = false;
                    body.send_on = new Date();
                    body.is_deleted = false;

                    Message.new_update(body, function (err) {
                        try {
                            if (err) {
                                return res.send(err, 500);
                            } else {
                                callback(null);
                            }
                        } catch (err) {
                            return res.send({message:err.message}, 500);
                        }
                    });
                },
                function () {
                    JobApplication.new_update(req.body, function (err, jobapplication) {
                        try {
                            if (err) {
                                sails.log.error(err);
                                return res.send(err, 500);
                            } else {
                                return res.send(jobapplication, 200);
                            }
                        } catch (err) {
                            return res.send({message: err.message}, 500);
                        }
                    });
                }
            ]);
        } catch (err) {
            return res.send({message: err.message}, 500);
        }
    },

    update: function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from JobApplication Controller");
            return  res.view('404');
        }


        try {
            JobApplication.new_update(req.body, function (err, jobapplication) {
                try {
                    if (err) {
                        return res.send(err, 500);
                    } else {

                        return res.send(jobapplication, 200);
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
            sails.log.error("Not authenticated entry from JobApplication Controller");
            return  res.view('404');
        }

        try {
            JobApplication.new_update(req.session.req.body, function (err, jobapplication) {
                try {
                    if (err) {
                        return res.send(err, 500);
                    } else {
                        sails.log.info('Message deleted');
                        return res.send(jobapplication, 200);
                    }
                } catch (err) {
                    return res.send({message: err.message}, 500);
                }
            }, 'remove');
        } catch (err) {
            return res.send({message: err.message}, 500);
        }
    },

    findApplicants: function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from JobApplication Controller");
            return  res.view('404');
        }

        try {
            var user_id = req.session.user.id;

            var job_id = req.param('jobId');

            var query = "SELECT JobApplication.*, UserTable.first_name, UserTable.last_name, UserTable.role,  Student.profile_image as applicantImage " +
                "from JobApplication  join Student on JobApplication.applicant_id = cast(Student.user_id as int), " + mc.dbSettings.dbName + ".public.User as UserTable" +
                " WHERE  UserTable.id = JobApplication.applicant_id  AND JobApplication.job_id ="   + job_id +
                " UNION " +
                "SELECT JobApplication.*, UserTable.first_name, UserTable.last_name, UserTable.role,  AlumniStory.profile_image as applicantImage " +
                "from  JobApplication  join AlumniStory on JobApplication.applicant_id = cast(AlumniStory.user_id as int), " +  mc.dbSettings.dbName + ".public.User as UserTable" +
                " WHERE UserTable.id = JobApplication.applicant_id  AND  JobApplication.job_id ="   + job_id;

                JobApplication.query(query, null,
                function (err, applicants) {
                    try {
                        if (err) {
                            sails.log.error(err);
                            res.send(err.message, 500);
                        } else {

                            return res.send({request: applicants.rows}, 200);
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

    checkIfUserApplied : function (req, res) {
        var jobList = 'check';
        JobApplication.checkIfUserApplied(req, res, jobList);
    },

    respond: function(req,res){
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from JobApplication Controller");
            return  res.view('404');
        }

        try {


            req.body.sender_id = req.session.user.id;


            Message.new_update(req.body, function (err, studentmessage) {
                try {
                    if (err) {
                        return res.send(err, 500);
                    } else {
                        // return res.send(studentmessage, 200);
                    }
                } catch (err) {
                    return res.send({message:err.message}, 500);
                }
            });

            req.body.owner_id = req.session.user.id;
            Message.new_update(req.body, function (err, studentmessage) {
                try {
                    if (err) {
                        return res.send(err, 500);
                    } else {
                        // return res.send(studentmessage, 200);
                    }
                } catch (err) {
                    return res.send({message:err.message}, 500);
                }
            });


            User.findOneById(req.body.receiver_id).done(function (err, user) {

                // Error handling
                if (err) {
                    console.log(err);
                    return res.send(err, 500);
                    // The Books were found successfully!
                } else {
                    var userFriend = {
                        hash:hashSetter.hashedValue(),
                        email:user.email,
                        user_id:user.id,
                        first_name:user.first_name,
                        friend_name:req.session.user.first_name + " " + req.session.user.last_name,
                        content:req.body.content,
                        subject:req.body.subject
                    };

                    templateresolver.resolveTemplate(userFriend, 'jobRespond');



                        JobApplication.update({
                            applicant_id: req.body.receiver_id,
                            job_id: req.body.job_id
                        },{
                            is_responded: true
                        }, function(err, applications) {
                            // Error handling
                            if (err) {
                                sails.log.error(err);

                            } else {
                               // console.log("Users updated:", users);
                            }
                        });

                    return res.send({}, 200);
                }
            });


        }
        catch (err) {
            return res.send({message: err.message}, 500);
        }

    },

    _config: {}
};