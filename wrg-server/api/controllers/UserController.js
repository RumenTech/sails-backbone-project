'use strict';
var mc = (require('../../config/mainConfig.js')());
var async = require('async');
var bcrypt = require('bcryptjs');

module.exports = {

    session:function (req, res) {
        try {
            if (req.session.user == undefined) {
                return res.send({message:'login failed', session:null}, 200);
            }
            else {
                Connection.find({ request_user_id:req.session.user.id, confirmation:0 }).done(
                    function (err, connections) {
                        try {
                            if (err) {
                                return res.send(err.message, 500);
                            } else {
                                req.session.user.request = connections.length;
                                return res.send({message:'session valid', session: req.session.user}, 200);
                            }
                        } catch (err) {
                            return res.send(err.message, 500);
                        }
                    }
                );
            }
        } catch (err) {
            return res.send(err.message, 500);
        }
    },

    new_student:function (req, res) {
        try {
            var username = req.param('email');
            async.waterfall([
                function (callback) {
                    User.findOneByUsername(username).done(
                        function (err, user) {
                            try {

                                if (err) {
                                    res.send({message:err.message}, 500);
                                } else {

                                    if (user) {
                                        return res.send({message:"The email is already registered."}, 500);
                                    } else {
                                        var data_user = {
                                            first_name:req.param('first_name'),
                                            last_name:req.param('last_name'),
                                            email:req.param('email'),
                                            password:req.param('password'),
                                            username:req.param('email'),
                                            facebook_uid: req.param('facebook_uid'),
                                            linkedin_uid: req.param('linkedin_uid'),
                                            google_uid: req.param('google_uid'),
                                            twitter_uid: req.param('twitter_uid'),
                                            role:'student'
                                        };
                                        callback(null, data_user);
                                    }
                                }
                            } catch (err) {
                                return res.send({message:err.message}, 500);
                            }
                        }
                    );
                },
                function (data_user, callback) {
                    var code = 200;
                    // For example
                    User.create(data_user).done(function (err, user) {
                            try {
                            // Error handling
                            if (err) {
                                code = 500;
                                return res.send({message:err.message}, code);
                            }
                            else {
                                data_user = user;

                                var data_student = {
                                    school:req.param('school'),
                                    school_list_id: req.param('school_id'),
                                    high_school: req.param('high_school'),
                                    career_objective: req.param('career_objective'),
                                    highest_edu_level:req.param('highest_edu_level'),
                                    company:req.param('company'),
                                    major:req.param('major'),
                                    is_veteran:req.param('is_veteran'),
                                    is_disabled: req.param('is_disabled'),
                                    job_title:req.param('job_title'),
                                    activities:req.param('activities'),
                                    advice:req.param('advice'),
                                    profile_image:req.param('profile_image'),
                                    hindsight:req.param('hindsight'),
                                    graduation_year: req.param('graduation_year'),
                                    graduation_month: req.param('graduation_month'),
                                    tutorial: true,
                                    user_id:user.id
                                };
                                if(data_student.graduation_month === '') {
                                    data_student.graduation_month = null;
                                }
                                if(data_student.graduation_year === '') {
                                    data_student.graduation_year = null;
                                }
                                var userId = user.id;
                                callback(null, data_user, data_student, userId);
                            }
                        } catch (err) {
                            res.send(err.message, 500);
                        }
                    });
                },
                function(data_user, data_student, userId, callback) {
                    Student.create(data_student).done(function (err, student) {
                        // Error handling
                        if (err) {
                            data_student = err;
                            var code = 500;

                            User.destroy({
                                id:user.id
                            }).done(function (err) {
                                    if (err) {
                                        return res.send({message:"The student can't be saved, and the user was created and can't be deleted. " +
                                            "Only send the data student with the user_id", user:data_user, student:data_student}, code);
                                    } else {
                                        return res.send({message:"Error saving your data, please try again.", user:data_user, student:data_student}, code);
                                    }
                                });
                        } else {
                            data_student = student;
                            callback(null, userId, data_user, data_student, student);
                        }
                    });
                },
                // Create privacy settings
                function (user_id, data_user, data_student, student, callback) {
                    User.setStudentPrivacy(user_id, function (){
                        callback(null, data_user, data_student, student);
                    });
                },
                //Create Experiences
                function (data_user, data_student, student, callback) {
                    if (req.body.hasOwnProperty("experiences")){
                        var experiences = [];
                        var experiencesSize = req.body.experiences._total;
                        var experienceTempObject = {};

                        for (var i = 0; i < experiencesSize; i++ ) {
                            experienceTempObject.title = req.body.experiences.values[i].title;

                            experienceTempObject.student_id = student.id;
                            experienceTempObject.organization = req.body.experiences.values[i].company.name;

                            var month = req.body.experiences.values[i].startDate.month;
                            var year = req.body.experiences.values[i].startDate.year;

                            experienceTempObject.start_date = new Date(year, month);

                            if(req.body.experiences.values[i].isCurrent){
                                experienceTempObject.end_date = new Date().toISOString().slice(0, 10);
                                experienceTempObject.present = true;
                            } else {
                                month = req.body.experiences.values[i].endDate.month;
                                year = req.body.experiences.values[i].endDate.year;

                                experienceTempObject.end_date = year + "-" + month;
                                experienceTempObject.present = false;
                            }

                            if (req.body.experiences.values[i].summary){
                                experienceTempObject.description = req.body.experiences.values[i].summary;
                            }
                            //Client needs this email address so it can recognize this is Linkedin import
                            experienceTempObject.reference_email = "reference@email.com";
                            experiences.push(experienceTempObject);
                            experienceTempObject = {};
                        }
                        Experience.create(experiences).done(function(err, experience) {
                            if (err) {
                                sails.log.error("Failed to create Linkedin experience for Student." + err);
                                res.send(err, 500);
                            } else {
                                data_student = student;
                                sails.log.info("Linkedin experience created for Student. User id: " + student.user_id);
                            }
                        });
                    }
                    callback(null, data_user, data_student, student);
                },
                //create skill(s)
                function (data_user, data_student, student, callback) {

                    if (req.body.hasOwnProperty("skills")){

                        var skills = [];
                        var skillSize = req.body.skills._total;
                        var skillTempObject = {};

                        for (var i = 0; i < skillSize; i++ ) {
                            skillTempObject.name = req.body.skills.values[i].skill.name;
                            skillTempObject.student_id = student.id;
                            skillTempObject.proficiency_level = mc.appSettings.linkedinSkills;
                            skills.push(skillTempObject);
                            skillTempObject = {};

                            if (i === 9) {
                                //this user is supermen... more then 10 skills???
                                //Our system handles only 10 skills soooo...
                                break;
                            }
                        }
                        Skill.create(skills).done(function(err, skill) {
                            if (err) {
                                sails.log.error("Failed to create Linkedin skill for Student." + err);
                                res.send(err, 500);
                            } else {
                                data_student = student;
                                sails.log.info("Linkedin skill created for Student. User id: " + student.user_id);
                            }
                        });
                    }
                    callback(null, student, data_user, data_student);
                },
                //Add Reward(s)
                function (student, data_user, data_student) {

                    if (req.body.hasOwnProperty("awards")){

                        var awards = [];
                        var awardSize = req.body.awards._total;
                        var awardTempObject = {};

                        for (var i = 0; i < awardSize; i++ ) {
                            awardTempObject.title = req.body.awards.values[i].name;
                            awardTempObject.student_id = student.id;

                            if(req.body.awards.values[i].issuer){
                                awardTempObject.presentor = req.body.awards.values[i].issuer;
                            }

                            if(req.body.awards.values[i].description){
                                awardTempObject.description = req.body.awards.values[i].description;
                            }

                            if(req.body.awards.values[i].date){
                                var month = req.body.awards.values[i].date.month;
                                var year = req.body.awards.values[i].date.year;

                                awardTempObject.date = new Date(year, month);
                            }

                            awards.push(awardTempObject);
                            awardTempObject = {};
                        }

                        Award.create(awards).done(function(err, award) {
                            if (err) {
                                sails.log.error("Failed to create Awards for Student." + err);
                                res.send(err, 500);
                            } else {
                                data_student = student;
                                sails.log.info("Linkedin awards created for Student. User id: " + student.user_id);
                            }
                        });
                    }
                    sails.log.info("The User was created successfully. Id is ", student.user_id);
                    var feedEntry = {};
                    feedEntry.user_id = student.user_id;
                    feedEntry.user_role = 'student';
                    feedEntry.event_type ='newUser';
                    Feed.addFeedEvent(feedEntry);


                    if(mc.appSettings.newRegistrationAutoLogin) {
                        //Student made success registration. Log him in NOW!!!!!
                        req.logIn(data_user, function (err) {
                            //Second Level of Defense
                            if (typeof (data_user) === "undefined") {  //STOP and redirect
                                return res.redirect(mc.appSettings.clientLocation);
                            }
                            if (err) {
                                sails.log.error('ERROR while attempting AUTO login for newly created user:  ' + err);
                                return res.redirect(mc.appSettings.clientLocation);
                            }
                            else {
                                sails.log.info('Success while attempting AUTO login for newly created user:  ' + data_user);
                                req.session.user = data_user;
                            }
                        });
                    }

                    return res.send({message:"The User was created successfully!", user:data_user, student:data_student}, 200);
                }
            ]);

        } catch (err) {
            res.view('404');
        }
    },

    new_alumni:function (req, res) {
        //Overriding graduation_year, since ii comes in form '' if not entered
        //Integer cannot be '', send from client as null?

        try {
            var graduation_year = req.param('graduation_year');
            graduation_year = graduation_year || null;

            var data_user = {
                first_name: req.param('first_name'),
                last_name: req.param('last_name'),
                email: req.param('email'),
                password: req.param('password'),
                username: req.param('email'),
                facebook_uid: req.param('facebook_uid'),
                linkedin_uid: req.param('linkedin_uid'),
                google_uid: req.param('google_uid'),
                twitter_uid: req.param('twitter_uid'),
                role: 'alumni'
            };
            var code = 200;

            async.waterfall([
                function (callback) {
                    callback(null);
                }, //Create User
                function (callback) {
                    User.create(data_user).done(function (err, user) {
                        if (err) {
                            sails.log.error("Cant create user for Alumni: ", err);
                            data_user = err;
                            code = 500;
                            return res.send({user: data_user}, code);
                        } else {
                            data_user = user;
                            var data_alumni = {
                                alma_mater: req.param('alma_mater'),
                                school_list_id: req.param('alma_mater_id'),
                                major: req.param('major'),
                                graduation_year: graduation_year,
                                graduation_month: 1,
                                highest_edu_level: req.param('highest_edu_level'),
                                company: req.param('company'),
                                job_title: req.param('job_title'),
                                activities: req.param('activities'),
                                advice: req.param('advice'),
                                profile_image: req.param('profile_image'),
                                hindsight: req.param('hindsight'),
                                industry: req.param('industry'),
                                user_id: user.id
                            };
                               sails.log.info("User for Alumni is created. Its ID is: ", user.id);
                            callback(null, data_alumni, user.id);
                        }
                    });
                },
                // Create default privacy settings
                function (data_alumni, user_id, callback) {
                    User.setAlumnusPrivacy(user_id, function () {
                        callback(null, data_alumni);
                    })
                },
                //Create Alumni based on user
                function (data_alumni, callback) {
                    AlumniStory.create(data_alumni).done(function (err, alumni) {
                        if (err) {
                            sails.log.error("Cant create Alumni Story: ", err);
                            data_alumni = err;
                            code = 500;
                            User.destroy({
                                id: user.id
                            }).done(function (err) {
                                    if (err) {
                                        return res.send({message: "The alumni can't be saved, and the user was created and can't be deleted. " +
                                            "Only send the data alumni with the user_id", user: data_user, alumni: data_alumni}, code);
                                    } else {
                                        return res.send({user: data_user, alumni: data_alumni}, code);
                                    }
                                });
                        } else {
                            data_alumni = alumni;
                            sails.log.info("Alumni created with id of: ", alumni.id );
                            callback(null, data_alumni);
                        }
                    });
                },

                //Create Alumni Experience
                function (data_alumni, callback) {

                    if (req.body.hasOwnProperty("experiences")) {

                        var experiences = [];
                        var experiencesSize = req.body.experiences._total;
                        var experienceTempObject = {};

                        for (var i = 0; i < experiencesSize; i++) {
                            experienceTempObject.title = req.body.experiences.values[i].title;

                            experienceTempObject.alumnistory_id = data_alumni.id;
                            experienceTempObject.organization = req.body.experiences.values[i].company.name;

                            var month = req.body.experiences.values[i].startDate.month;
                            var year = req.body.experiences.values[i].startDate.year;

                            experienceTempObject.start_date = new Date(year, month);

                            if (req.body.experiences.values[i].isCurrent) {
                                experienceTempObject.end_date = new Date().toISOString().slice(0, 10);
                                experienceTempObject.present = true;
                            } else {
                                month = req.body.experiences.values[i].endDate.month;
                                year = req.body.experiences.values[i].endDate.year;

                                experienceTempObject.end_date = year + "-" + month;
                                experienceTempObject.present = false;
                            }

                            if (req.body.experiences.values[i].summary) {
                                experienceTempObject.description = req.body.experiences.values[i].summary;
                            }
                            //Client needs this email address so it can recognize this is Linkedin import
                            experienceTempObject.reference_email = "reference@email.com";
                            experiences.push(experienceTempObject);
                            experienceTempObject = {};
                        }

                        ProfessionalExperience.create(experiences).done(function (err, experience) {
                            if (err) {
                                sails.log.error("Failed to create Alumni Linkedin experience for User ID: " + data_alumni.user_id);
                                return res.send({ message: err.message }, 500);
                            } else {
                                sails.log.info(" Linkedin experience created for ALumni. User ID: " + data_alumni.user_id);
                            }
                        });
                    }
                    callback(null, data_alumni);
                }, //Create Alumni Skills
                function (data_alumni, callback) {

                    if (req.body.hasOwnProperty("skills")) {

                        var skills = [];
                        var skillSize = req.body.skills._total;
                        var skillTempObject = {};

                        for (var i = 0; i < skillSize; i++) {
                            skillTempObject.name = req.body.skills.values[i].skill.name;
                            skillTempObject.alumnistory_id = data_alumni.id;
                            skillTempObject.proficiency_level = mc.appSettings.linkedinSkills;
                            skills.push(skillTempObject);
                            skillTempObject = {};

                            if (i === 9) {
                                //this user is supermen... more then 10 skills???
                                //Our system handles only 10 skills soooo...
                                break;
                            }
                        }
                        ProfessionalSkill.create(skills).done(function (err, skill) {
                                if (err) {
                                    sails.log.error("Failed to create skills for Alumni. ", err);
                                    return res.send({ message: err.message }, 500);
                                } else {
                                    sails.log.info("Linkedin skills Created for Alumni. User id: " + data_alumni.user_id);
                                }
                        });
                    }
                    callback(null, data_alumni);
                },//Create Alumni Awards
                function (data_alumni, callback) {

                    if (req.body.hasOwnProperty("awards")) {
                        var awards = [];
                        var awardSize = req.body.awards._total;
                        var awardTempObject = {};

                        for (var i = 0; i < awardSize; i++) {
                            awardTempObject.title = req.body.awards.values[i].name;
                            awardTempObject.alumnistory_id = data_alumni.id;

                            if (req.body.awards.values[i].issuer) {
                                awardTempObject.presentor = req.body.awards.values[i].issuer;
                            }

                            if (req.body.awards.values[i].description) {
                                awardTempObject.description = req.body.awards.values[i].description;
                            }

                            if (req.body.awards.values[i].date) {
                                var month = req.body.awards.values[i].date.month;
                                var year = req.body.awards.values[i].date.year;

                                awardTempObject.date = new Date(year, month);
                            }

                            awards.push(awardTempObject);
                            awardTempObject = {};
                        }
                        ProfessionalAward.create(awards).done(function (err, award) {
                                if (err) {
                                    sails.log.error("Failed to create awards for Alumni.", err);
                                    return res.send({ message: err.message }, 500);
                                } else {
                                    sails.log.info("Linkedin awards created for Alumni. User id: " + data_alumni.user_id);
                                }
                        });
                    }
                    var feedEntry = {};
                    feedEntry.user_id = data_alumni.user_id;
                    feedEntry.user_role = 'alumni';
                    feedEntry.event_type ='newUser';
                    Feed.addFeedEvent(feedEntry);

                    if(mc.appSettings.newRegistrationAutoLogin) {
                        //Alumni made success registration. Log him in NOW!!!!!
                        req.logIn(data_user, function (err) {
                            //Second Level of Defense
                            if (typeof (data_user) === "undefined") {  //STOP and redirect
                                return res.redirect(mc.appSettings.clientLocation);
                            }
                            if (err) {
                                sails.log.error('ERROR while attempting AUTO login for newly created ALUMNI user:  ' + err);
                                return res.redirect(mc.appSettings.clientLocation);
                            }
                            else {
                                sails.log.error('Success while attempting AUTO login for newly created user:  ' + data_user);
                                req.session.user = data_user;
                            }
                        });
                    }
                    return res.send({user: data_user, alumni: data_alumni}, code);
                }
            ]);
        }
        catch (err) {
            sails.log.error(error);
        }
    },

    create: function (req, res) {
        return res.send('Function disabled', 200);
    },

    new_company: function (req, res) {
        try {
            var data_user = {
                first_name:req.param('first_name'),
                last_name:req.param('last_name'),
                email:req.param('email'),
                password:req.param('password'),
                username:req.param('email'),
                role:'company'
            };

            var company_name = req.param('company_name');

            if (!company_name || company_name == "") {
                 res.view('404');
            }

            User.create(data_user).done(
                function (err, user) {
                    try {
                        if (err) {
                            return res.send({message:err.message}, 500)
                        } else {
                            async.waterfall([
                                function(callback) {
                                    Company.create({name:req.param("company_name"), payment_flag:req.param("payment_flag")}).done(function (err, company) {
                                        try {
                                            if (err) {
                                                //We need remove the user
                                                User.destroy({id:user.id}).done(
                                                    function (err2) {
                                                        try {
                                                            if (err2) {
                                                                return res.send({message:err2.detail}, 500);
                                                            } else {
                                                                return res.send({message:'Company:' + err.detail}, 500);
                                                            }
                                                        } catch (err) {
                                                            return res.send({message:err.message}, 500);
                                                        }
                                                    }
                                                );
                                            } else {
                                               callback(null, company);
                                            }
                                        } catch (err) {
                                            return res.send({message:err.message}, 500);
                                        }
                                    });
                                },
                                function(company, callback){
                                    CompanyUser.create({user_id:user.id, company_id:company.id}).done(
                                        function (err, company_user) {
                                            try {
                                                if (err) {
                                                    return res.send({message:err.detail}, 500);
                                                } else {
                                                    var feedEntry = {};
                                                    feedEntry.user_id = user.id;
                                                    feedEntry.user_role = 'company';
                                                    feedEntry.event_type ='newUser';
                                                    Feed.addFeedEvent(feedEntry);
                                                    callback(null, company);
                                                }
                                            } catch (err) {
                                                return res.send({message:err.message}, 500);
                                            }
                                        }
                                    );
                                },
                                //SEND email to admin
                                function(company) {
                                    var messageText = 'New company had registered, please welcome ' + company.name +
                                                      ' (' + data_user.email + ' ) to WRG community';
                                    var user = {
                                        hash: hashSetter.hashedValue(),
                                        email: mc.emailSettings.administratorEmail,
                                        message_text: messageText
                                    };
                                    templateresolver.resolveTemplate(user, 'adminEmail');
                                    sails.log.info('Emails successfully sent');
                                    res.send({message: "Company Created Successful"}, 200);
                                }
                            ]);

                        }
                    } catch (err) {
                        return res.send({message:err.message}, 500);
                    }
                }
            );
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    },

    new_college:function (req, res) {
        "use strict";

        try {
            var data_user = {
                first_name:req.param('name'),
                last_name:req.param('name'),
                email:req.param('email'),
                password:req.param('password'),
                username:req.param('email'),
                role:'college'
            };

            var college_entry = {
                name:req.param('name'),
                description:req.param('description'),
                school_list_id:req.param('school_id')
            };

            if (!college_entry.name || college_entry.name === "") {
                return res.send({message:"College name is empty"}, 500);
            }

            User.create(data_user).done(function (err, user) {
                try {
                    if (err) {
                        return res.send({message:err.message}, 500)
                    } else {
                        College.create(college_entry).done(function (err, college) {
                            try {
                                if (err) {
                                    //We need to remove the user because college wasn't created (error occurred)
                                    User.destroy({id:user.id}).done(function (error) {
                                        try {
                                            if (error) {
                                                return res.send({message:error.detail}, 500);
                                            } else {
                                                return res.send({message:'College:' + err.detail}, 500);
                                            }
                                        } catch (err) {
                                            return res.send({message:err.message}, 500);
                                        }
                                    });
                                } else {
                                    CollegeUser.create({user_id:user.id, college_id:college.id}).done(
                                        function (err, college_user) {
                                            try {
                                                if (err) {
                                                    return res.send({message:err.detail}, 500);
                                                } else {
                                                    return res.send({message:"College Created Successfully"}, 200);
                                                }
                                            } catch (err) {
                                                var feedEntry = {};
                                                feedEntry.user_id = user.id;
                                                feedEntry.user_role = 'college';
                                                feedEntry.event_type ='newUser';
                                                Feed.addFeedEvent(feedEntry);
                                                return res.send({message:err.message}, 500);
                                            }
                                        }
                                    );
                                }
                            } catch (err) {
                                return res.send({message:err.message}, 500);
                            }
                        });
                    }
                } catch (err) {
                    return res.send({message:err.message}, 500);
                }
            });
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    },

    update: function (req, res) {
        if(!req.isAuthenticated()) {
            sails.log.error('Not authenticated entry from User Controller');
            return  res.view('404');
        }
        var id = conversionutils.returnInteger(req.param('id'), 'Could not convert user id');
        try {
            var userId =  req.session.user.id;
            if (id === userId) {
                User.find()
                    .where({id : userId})
                    .exec(function(err, user) {
                        User.update({id: id}, req.body, function(err, user){
                            if (err) {
                                sails.log.error("Error updating user", err);
                                res.send(err,500);
                            } else {
                                sails.log.info('User updated');
                                res.send(user, 200);
                            }
                        });
                    });
            }
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    },

    changePassword: function(req, res){
        if(!req.isAuthenticated()) {
            sails.log.error('Not authenticated entry from User Controller');
            return  res.view('404');
        }
        try {
            var userId =  req.session.user.id;



                                        User.find()
                                            .where({id : userId})
                                            .exec(function(err, user) {
                                                if (user[0].facebook_uid !== null || user[0].linkedin_uid !== null || user[0].google_uid !== null) {
                                                    return res.send("Please visit your social network to change password", 500);
                                                }
                                                else {
                                                    bcrypt.compare(req.body.oldPassword, user[0].password, function (err, match) {
                                                        if (!match) {
                                                            res.send('Your old password is not correct.', 500);

                                                        }
                                                        else {
                                                            User.hashPassword(
                                                                req.body.password,
                                                                function (err, hash) {
                                                                    try {
                                                                        if (err) {
                                                                            return res.send(err, 500);
                                                                        } else {

                                                                            if (hash != '') {
                                                                                req.body.password = hash;
                                                                            }
                                                                            User.update(
                                                                                {id: userId},
                                                                                req.body,
                                                                                function (err, user) {
                                                                                    try {
                                                                                        if (err) {
                                                                                            return res.send({message: err.detail}, 500);
                                                                                        } else {
                                                                                            return res.send(user, 200);
                                                                                        }

                                                                                    } catch (err) {
                                                                                        return res.send({message: err.message}, 500);
                                                                                    }
                                                                                }
                                                                            );

                                                                        }

                                                                    } catch (err) {
                                                                        return res.send(err, 500);
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    });
                                                }

                                            });





        } catch (err) {
            return res.send({message:err.message}, 500);
        }

    }
};