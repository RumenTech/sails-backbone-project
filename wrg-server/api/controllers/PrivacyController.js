'use strict';
var async = require ('async');

module.exports = {

    create:function (req, res) {
        if(!req.isAuthenticated()) {
            sails.log.error('Not authenticated entry from Privacy Create');
            return res.view('404');
        }
        try {
            var userId = req.session.user.id;
            req.body.user_id = userId;
            Privacy.create(req.body).done(function(err, privacy) {
                if (err) {
                    sails.log.error('Cannot create privacy', err);
                    res.send(err, 500);
                } else {
                    sails.log.info('Privacy created');
                    res.send(privacy, 200);
                }
            });

        } catch (err) {
            return res.send({message:err}, 500);
        }
    },

    update:function (req, res) {
        if(!req.isAuthenticated()) {
            sails.log.error('Not authenticated entry from Privacy Update');
            return  res.view('404');
        }
        var userId =  req.session.user.id;
        if (userId !== null && userId !== undefined) {
            try {
                Privacy.find()
                    .where({user_id: userId})
                    .done(function (err, privacy) {
                        if (err) {
                            return res.send({message: err}, 500);
                        } else {
                            Privacy.update({user_id: userId, role: req.body.role}, req.body, function(err, privacy){
                                if (err){
                                    sails.log.error('Error updating privacy. Error: ', err);
                                    res.send(err, 500);
                                } else{
                                    sails.log.info('Privacy updated');
                                    res.send(privacy, 200);
                                }
                            });
                        }

                    });
            } catch (err) {
                return res.send({message:err.message}, 500);
            }
        } else {
            sails.log.error(err);
            return res.send({message:err.message}, 500);
        }
    },


    getPrivacySettings : function(req, res) {
        var userId =  req.session.user.id;
        Privacy.find()
            .where({user_id: userId})
            .done(function (err, privacy) {
                if (err) {
                    sails.log.error(err);
                    return res.send({message: err}, 500);
                } else {
                    sails.log.info('Privacy settings get successful');
                    res.send(privacy, 200);
                }
            });
    },

    populateStudentPrivacy: function (req, res) {
        var privacyContainer = {};
        privacyContainer.gpa = true;
        privacyContainer.wrg_points = true;
        privacyContainer.future_self = true;
        privacyContainer.skills = true;
        privacyContainer.awards = true;
        privacyContainer.video = true;
        privacyContainer.connections = true;
        User.find()
            .where({role: 'student'})
            .done(function (err, users) {
                for (var i=0; i < users.length; i++) {
                    privacyContainer.role = 'friend';
                    privacyContainer.user_id = users[i].id;
                    Privacy.create(privacyContainer).done(function(err, privacy) {
                        if (err) {
                            sails.log.error('Cannot create privacy', err);
                            res.send(err, 500);
                        } else {
                            sails.log.info('Privacy created');
                            res.send(privacy, 200);
                        }
                    });
                }
                for (var i=0; i < users.length; i++) {
                    privacyContainer.role = 'company';
                    privacyContainer.user_id = users[i].id;
                    Privacy.create(privacyContainer).done(function(err, privacy) {
                        if (err) {
                            sails.log.error('Cannot create privacy', err);
                            res.send(err, 500);
                        } else {
                            sails.log.info('Privacy created');
                            res.send(privacy, 200);
                        }
                    });
                }
        });

    },

    populateAlumniPrivacy: function (req, res) {
        var privacyContainer = {};
        privacyContainer.gpa = true;
        privacyContainer.wrg_points = true;
        privacyContainer.future_self = true;
        privacyContainer.skills = true;
        privacyContainer.awards = true;
        privacyContainer.video = true;
        privacyContainer.connections = true;
        User.find()
            .where({role: 'alumni'})
            .done(function (err, users) {
                for (var i=0; i < users.length; i++) {
                    privacyContainer.role = 'friend';
                    privacyContainer.user_id = users[i].id;
                    Privacy.create(privacyContainer).done(function(err, privacy) {
                        if (err) {
                            sails.log.error('Cannot create privacy', err);
                            res.send(err, 500);
                        } else {
                            sails.log.info('Privacy created');
                            res.send(privacy, 200);
                        }
                    });
                }
                for (var i=0; i < users.length; i++) {
                    privacyContainer.role = 'company';
                    privacyContainer.user_id = users[i].id;
                    Privacy.create(privacyContainer).done(function(err, privacy) {
                        if (err) {
                            sails.log.error('Cannot create privacy', err);
                            res.send(err, 500);
                        } else {
                            sails.log.info('Privacy created');
                            res.send(privacy, 200);
                        }
                    });
                }
            });
    },

    populateGeneralPrivacy: function (req, res) {
        var privacyContainer = {};
        privacyContainer.gpa = false;
        privacyContainer.wrg_points = true;
        privacyContainer.future_self = false;
        privacyContainer.skills = true;
        privacyContainer.awards = false;
        privacyContainer.video = false;
        privacyContainer.connections = false;

        User.find()
            .where({role: 'alumni'})
            .done(function (err, users) {
                for (var i=0; i < users.length; i++) {
                    privacyContainer.role = 'general';
                    privacyContainer.user_id = users[i].id;
                    Privacy.create(privacyContainer).done(function(err, privacy) {
                        if (err) {
                            sails.log.error('Cannot create privacy', err);
                            res.send(err, 500);
                        } else {
                            sails.log.info('General privacy for alumni created');
                            res.send(privacy, 200);
                        }
                    });
                }
            });

        User.find()
            .where({role: 'student'})
            .done(function (err, users) {
                for (var i=0; i < users.length; i++) {
                    privacyContainer.role = 'general';
                    privacyContainer.user_id = users[i].id;
                    Privacy.create(privacyContainer).done(function(err, privacy) {
                        if (err) {
                            sails.log.error('Cannot create privacy', err);
                            res.send(err, 500);
                        } else {
                            sails.log.info('General privacy for student created');
                            res.send(privacy, 200);
                        }
                    });
                }
            });
    },

    AlumniPrivacy: function (req, res) {
        var query = 'SELECT AlumniStory.* FROM AlumniStory';
        var alumni = [];
        async.waterfall([
            function (callback) {
                AlumniStory.query(query, null, function(err, alumnus) {
                    if (err) {
                        res.send(err,500);
                    } else {
                        alumni = alumnus.rows;
                        callback(null, alumni)
                    }
                });
            },
            function (alumni, callback) {
                var alumniIds = [];
                for (var i =0; i < alumni.length; i++) {
                    alumniIds[i] = conversionutils.returnInteger(alumni[i].user_id);
                }
                var query = 'SELECT Privacy.* FROM Privacy',
                    privacies = [];
                Privacy.query(query, null, function(err, privacy) {
                    if (err) {
                        res.send(err,500);
                    } else {
                        privacies = privacy.rows;
                        callback(null, privacies, alumniIds)
                    }
                });
            },
            function (privacies, alumniIds) {
                var privacyContainer = {};
                privacyContainer.gpa = true;
                privacyContainer.wrg_points = true;
                privacyContainer.future_self = true;
                privacyContainer.skills = true;
                privacyContainer.awards = true;
                privacyContainer.video = true;
                privacyContainer.connections = true;
                var privacyIds = [];
                for (var i =0; i < privacies.length; i++) {
                    privacyIds[i] = privacies[i].user_id;
                }

                for (var i = 0; i < alumniIds.length; i++) {
                    var k=0;
                    for (var j = 0; j < privacyIds.length; j++) {

                         if (alumniIds[i] !== privacyIds[j]){
                             k++;
                         }
                        if (k === privacyIds.length - 1) {
                            sails.log.info ('Missing: ' + alumniIds[i]);
                            privacyContainer.user_id = alumniIds[i];
                            Privacy.createFriendPrivacy(privacyContainer, 'friend');
                            Privacy.createFriendPrivacy(privacyContainer, 'company');

                        }
                    }
                }
                res.send({message: 'Done!'}, 200);
            }

        ]);


    },


    _config:{}

};
