/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 12/3/13
 * Time: 11:10 AM
 * To change this template use File | Settings | File Templates.
 * This controller will accept the request for new password.
 * Request is coming from the client
 * It will check is there is such email in the DB.
 * If there is, then it will generate email with the hash for password reset
 */




var mainConfigFile = (require('../../config/mainConfig.js')());

"use strict";

module.exports = {

    requestPassChange:function (req, res) {
        var userEmail = req.param('username');


        //TODO Determine should this be used at all
        /*
         //Check for origin of domain!!!
         var originDomain = req.headers.host;

         if(originDomain !== mainConfigFile.appSettings.serverLocation) {
         return res.send({message : mainConfigFile.userMessages.notAllowed}, 500)
         }
         */

        //Please see Activation Controller. Same strategy is here.
        if (typeof(userEmail) === "undefined") {
            return res.view('404');
        }


        var userEmail = req.param('username');
        //First check is to see is there such an email
        User.findByUsername(userEmail).done(
            function (err, userDetails) {
                try {
                    if (err) {
                        return res.send({message:err.message}, 500);
                    } else {
                        if (userDetails.length === 0) {
                            return res.send({message:mainConfigFile.userMessages.noSuchUser}, 500)
                        }
                        //Defence against Social network users, so they can't reset their password
                        if (userDetails[0].facebook_uid !== null || userDetails[0].linkedin_uid !== null || userDetails[0].google_uid !== null || userDetails[0].external_login !== null) {
                            return res.send({message:"Please visit your social network to change password"}, 500);
                        } else {
                            var pwdResetObject = {
                                hash:hashSetter.hashedValue(),
                                email:userDetails[0].email,
                                user_id:userDetails[0].id,
                                first_name:userDetails[0].first_name
                            };

                            //OK request is valid and email exists. Create request in database
                            PwdReq.create(pwdResetObject).done(
                                function (err, messages) {
                                    try {
                                        if (err) {
                                            return res.send({message:mainConfigFile.userMessages.pwdResetAlreadyRequested}, 500)
                                        } else {
                                            sails.log.info('New Password Request is in database: ', messages);
                                            //pwdResetObject contains information that can help us structure ejs template
                                            templateresolver.resolveTemplate(pwdResetObject, 'passreset');
                                            return res.send({ok:"OK"}, 200);
                                        }
                                    } catch (err) {
                                        sails.log.error("Error during hashing the user: " + err);
                                    }
                                }
                            );
                        }
                    }
                } catch (err) {
                    return res.send({message:err.message}, 500)
                }
            }
        );
        sails.log.info("Requested e-mail is: " + userEmail);
    },

    _config:{
        //Just to be on safe side !!!!
        shortcuts:false,
        rest:false
    }
};


