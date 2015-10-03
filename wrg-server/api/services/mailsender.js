/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 12/5/13
 * Time: 1:12 PM
 * To change this template use File | Settings | File Templates.
 */


var nodemailer = require("nodemailer");
var mainConfigFile = (require('../../config/mainConfig.js')());


"use strict";


exports.mailsender = function (mailContent, user, mailSubject, req, res) {

    var userEmail = user.email;

    if (mainConfigFile.emailSettings.userDestination) {
        userEmail = mainConfigFile.emailSettings.userDestination;
    }
     //If we are sending pdf, then use provided destination email
  /*  if ( user.hasOwnProperty("emailPdfAddress") ) {
        userEmail = user.emailPdfAddress
    }*/



// Create a SMTP transport object
    var transport = nodemailer.createTransport("SMTP", {
        service: mainConfigFile.smtpServer.service, // use well known service
        auth: {
            user: mainConfigFile.smtpServer.user,
            pass: mainConfigFile.smtpServer.pass
        }
    });

    // Message object
    var message = {
        // sender info


        from: mainConfigFile.emailSettings.userEmailSubject + '<' + mainConfigFile.emailSettings.emailArrivedFrom + '>',

        // Comma separated list of recipients
        to: '"Receiver Name"' + userEmail, //For production use userEmail variable

        // Subject of the message
        subject: mailSubject,

        text: "plaintext alternative",

        // An array of alternatives
        alternatives: [
            {
                contentType: "text/x-web-markdown",
                contents: '**markdown** alternative'
            },
            {
                contentType: "text/html; charset=utf-8",
                contentEncoding: "7bit",
                contents: mailContent
            }
        ]
    };

    sails.log.info('Sending Mail');
    transport.sendMail(message, function (error) {
        if (error) {
            sails.log.error('Error occured: ', error.message);
            res && res.send("Failed to send message", 500);
            return;
        }
        sails.log.info('Message sent successfully!');

        //Defense required for first time user registration
        if(req) {
            req.session.user.sentPdfEmails += 1;

            res && res.send("OK-" + req.session.user.sentPdfEmails, 200);
            // if you don't want to use this transport object anymore, uncomment following line
            //transport.close(); // close the connection pool
        }
    })
};




