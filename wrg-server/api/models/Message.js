/**
 * Message
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var mc = (require('../../config/mainConfig.js')());
var async = require('async');

module.exports = {

    attributes: {
        message_id:{
            type: 'string'
        },
        sender_id:{
            type: 'integer'
        },
        receiver_id:{
            type: 'integer',
            required: true
        },
        owner_id:{
            type: 'integer',
            required: true
        },
        group_id:{
            type: 'integer'
        },
        content:{
            type: 'string',
            required: true
        },
        subject:{
            type: 'string',
            required: true
        },
        is_deleted:{
            type: 'BOOLEAN'
        },
        is_read:{
            type: 'BOOLEAN'
        },
        is_flagged:{
            type: 'BOOLEAN'
        },
        send_on: {
            type: 'date'
        },
        toJSON: function() {
            var obj = this.toObject();
            //delete obj.password;

            return obj;
        }
    },

    new_update:function (data, next) {
        try {
            //is new
            if (data.id === undefined || data.id === "") {
                delete data.id;
                Message.create(data).done(function (err, message) {
                    try {
                        if (err) {
                            next(err, null);
                        } else {
                            next(null, message);
                        }
                    } catch (err) {
                        next(err);
                    }
                });

                //is update
            } else {

                Message.update({
                        id:data.id
                    },
                    data,
                    function (err, message) {
                        try {
                            if (err) {
                                next(err, null);
                            } else {
                                if (message.length === 1) {
                                    next(null, message[0]);
                                } else {
                                    next({message:'Nothing to update'});
                                }
                            }
                        } catch (err) {
                            next(err);
                        }
                    }
                );
            }
        } catch (err) {
            next(err);
        }
    },

    sendMassEmail: function (req, res, type) {
        var messageText = req.param('content');

        async.waterfall([
            function (callback) {
                var query = '';
                if(type === 'all'){
                    query = 'SELECT UserTable.* FROM ' + mc.dbSettings.dbName + '.public.User as UserTable';
                } else {
                    query = "SELECT UserTable.* FROM " + mc.dbSettings.dbName + ".public.User as UserTable WHERE UserTable.role = '" + type + "'";
                }
                var usersArray = [];
                User.query(query, null, function (err, users){
                    if (err) {
                        sails.log.error('An error occurred: ', err);
                        res.send(err, 500);
                    } else {
                        for (var i = 0; i < users.rows.length; i++) {
                            usersArray.push(users.rows[i]);
                        }
                        callback(null, usersArray, messageText)
                    }
                });
            },
            function(usersArray, messageText) {
                for( var i = 0; i < usersArray.length; i++) {
                    var user = {
                        hash: hashSetter.hashedValue(),
                        email: usersArray[i].email,
                        user_id: usersArray[i].id,
                        first_name: usersArray[i].first_name,
                        message_text: messageText
                    };
                    templateresolver.resolveTemplate(user, 'massEmail');
                }
                sails.log.info('Emails successfully sent');
                res.send({message: 'Emails successfully sent'}, 200);
            }
        ]);
    }

};


