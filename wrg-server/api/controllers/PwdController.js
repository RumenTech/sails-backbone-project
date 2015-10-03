/**
 * Pwd reset Controller
 * Accetping the following URL format: http://localhost:1337/changepwd?tokenizer=15a336ea-09e8-4559-9792-036570e206b2
 * @module        :: Controller
 * @description    :: Contains logic for handling requests.
 */

"use strict";

var fs = require('fs');
var ejs = require('ejs');
var bcrypt = require('bcryptjs');
var mainConfigFile = (require('../../config/mainConfig.js')());


module.exports = {

    reset: function (req, res) {

        //Grab the initial values from the form
        var passOne = req.body.password;
        var passTwo = req.body.confirm_password;
        var hashFinal = req.body.val;


        //First line of defense
        if (typeof(passOne) === "undefined" || typeof(passTwo) === "undefined") {
            return res.view('404');
        }

        //Second line of Defense. This is intended and serious breach!!!
        if (passOne !== passTwo) {
            //get the bad guys information
            hackingharvester.proccessReq(req, "PwdCtr - Trying to forge password creation");
            return res.view('404');
        }

        PwdReq.find()
            .where({ hash: hashFinal })
            .exec(function (err, users) {
                //final line of defense
                if (users.length === 0) {
                    hackingharvester.proccessReq(req, "PwdCtr - Trying to forge password creation");
                    return res.view('404');
                }
                if (err) {
                    sails.log.error(err);
                    return res.view('404');
                }

                //Convert this timefield to UNIX format (January 1, 1970)
                var createdAtDB = Date.parse(users[0].createdAt);
                var currentTime = new Date().getTime();
                //Time in seconds
                var result = (currentTime - createdAtDB) / 1000;
                result = Math.round(result);
                if (result < mainConfigFile.appSettings.userPwdResetTimeout && passOne === passTwo) {
                    //let him
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(passOne, salt, function (err, hash) {
                            if (err) {
                                sails.log.error(err);
                                cb(err);
                            } else {
                                //if the encyption is success
                                //update the user with the new pass!!!
                                passTwo = hash;
                                User.update({id: users[0].user_id}, {
                                    password: passTwo
                                }, function (err, users) {
                                    // Error handling
                                    if (err) {
                                        sails.log.error(err);
                                        return res.send({message:err.message}, 500);
                                    } else {
                                        //TODO Another callback in here
                                        //Clean the mess we made, meaning delete the has from the db
                                        PwdReq.destroy()
                                            .where({ hash: hashFinal })
                                            .exec(function (err, users) {
                                                sails.log.info('Password changed'); //TODO Move this to template!!!
                                                // var template = '<a href="http://localhost:7000/">Password Changed. Redirecting...</a> <script type="text/javascript"> (function(){setTimeout(function(){window.location.href="http://localhost:7000";},4000);})(); </script>';
                                                var template = '<a href=" ' + mainConfigFile.appSettings.clientLocation + ' ">Password Changed. Redirecting...</a> <script type="text/javascript"> (function(){setTimeout(function(){window.location.href="' + mainConfigFile.appSettings.clientLocation + '";},4000);})(); </script>';

                                                return res.send(template);
                                            });
                                    }
                                });
                            }
                        });
                    });
                    sails.log.info("Yes let him. Request is not older then one hour: Result: " + result);
                } else {
                    //dont let him
                    sails.log.error("No, dont let him. Request is older then one hour: Result: " + result);
                    return res.send("Password is not Changed!!!");
                }
            });

    },

    checker: function (req, res) {
        var phrase = req.query.tokenizer;

        if (typeof(phrase) === "undefined") {
            return res.view('404');
        };

        PwdReq.findByHash(phrase).done(
            function (err, hashInDb) {
                try {
                    if (err) {
                        return res.send({message: err}, 500);
                    } else {
                        //It Seems that the request for password change is VALID
                        //Let him pass through
                        if (hashInDb.length > 0) {
                            fs.readFile('./views/passreset.ejs', 'utf8', function (err, data) {
                                if (err) throw err;
                                var compiled = ejs.compile(data);
                                var renderedHTML = compiled(hashInDb[0]);

                                return res.send(renderedHTML);
                            });
                            //This approach is using sails built in vies
                            //res.view();
                        } else {
                            //No hashInDB. What can it mean?!?? TODO set the message in CONF files
                            //Another template can be used here on case of bad request
                            return res.view('404');
                        }
                    }
                } catch (err) {
                    sails.log.error("Error during hashing the user: " + err);
                }
            }
        );
    }
};