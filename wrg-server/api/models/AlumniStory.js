/**
 * AlumniStory
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */
var async = require('async');

module.exports = {

    attributes: {
        alma_mater: {
            type: 'string'
        },
        school_list_id: {
            type: 'integer'
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
        highest_edu_level: {
            type: 'string'
        },
        company: {
            type: 'string'
        },
        job_title:{
            type: 'string'
        },
        advice: {
            type: 'text'
        },
        activities: {
            type: 'text'
        },
        personal_url: {
            type: 'text'
        },
        profile_image: {
            type: 'text'
        },
        profile_video: {
            type: 'text'
        },
        user_id: {
            type: 'int'
        },
        hindsight: {
          type: 'text'
        },

        industry: {
           type: 'string'
        },
        toJSON: function() {
            var obj = this.toObject();
            //delete obj.user_id;
            return obj;
        }
    },

    beforeCreate: function(alumni, cb) {
        //final alumni coercion for school,major... add more values if required.
        try
        {
            if(alumni.alma_mater === null){
                alumni.alma_mater = "";
            }
            if(alumni.major === null){
                alumni.major = "";
            }
        }
        catch(err) {

            sails.log.error("Originated at AlumniStoryCtrl: " + err);
        }
        cb(null, alumni);
    },

    beforeUpdate: function(values,next){
        try{
            user_id = values.user_id === undefined ? 0 : values.user_id;
            User.update({id: user_id},{first_name : values.first_name,last_name: values.last_name},function(err, users){
                try{
                    if (err){
                        console.log("error update user in alumni", err.message);
                        next(err);
                    }else{
                        console.log("Users updated: ", users);
                        next();
                    }
                }catch(err){
                    console.log("error update alumni", err.message);
                    next(err);
                }
            });
        }catch(err){
            console.log("error update alumni", err.message);
            next(err);
        }
    },

    getUser : function (userId, myId, res, alumni, role) {
        async.waterfall([
            function (callback) {
                User.findOneById(userId).done(function (err, user) {
                    if (err) {
                        sails.log.error("Cannot find user. Error: "+ err);
                        return res.send(err, 500);
                    } else {
                        var viewerRole;
                        sails.log.info("User found with id: "+ userId);
                        if (role) {
                            sails.log.info("Viewer role is GENERAL");
                            viewerRole = 'general'
                        } else if(user.role === 'alumni' || user.role === 'student') {
                            viewerRole = 'friend';
                        } else if (user.role === 'company'){
                            viewerRole = 'company';
                        } else if (user.role === 'college'){
                            viewerRole = 'college';
                        }

                        callback(null, alumni, viewerRole);
                    }
                });
            },
            function (alumni, viewerRole, callback) {
                Privacy.find({user_id: myId, role: viewerRole}).done(function (err, privacy) {
                    if (err) {
                        sails.log.error('Error finding privacy', err);
                        return res.send(err, 500);
                    } else {
                        var privacySettings = {};
                        console.log("ovo je viewer role" + viewerRole)
                        sails.log.info("    Privacy settings found for alumni");
                         //TODO: Determine do we need special college role in Client UI, or setting all setting to true will work here
                        if(viewerRole === "college") {
                            privacySettings.privacy_skills = true;
                            privacySettings.privacy_wrg = true;
                            privacySettings.privacy_awards = true;
                            privacySettings.privacy_connections = true;
                        } else {
                            privacySettings.privacy_skills = privacy[0].skills;
                            privacySettings.privacy_wrg = privacy[0].wrg_points;
                            privacySettings.privacy_awards = privacy[0].awards;
                            privacySettings.privacy_connections = privacy[0].connections;
                        }

                        callback(null, alumni, privacySettings);
                    }
                });
            },
            function (alumni, privacySettings, callback) {
               if (privacySettings.privacy_connections === false) {
                   delete alumni.connections;
               }
               callback(null, alumni, privacySettings);
            },
            function (alumni, privacySettings, callback) {
                if(myId){
                    User.findOneById(myId).done(function (err, user) {
                        if (err) {
                            sails.log.info(err);
                            return res.send(err, 500);
                        } else {
                            sails.log.info("Alumni found with id:", myId);
                            alumni.first_name = user.first_name;
                            alumni.last_name = user.last_name;
                            callback(null, alumni, privacySettings);
                        }
                    });
                }
            },
            function (alumni, privacySettings, callback) {
                if(privacySettings.privacy_awards === true) {
                    ProfessionalAward.find({alumnistory_id: alumni.id}).done(function (err, award) {
                        if (err) {
                            sails.log.info(err);
                            return res.send(err, 500);
                        } else {
                            sails.log.info("Awards found for alumni: ", alumni.id);
                            alumni.awards = award;
                            callback(null, alumni, privacySettings);
                        }
                    });
                } else {
                    callback(null, alumni, privacySettings);
                }
            },
            function (alumni, privacySettings, callback) {
                if(privacySettings.privacy_skills === true) {
                    ProfessionalSkill.find({alumnistory_id: alumni.id}).done(function (err, skill) {
                        if (err) {
                            sails.log.info(err);
                            return res.send(err, 500);
                        } else {
                            sails.log.info("Skills found for alumni:", alumni.id);
                            alumni.skills = skill;
                            callback(null, alumni, privacySettings);
                        }
                    });
                } else {
                    callback(null, alumni, privacySettings);
                }

            },
            function (alumni, privacySettings, callback) {
                if(privacySettings.privacy_wrg === true) {
                    ProfessionalExperience.find({alumnistory_id: alumni.id}).done(function (err, experience) {
                        if (err) {
                            sails.log.info(err);
                            return res.send(err, 500);
                        } else {
                            sails.log.info("Experiences found to alumni:", alumni.id);
                            alumni.experiences = experience;

                            var ranking = [];
                            for (var i = 0; i < 7; i++) {
                                ranking[i] = 0;
                            }
                            if (experience.length > 0) {
                                var array_where = [];
                                for (var i = 0; i < experience.length; i++) {
                                    array_where[i] = {experience_id: experience[i].id};
                                }
                                callback(null, alumni, array_where, experience, ranking);
                            }
                            else {
                                alumni.ranking = ranking;
                                return res.send(alumni, 200);
                            }
                        }
                    });
                } else {
                    return res.send(alumni, 200);
                }
            },
            function (alumni, array_where, experience, ranking, callback) {
                ProfessionalExperienceMedia.find({
                    where: {
                        or: array_where
                    }
                }).done(
                    function (err, expmedia) {
                        try {
                            if (err) {
                                sails.log.error("Experience media not found..." + err);
                                return res.send(err, 500)
                            } else {
                                sails.log.info("Media found for alumni:", alumni.id);
                                for (var i = 0; i < expmedia.length; i++) {
                                    for (var j = 0; j < alumni.experiences.length; j++) {
                                        if (alumni.experiences[j].media === undefined) {
                                            alumni.experiences[j].media = [];
                                        }
                                        if (alumni.experiences[j].id === expmedia[i].experience_id) {
                                            alumni.experiences[j].media[alumni.experiences[j].media.length] = expmedia[i];
                                        }
                                    }
                                }
                                var array_where = [];
                                for (var i = 0; i < experience.length; i++) {
                                    array_where[i] = {experience_id: experience[i].id};
                                }
                                callback(null, alumni, array_where, ranking);
                            }
                        } catch (err) {
                            sails.log.error("Experience media not found..." + err);
                            return res.send(err, 500);
                        }
                    }
                );
            },
            function (alumni, array_where, ranking, callback) {
                ProfessionalExperienceCategory.find({
                    where: {
                        or: array_where
                    }
                }).done(function (err, expcat) {
                        if (err) {
                            sails.log.error( "Experience category not found..." + err);
                            return res.send(err, 500);
                        } else {
                            sails.log.info("Categories found to alumni:", alumni.id);
                            for (var i = 0; i < expcat.length; i++) {
                                for (var j = 0; j < alumni.experiences.length; j++) {
                                    if (alumni.experiences[j].categories === undefined) {
                                        alumni.experiences[j].categories = [];
                                    }
                                    if (alumni.experiences[j].id == expcat[i].experience_id) {
                                        alumni.experiences[j].categories[alumni.experiences[j].categories.length] = expcat[i];
                                    }
                                }
                                ranking[expcat[i].category_id]++;
                            }
                            sails.log.info("Calculate rank for alumni:", alumni.id);
                            alumni.ranking = ranking;
                            return res.send(alumni, 200);
                        }
                    });
            }
        ]);
    }
};
