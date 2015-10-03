'use strict';

var async = require('async');

module.exports = {

    create: function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Not authenticated entry from AwardController");
            return  res.view('404');
        }
        req.body.user_id = req.session.user.id;
        async.waterfall([
            function (callback) {
                FutureSelf.find()
                    .where({user_id: req.body.user_id, category_id: req.body.category_id})
                    .exec(function (err, future) {
                        if (err) {
                            res.send(err, 500);
                        } else {
                            if (future[0]) {
                                FutureSelf.update({user_id: req.body.user_id, category_id: req.body.category_id}, req.body, function (err, futureSelf) {
                                    if (err) {
                                        sails.log.error("Error updating group future self: ", err);
                                        res.send(err, 500);
                                    } else {
                                        sails.log.info("Future self updated");
                                        res.send(futureSelf, 200);
                                    }
                                });
                            } else {
                                callback(null);
                            }
                        }
                    });

            },
            function () {
                FutureSelf.create(req.body).done(function (err, future) {
                    if (err) {
                        console.log("Error create future self", err);
                        res.send(err, 500);
                    } else {
                        res.send(future, 200);
                    }
                })
            }
        ]);
    },

    getFutureSelf: function (req, res) {
        if (req.param('id') === null || req.param('id') === undefined) {
            sails.log.error('User is not allowed to be here ');
            return res.send({message: err.message}, 500);
        }
        else {
            var id = req.param('id'),
                user_id = req.session.user.id;
            var query = "SELECT FutureSelf.* FROM FutureSelf WHERE user_id=" + user_id;
        }
        try {
            FutureSelf.query(query, null,
                function (err, futureSelf) {
                    try {
                        if (err) {
                            sails.log.error('Error finding future self record. Error: ' + err);
                            res.send(err.message, 500);
                        } else {
                            sails.log.info('Future self records found.');
                            return res.send(futureSelf.rows, 200);
                        }
                    } catch (err) {
                        sails.log.error('Error finding future self record. Error: ' + err);
                        return res.send(err.message, 500);
                    }
                });
        }
        catch (err) {
            return res.send({message: err.message}, 500);
        }
    },

    sendMessage: function (req, res) {
        var categoryId = conversionutils.returnInteger(req.param('category_id')),
            points = req.param('points'),
            messageText = '',
            user_id = req.session.user.id;
        if (user_id === null || user_id === undefined || user_id === '') {
            sails.log.error('User is not allowed to be here ');
            return  res.view('404');
        } else {
            async.waterfall([
                function (callback) {
                    FutureSelf.find()
                        .where({user_id: user_id, category_id: categoryId})
                        .exec(function (err, future) {
                            if (err) {
                                sails.log.error('Cannot find future self record. Error: ' + err);
                                return res.send({message: err.message}, 500);
                            } else {
                                if (future.length === 1) {
                                    if (future[0].is_message_sent === true) {
                                        sails.log.info('Future self record found, send message');
                                        return res.send(future, 200);
                                    } else {
                                        sails.log.info('Future self record found, send message');
                                        // No need for distinction between reached goal and one that wasn't
                                        messageText = 'The deadline for your goal has arrived! Did you meet or exceed your goals? Which goals would you like to set next?';
                                        callback(null, messageText);
                                    }
                                }
                            }
                        });
                },
                function (messageText, callback) {
                    var body = {};
                    body.is_message_sent = true;
                    FutureSelf.update({user_id: user_id, category_id: categoryId}, body, function (err, futureSelf) {
                        if (err) {
                            sails.log.error('Error updating future self: ' + err);
                            res.send(err, 500);
                        } else {
                            sails.log.info('Future self updated');
                            callback(null, messageText);
                        }
                    });
                },
                function (messageText, callback) {
                    var body = {};
                    body.receiver_id = user_id;
                    body.owner_id = user_id;
                    body.sender_id = null;
                    body.content = messageText;
                    body.subject = 'Future Self Goal';
                    body.is_read = false;
                    body.is_flagged = false;
                    body.send_on = new Date();
                    body.is_deleted = false;

                    Message.new_update(body, function (err) {
                        try {
                            if (err) {
                                sails.log.error('Cannot update new message from future self: ' + err);
                                return res.send(err, 500);
                            } else {
                                sails.log.info('New message from future self sent');
                                callback(null, messageText);
                            }
                        } catch (err) {
                            sails.log.error('Cannot update new message from future self: ' + err);
                            return res.send({message: err.message}, 500);
                        }
                    });
                },
                function (messageText) {
                    User.findOneById(user_id).done(function (err, user) {
                        // Error handling
                        if (err) {
                            console.log(err);
                            return res.send(err, 500);
                        } else {
                            var user = {
                                hash: hashSetter.hashedValue(),
                                email: user.email,
                                user_id: user.id,
                                first_name: user.first_name,
                                message_text: messageText
                            };
                            templateresolver.resolveTemplate(user, 'futureSelf');
                            res.send({message: 'Sent'}, 200);
                        }
                    });
                }
            ]);
        }
    }
};
