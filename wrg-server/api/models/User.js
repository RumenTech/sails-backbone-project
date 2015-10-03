/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */
var bcrypt = require('bcryptjs');
//var activationSetter = require('../services/activationSetter.js');
var wrgMailer = require('../services/templateResolver.js'),
    async = require('async');


"use strict";


module.exports = {

    attributes: {
        username: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true
        },
        email:{
            type: 'email',
            required: true,
            unique: true
        },
        role :{
            type:  'string'
        },
        first_name:{
            type: 'string'
        },
        last_name:{
            type: 'string'
        },
        external_login :{
            type: 'string'
        },
        facebook_uid:{
            type: 'string'
        },
        google_uid:{
            type: 'string'
        },
        linkedin_uid:{
            type: 'string'
        },
        activated:{
            type: 'boolean'
        },
        tutorial:{
            type: 'boolean'
        },
         //Used to track if user is activated or not
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            //delete obj.role;
            delete obj.facebook_uid;
            delete obj.google_uid;
            delete obj.linkedin_uid;
            return obj;
        }
    },

    beforeCreate: function(user, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                }else{
                    user.password = hash;
                    user.activated = false; //by default, new user is not activated.
                    user.tutorial = true;  //Tutorial will be shown only once on Client
                    cb(null, user);
                }
            });
        });
    },


    afterCreate:  function(user, cb) {
        //Get a GUID
        //TODO Lower the amount of variables
        //TODO IMplement one input parameter for setActivation

        var calculatedHash =  hashSetter.hashedValue();

        user.hash = calculatedHash;

        activationSetter.setActivation (user);

        templateresolver.resolveTemplate(user, 'activation');
        //wrgMailer.sendMail(user, 'activation');
        cb(null, user);
    },

    hashPassword: function(token, cb) {
        if (token=='')
            cb(null, '');
        else{
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(token, salt, function(err, hash) {
                    if (err) {
                        console.log(err);
                        cb(err);
                    }else{
                        cb(null, hash);
                    }
                });
            });
        }
    },

    setStudentPrivacy: function (user_id, mainCallback) {
        var privacyContainer = {};
        privacyContainer.user_id = user_id;
        privacyContainer.role = 'friend';
        privacyContainer.gpa = true;
        privacyContainer.wrg_points = true;
        privacyContainer.future_self = true;
        privacyContainer.skills = true;
        privacyContainer.awards = true;
        privacyContainer.video = true;
        privacyContainer.connections = true;
        async.waterfall([
            function(callback) {
                Privacy.create(privacyContainer).done(function(err, privacy) {
                    if (err) {
                        sails.log.error('Cannot create friend privacy: ', err);
                        res.send(err, 500);
                    } else {
                        sails.log.info('Friend privacy created. User id: ' + user_id);
                        callback(null);
                    }
                });
            },
            function (callback) {
                privacyContainer.role = 'company';
                Privacy.create(privacyContainer).done(function(err, privacy) {
                    if (err) {
                        sails.log.error('Cannot create employer privacy: ', err);
                        res.send(err, 500);
                    } else {
                        sails.log.info('Employer privacy created. User id: ' + user_id);
                        callback(null);
                    }
                });
            },
            function () {
                privacyContainer.role = 'general';
                privacyContainer.gpa = false;
                privacyContainer.future_self = false;
                privacyContainer.awards = false;
                privacyContainer.video = false;
                privacyContainer.connections = false;
                Privacy.create(privacyContainer).done(function(err, privacy) {
                    if (err) {
                        sails.log.error('Cannot create general public privacy: ', err);
                        res.send(err, 500);
                    } else {
                        sails.log.info('General public privacy created. User id: ' + user_id);
                        mainCallback();
                    }
                });
            }
        ]);
    },

    setAlumnusPrivacy: function (user_id, mainCallback) {
        var privacyContainer = {};
        privacyContainer.user_id = user_id;
        privacyContainer.role = 'friend';
        privacyContainer.wrg_points = true;
        privacyContainer.skills = true;
        privacyContainer.awards = true;
        privacyContainer.connections = true;
        async.waterfall([
            function(callback) {
                Privacy.create(privacyContainer).done(function(err, privacy) {
                    if (err) {
                        sails.log.error('Cannot create friend privacy: ', err);
                        res.send(err, 500);
                    } else {
                        sails.log.info('Friend privacy for alumnus created. User id: ' + user_id);
                        callback(null);
                    }
                });
            },
            function (callback) {
                privacyContainer.role = 'company';
                Privacy.create(privacyContainer).done(function(err, privacy) {
                    if (err) {
                        sails.log.error('Cannot create employer privacy: ', err);
                        res.send(err, 500);
                    } else {
                        sails.log.info('Employer privacy for alumnus created. User id: ' + user_id);
                        callback(null);
                    }
                });
            },
            function () {
                privacyContainer.role = 'general';
                privacyContainer.awards = false;
                privacyContainer.connections = false;
                Privacy.create(privacyContainer).done(function(err, privacy) {
                    if (err) {
                        sails.log.error('Cannot create general public privacy: ', err);
                        res.send(err, 500);
                    } else {
                        sails.log.info('General public privacy for alumnus created. User id: ' + user_id);
                        mainCallback();
                    }
                });
            }
        ]);
    }
};