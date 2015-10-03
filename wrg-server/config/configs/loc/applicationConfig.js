/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 12/2/13
 * Time: 12:28 PM
 * DEVELOPMENT ENVIRONMENT SETTINGS
 * Intent is to use single Configuration file for all project requirements.
 * Please feel free to use/expand this config to your requirements,
 * please keep in mind that other configuration files MUST BE updated
 */

"use strict";

module.exports = {
    emailSettings: {
        userEmailSubject: 'WRG Team',
        userEmailSubjectNotification: '',
        userEmailFrom: 'WRG Registration',
        emailArrivedFrom: 'noreply@workreadygrad.com',
        administratorEmail: 'brian@workreadygrad.com',
        userDestination: "", //This is used for testing purposes!!!! This is dynamically set in code
        sendEmails: true  //Turn on or off email sending capability
    },
    dbSettings: {
        host: "localhost",
        user: "wrg",
        password: "welcome",
        dbName: "wrg"
    },
    otherSettings: {
        messages: 'Messages',
        anotherSetting: 'setting'
    },
    userMessages: {
        notActivated: 'Please activate your account!!!',
        notAuthorized: 'Invalid user name or password',
        pwdResetAlreadyRequested: 'You have already requested password reset. Please check your e-mail',
        noSuchUser: 'User does not exist',
        notAllowed: 'Action is not allowed'  //used in conjunction against XSS attack
    },
    appSettings: {
        elasticSearchHost: "http://ec2-54-148-229-254.us-west-2.compute.amazonaws.com:9200",
        accountActivation: false,
        newRegistrationAutoLogin: true, //Should the user autologin after successful registration
        logIn: false, //Enable Login to the system
        serverLocation: 'http://127.0.0.1:8080/', //defence against XSS during password reset request
        serverLocationImg: 'http://127.0.0.1:1337/uploads/fullsize/',
        clientLocation: 'http://127.0.0.1/',
        userPwdResetTimeout: 3600,      //in seconds
        userAccountActTimeout: 86400,   //in seconds
        //AWS setting
        S3ImageExp: 699999999,               //in seconds - Expiration of Images on AWS
        saveImageToAwsS3: true,       //if false, images will be saved to local server file system
        //if this is set to true make sure you have credentials set as well!!!
        pdfEmailsInSession: 3, //How many pdf emails a user is allowed to send per session. After relogging it is reset.
        accessKeyId: 'AKIAJIEZZO4EHPN437XA',
        secretAccessKey: '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',
        awsBucketName: 'work-ready-graddev',
        awsPdfBucket: 'pdfcreation',
        region: '',
        imageSize: 3000000,  //Value is in bytes
        linkedinSkills: 1,  //Your skill rating fetched form Linkedin
        wrgImageUrl: 'https://work-ready-graddev.s3.amazonaws.com/0458b480-ba9f-4fb1-b051-228af879d6db.png?AWSAccessKeyId=AKIAJIEZZO4EHPN437XA&Expires=2096957916&Signature=2jywySkKwaIx9CJIR9N1B4VSo7A%3D'

    },
    mailTypes: {
        activation: './views/mailTemplates/activation.ejs',
        resetPass: './views/mailTemplates/passreset.ejs',
        friend: './views/mailTemplates/friend.ejs',
        futureSelf: './views/mailTemplates/futureSelf.ejs',
        jobRespond: './views/mailTemplates/jobRespond.ejs',
        massEmail: './views/mailTemplates/massEmail.ejs',
        adminEmail: './views/mailTemplates/adminEmail.ejs',
        pdfEmail: './views/mailTemplates/pdfEmail.ejs'
    },
    smtpServer: {
        service: 'Gmail',
        user: 'servicemailer2010@gmail.com',
        pass: 'service_mailer'
    },
    logger: {
        level: 'info',
        maxSize: 1000, //in bytes
        filePath: '../logs/mojlog.log',//this is path in server root
        //filePath: 'c://serverlogs/wrglogfile.log',
        maxFiles: 1000,  //keep how many files at any given time
        colorize: true,     //color the output
        timestamp: true,   //prepend time stamp before each log entry
        logToConsole: true  //log the data to server console. OFF in production
    },
    adminSettings: {
        username: 'administrator'
    },
    SAMLLogins: {
        moreHouse: {
            entryPoint: 'https://pod1.centrify.com/run?appkey=7785d698-a1ff-4064-893a-70c87ab24455&customerId=TH523',
            cert: 'MIICeTCCAeKgAwIBAgIQdmxggdN9cE2OXVxLlhH5xjANBgkqhkiG9w0BAQUFADAqMSgwJgYDVQQDDB9USDUyMyAoQ2VudHJpZnkgQ2xvdWQgU2VydmljZXMpMB4XDTEzMTAwNjE5MTgzNVoXDTM5MDEwMTAwMDAwMFowQjFAMD4GA1UEAww3Q2VudHJpZnkgQ3VzdG9tZXIgVEg1MjMgQXBwbGljYXRpb24gU2lnbmluZyBDZXJ0aWZpY2F0ZTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAo6uT4finx0W2HJlIZtxHMQrggs0KACpELvNgSkgC2HEY+PZm9EN6yYBDC/FG8DQToMlbB1IwAc7oL/f6ercYkwfnqwXKyDiuDxUWhT/3FYzA+rFLhWRwb3lejGxsuVw+MIMOHqprxR6N1EIU98rzRS+oQcaMNWwx0bUEGHepLcsCAwEAAaOBhzCBhDAVBgorBgEEAYKmcAEDBAcMBVRINTIzMB8GA1UdIwQYMBaAFFxSpOgfuoTysgJj2KK5xp+BzitTMB0GA1UdDgQWBBQ0ORNzZ4Y7bnHS2UcT5T4QkdqwmzAOBgNVHQ8BAf8EBAMCBaAwGwYKKwYBBAGCpnABBAQNDAtBcHBsaWNhdGlvbjANBgkqhkiG9w0BAQUFAAOBgQAryaAa+eP6+DveH53zF4o1BJfrqnR0wRcEIAace+YRAl3KtYVW/xKjVD8VXqYa620/gJzYGBhFntFxo5y4KTPV9GvcoxZKqGK5wgC5JoXPR8M29Q+Hjj7yMK1O91rG1PFirvShgS/sEwH68bM6bWpT+dUH0pqkhUa1OwUB+YvSIg==',
            protocol: 'https://',
            issuer: 'passport-saml',
            pass: '123123123' //If this is changed, morHouse users will not be able to log in
        },
        anotherCollege: {}
    },
    pointOfLight: {
        APIkey: "workreadygrad",
        distance: "50"   //In miles from the current location
    },
    httpsBindings: {
        useSSL: false,
        cert: 'ssl/stg/localhost.cert',
        key: 'ssl/stg/localhost.key'
    }
};

