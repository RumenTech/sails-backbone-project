/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 12/7/14
 * Time: 8:30 PM
 * To change this template use File | Settings | File Templates.
 * Upload images from client
 * Save files to s3
 */

var mc = (require('../../config/mainConfig.js')()),
    AWS = require('aws-sdk'),
    fs = require('fs');

"use strict";

module.exports = {

    file: function (req, res) {
        //Defensive  Auth
        if (!req.isAuthenticated()) {
            return res.view('404');
        }
        //This should never happen in production, but just be on safe side
        if (typeof(req.files.file) === "undefined") {
            res.set('Content-Type', 'text/html');
            return res.send({errormessage: "Nothing received. Please try again."});
        }
        //Allowed file types for upload. This is not sufficient. Another type check need to be set
        //TODO check mmmagic for node. It should be able to analyse file structure and extract what kind of file we are dealing with
        if(req.files.file.type !== "application/pdf") {
            res.set('Content-Type', 'text/html');
            return res.send({errormessage: "We accept only pdf for job applications."});
        }

        var fileNameArray = req.files.file.path.split("\\");
        var fileNameArrayLength = fileNameArray.length;
        var tempFileSystemName = fileNameArray[fileNameArrayLength - 1];
        var completeFileLocation = process.env.TMPDIR + "\\" + tempFileSystemName;

        //Defensive - Finally check the file size
        if (req.files.file.size > mc.appSettings.imageSize) {
            imagehelper.deletefile(completeFileLocation);

            res.set('Content-Type', 'text/html'); //for Internet explorer 7/8/9. Without this header, user will be prompted to download JSON!!!!
            return res.send({errormessage: 'File is too big. ' + 'Your size: ' + req.files.file.size / 1000 + 'KB.' + ' Maximum allowed size is: ' + mc.appSettings.imageSize / 1000 + "KB"});
        }

        var fileName = req.files.file.name;
        //*****SAVE PDF TO Amazon AWS

        AWS.config.update({
            accessKeyId: mc.appSettings.accessKeyId,
            secretAccessKey: mc.appSettings.secretAccessKey,
            region: mc.appSettings.region
        });

        var s3 = new AWS.S3();

        fs.readFile(req.files.file.path, function (err, applicantData) {
            s3.createBucket({Bucket: mc.appSettings.awsBucketName}, function () {
                var params = {Bucket: mc.appSettings.awsBucketName, Key: fileName, ContentType: "application/pdf", Body: applicantData};

                s3.putObject(params, function (err, data) {
                      if (err){
                           sails.log.error("S3 Applicant Upload problem: " + err);
                       } else {
                           sails.log.info("Successfully uploaded data to BUCKET: " + mc.appSettings.awsBucketName);
                           imagehelper.deletefile(completeFileLocation);
                       }

                    var paramsTwo = {Bucket: mc.appSettings.awsBucketName, Key: fileName, Expires: mc.appSettings.S3ImageExp};
                    s3.getSignedUrl('getObject', paramsTwo, function (err, url) {
                        if (err){
                            sails.log.error("Can't get signed URL: " + err);
                        } else {
                            sails.log.info("The signed URL is", url);
                            res.set('Content-Type', 'text/html');
                            return res.send({url: url});
                        }
                    });
                });
            });
        });
    }
};

