/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 11/28/13
 * Time: 9:27 AM
 * To change this template use File | Settings | File Templates.
 */

var nodemailer = require("nodemailer");
var mainConfigFile = (require('../../config/mainConfig.js')());

var fs = require('fs');
var ejs = require('ejs');


"use strict";


exports.resolveTemplate = function (user, mailtype, req, res) {

    user.serverLocation = mainConfigFile.appSettings.serverLocation; //EJS has no access to JS variable, other then what we pass for render. So be it !!!

    switch (mailtype) {
        case 'activation':
            templateRender(user, mainConfigFile.mailTypes.activation, "WRG Account Activation");
            break;
        case 'passreset':
            templateRender(user, mainConfigFile.mailTypes.resetPass, "WRG Reset Password");
            break;
        case 'friend':
            templateRender(user, mainConfigFile.mailTypes.friend, "WRG New Friend Request");
            break;
        case 'futureSelf':
            templateRender(user, mainConfigFile.mailTypes.futureSelf, "WRG Future Self Goal");
            break;
        case 'jobRespond':
            templateRender(user, mainConfigFile.mailTypes.jobRespond, user.subject);
            break;
        case 'massEmail':
            templateRender(user, mainConfigFile.mailTypes.massEmail, "WorkReadyGrad");
            break;
        case 'adminEmail':
            templateRender(user, mainConfigFile.mailTypes.adminEmail, "WorkReadyGrad");
            break;
        case 'sendPdf':
            templateRender(user, mainConfigFile.mailTypes.pdfEmail, "Resume from WRG", req, res);
            break;
        default:
            break;
    }

    var userEmail = user.email;

    function templateRender(user, templateLocation, mailSubjectMessage, req, res) {

        var renderedHTML;

        fs.readFile(templateLocation, 'utf8', function (err, data) {
            if (err) {
                sails.log.error("Unable to access template file for e-mail. User that requested the operation is: " + user.email);
            } else {
                var compiled = ejs.compile(data);
                renderedHTML = compiled(user);

                if (mainConfigFile.emailSettings.sendEmails) {
                    sails.log.info("USER just registered. Welcome e-mail is about to be sent to: -Name " + user.first_name + " -LastName " + user.last_name + "-Email " + user.email);
                    mailsender.mailsender(renderedHTML, user, mailSubjectMessage, req, res);
                } else {
                    sails.log.info("USER just registered. Sending welcome e-mail is DISABLED: -Name " + user.first_name + " -LastName " + user.last_name + "-Email " + user.email);
                }
            }
        })
    }
};
