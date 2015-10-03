/**
 * Student
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */
"use strict";
var async = require('async');

module.exports = {

    attributes: {
        school: {
            type: 'string'
        },
        major: {
            type: 'string'
        },
        graduation_month: {
            type: 'integer'
        },
        graduation_year : {
            type:  'integer'
        },
        school_list_id: {
            type: 'integer'
        },
        personal_website: {
            type: 'string'
        },
        gpa:{
            type: 'float'
        },
        tagline: {
            type: 'string'
        },
        tagline_keywords: {
            type: 'string'
        },
        profile_image: {
            type: 'text'
        },
        personal_statement: {
            type: 'string'
        },
        video_url: {
            type: 'string'
        },
        facebook_url: {
            type: 'string'
        },
        google_url: {
            type: 'string'
        },
        twitter_url: {
            type: 'string'
        },
        linkedin_url: {
            type: 'string'
        },
        user_id: {
            type: 'int'
        },
        toJSON: function() {
            var obj = this.toObject();
            //delete obj.password
            var month =[];
            month[0]="January";
            month[1]="February";
            month[2]="March";
            month[3]="April";
            month[4]="May";
            month[5]="June";
            month[6]="July";
            month[7]="August";
            month[8]="September";
            month[9]="October";
            month[10]="November";
            month[11]="December";
            obj["month"] = month[parseInt(obj.graduation_month)];
            return obj;
        }
    },

    beforeCreate: function(student, cb) {
        //final student coercion for school,major... add more values if required.
        try
        {
            if(student.alma_mater === null){
                student.alma_mater = "";
            }
            if(student.major === null){
                student.major = "";
            }
        }
        catch(err) {

            sails.log.error("Originated at StudentCtrl: " + err);
        }
        cb(null, student);
    },


    beforeUpdate: function(values, next) {
        //TODO Find out why is this here? Do we need it?
        //Remember that I spend 3 hours setting a variable tutorial to true becouse of this native override method.

        try {
            var user_id = values.user_id === undefined ? 0 : values.user_id;
            Student.values = values;
            User.update({id: user_id},{first_name : Student.values.first_name,last_name: Student.values.last_name}, function(err,users){
                try{
                    if (err){
                        sails.log.error(err);
                        next(err);
                    } else {
                        sails.log.info('Users updated');
                        next();
                    }
                } catch(err) {
                    sails.log.error(err);
                    next(err);
                }
            });
        }catch(err){
            sails.log.error(err);
            next(err);
        }
    },

    updateSkill: function(key, next) {
        sails.log.error(key);
        if (key === 1) {
            next(null)
        } else {
            Student.updateSkill(key + 1, next);
        }
    },

    getUser : function (user_id, res, student) {
        // my_id is for read only view, to see readers role, and hence know which privacy settings to look at
        // it is passed as parameter only from 'you' method
        User.findOneById(user_id).done(function (err, user) {
            if (err) {
                sails.log.error(err);
                return res.send(err, 500);
            } else {
                sails.log.info('Student found with id', user_id);
                student.first_name = user.first_name;
                student.last_name = user.last_name;
                return res.send(student, 200);
            }
        });

    },

    getReadOnlyUser: function (student, privacySettings, res) {
        async.waterfall ([
            function (callback) {
                if (privacySettings.privacy_awards === true) {
                    Award.find({
                        student_id: student.id
                    }).done(function (err, award) {
                            if (err) {
                                sails.log.error(err);
                                return res.send(err, 500);
                            } else {
                                sails.log.info('    Awards found for student', student.id);
                                student.awards = award;
                                //Skills
                                callback(null, student, privacySettings, res);
                            }
                        });
                } else {
                    callback(null, student, privacySettings, res);
                }

            },
            function (student, privacySettings, res, callback) {
                if (privacySettings.privacy_skills === true) {
                    Skill.find({
                        student_id: student.id
                    }).done(function (err, skill) {
                            if (err) {
                                sails.log.error(err);
                                return res.send(err, 500);
                            } else {
                                sails.log.info('    Skills found for student', student.id);
                                student.skills = skill;
                                callback(null, student, privacySettings, res);
                            }
                        });
                } else {
                    callback(null, student, privacySettings, res);
                }
            },
            function (student, privacySettings, res, callback) {
                if(privacySettings.privacy_wrg === true || privacySettings.privacy_future === true ) {
                    Experience.find({
                        student_id: student.id
                    }).done(function (err, experience) {
                            if (err) {
                                sails.log.error(err);
                                return res.send(err, 500);
                            } else {
                                sails.log.info('    Experiences found for student', student.id);
                                student.experiences = experience;

                                var ranking = [];
                                for (var i = 0; i < 7; i++) {
                                    ranking[i] = 0;
                                }
                                if (experience.length > 0) {
                                    var array_where = [];
                                    for (var i = 0; i < experience.length; i++) {
                                        array_where[i] = {experience_id: experience[i].id};
                                    }
                                    if (privacySettings.privacy_future === true && privacySettings.privacy_wrg === false ) {
                                        // Flag for client
                                        student.notExperience = true;
                                    }
                                    callback(null, student, privacySettings, array_where, experience, ranking, res)
                                }
                                else {

                                    student.ranking = ranking;
                                    return res.send(student, 200);
                                }
                            }
                        });
                } else {

                    return res.send(student, 200);
                }
            },
            function (student, privacySettings, array_where, experience, ranking, res, callback) {
                ExperienceMedia.find({
                    where: {
                        or: array_where
                    }
                }).done(
                    function (err, expmedia) {
                        try {
                            if (err) {
                                sails.log.error(err);
                                return res.send(err, 500)
                            } else {
                                sails.log.info('    Media found for student', student.id);
                                for (var i = 0; i < expmedia.length; i++) {
                                    for (var j = 0; j < student.experiences.length; j++) {
                                        if (student.experiences[j].media === undefined) {
                                            student.experiences[j].media = [];
                                        }
                                        if (student.experiences[j].id === expmedia[i].experience_id) {
                                            student.experiences[j].media[student.experiences[j].media.length] = expmedia[i];
                                        }
                                    }
                                }
                                var array_where = [];
                                for (var i = 0; i < experience.length; i++) {
                                    array_where[i] = {experience_id: experience[i].id};
                                }
                                callback(null, student, privacySettings, array_where, ranking, res);
                            }
                        } catch (err) {
                            return res.send(err, 500);
                        }
                    }
                );

            },
            function (student, privacySettings, array_where, ranking, res, callback) {
                ExperienceCategory.find({
                    where: {
                        or: array_where
                    }
                }).done(function (err, expcat) {
                    if (err) {
                        sails.log.error(err);
                        return res.send(err, 500);
                    } else {
                        sails.log.info('    Categories found for student: ', student.id);
                        for (var i = 0; i < expcat.length; i++) {
                            for (var j = 0; j < student.experiences.length; j++) {
                                if (student.experiences[j].categories === undefined) {
                                    student.experiences[j].categories = [];
                                }
                                if (student.experiences[j].id == expcat[i].experience_id) {
                                    student.experiences[j].categories[student.experiences[j].categories.length] = expcat[i];
                                }
                            }
                            ranking[expcat[i].category_id]++;
                        }
                        //RANKING
                        sails.log.info('Calculate rank for student: ', student.id);
                        student.ranking = ranking;

                        return res.send(student, 200);
                    }
                });
            }
        ]);
    },


    findAppliedJobs: function (req, res) {
        var applicantId = req.session.user.id;

        if (applicantId === null || applicantId === undefined || applicantId === '') {
            sails.log.error('User is not valid - Job Controller');
            res.send({message: 'ERROR'}, 500);
        } else {
            var query = 'SELECT Job.*, Company.name as company_name, Company.state as company_state, Company.city as company_city, Company.profile_image as company_image' +
                ' FROM Job, Company, JobApplication ' +
                'WHERE Job.company_id = Company.id AND Job.id = JobApplication.job_id AND JobApplication.applicant_id =' + applicantId;

            try {
                Job.query(query, null,
                    function (err, jobs) {
                        try {
                            if (err) {
                                sails.log.error(err.message);
                                res.send(err.message, 500);
                            } else {
                                sails.log.info('Applied jobs found');
                                var jobslist = jobs.rows;
                                for (var i = 0; i < jobslist.length; i++) {
                                    var datetime = jobslist[i].createdAt;
                                    jobslist[i].postedOn = datetime.toDateString();
                                }
                                return res.send({request: jobslist}, 200);
                            }
                        } catch (err) {
                            sails.log.error(err.message);
                            return res.send(err.message, 500);
                        }
                    });
            }
            catch (err) {
                return res.send({message:err.message}, 500);
            }
        }
    },

    getBasicStudentData: function(userId, res, callback) {
        var  query = "SELECT school, major, id, tagline_keywords FROM student WHERE CAST(user_id as FLOAT) = " + userId;
        Student.query(query, null, function (err, student) {
            if (err) {
                sails.log.error('Error: ' + error);
                res.send(err, 500);
            }
            else {
                if (student.rows[0]) {
                    var currentUserSchool = student.rows[0].school,
                        currentUserMajor = student.rows[0].major,
                        currentUserStudentId = student.rows[0].id,
                        currentUserObjective = student.rows[0].tagline_keywords;
                    callback(currentUserSchool, currentUserMajor, currentUserStudentId, currentUserObjective);
                }
                else {
                    res.send(err, 500);
                }
            }
        })
    }
};
