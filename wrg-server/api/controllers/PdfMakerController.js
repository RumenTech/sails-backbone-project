/**
 * Created by vedranma on 17.12.2014..
 */

'use strict';

var pdfDocument = require('pdfkit');
var blobStream = require('blob-stream');

var fs = require('fs');
var async = require('async');

var AWS = require('aws-sdk');
var mc = (require('../../config/mainConfig.js')());

module.exports = {


    sendPdfEmail: function (req, res) {


        //Spam defense -- user can send only predefined n umber of pdf emails per his session
        //Defense first level
        if (!req.isAuthenticated()) {
            return res.view('404');
        }

        //Spam Defense
        if(req.session.user.sentPdfEmails > 3) {
           return res.send("Limit reached", 500);
        }

        var data = req.body;

        var user = req.session.user;
        //Reason for not using req.body is to save the machine resources.
        user.locationOfPdf =  data.locationOfPdf;
        user.email = data.emailPdfAddress;

        templateresolver.resolveTemplate(user, 'sendPdf', req, res);
    },

    getMyPdf: function (req, res) {
        //Get the data for pdf creation from the body.
        //Doing this we avoid databse seek, as we already have the information to build the pdf document
        //Just add defences to fight potential attacks.

        //Defense first level
        if (!req.isAuthenticated()) {
            return res.view('404');
        }

        var userData = req.session.user,
            imageResumeName,
            pdfValidName = userData.first_name + "_" + userData.last_name + "-" + "CV" + userData.id + ".pdf";


        var base64DataImage = req.body.imageData.substring(1);

        if (base64DataImage.length > 5) {
            imageResumeName = userData.id + "-" + userData.first_name + ".png";
        } else {
            imageResumeName = "defaultresumeimage.png";
        }

        //Create both Image on disk and pdef to AWS
        if (base64DataImage.length > 5) {
            imageCreator()
        } else {
            //There is no image, dont mess with file system. Just make amazon PDF
            uploadToAWS();
        }

        function imageCreator() {
            fs.writeFile('uploads/' + imageResumeName, base64DataImage, "base64", function (err) {
                if (err) {
                    //throw err;
                    sails.log.error("Cant create image from stream!!!!");
                } else {
                    sails.log.info('User Image generated!');
                    uploadToAWS();
                }
            });
        }

        function uploadToAWS() {
            var userPdfDetails = req.body;
            var doc = new pdfDocument();
            var stream = doc.pipe(blobStream());

            doc.info.Author = "Work Ready Grad Resume Builder";
            var pdfStream = doc.pipe(fs.createWriteStream("uploads/pdf/" + pdfValidName));
            //START -- DOCUMENT CREATION

            doc.fontSize(10);
            doc.fontSize(12)
                .text('WorkReadyGrad', 425, 30, {"link": "https://www.workreadygrad.com"});

            doc.fontSize(9).moveDown(2);

            doc.image("./uploads/" + imageResumeName, 100, 30, {scale: 0.25});//.text('Scale', 320, 265);

            doc.fontSize(22);
            doc.text(userPdfDetails.fullname, 110, 80, {
                width: 410,
                align: 'center',
                fillColor: 'red'
            });
            doc.fontSize(15);

            doc.text(userPdfDetails.addressline, {
                width: 410,
                align: 'center',
                fillColor: 'red'
            });
            doc.fontSize(18).moveDown(1);

            doc.fontSize(18).fillColor("blue");
            doc.text('Personal Details:');

            doc.fontSize(13).fillColor("black")
                .text('School: ' + userPdfDetails.school);

            doc.fontSize(13)
                .text('Major: ' + userPdfDetails.major);

            doc.fontSize(13)
                .text('Objective: ' + userPdfDetails.objective);

            if(userPdfDetails.graddate) {
                doc.fontSize(13)
                    .text('Grad Year: ' + userPdfDetails.graddate);
            }

            doc.fontSize(18).moveDown(1).fillColor("blue");
            //Experience defense Check
            if (userPdfDetails.experience.length > 0) {
                doc.text('Experience:');
                doc.fontSize(13).fillColor("black");
                for (var i = 0; i < userPdfDetails.experience.length; i++) {
                    doc.fontSize(13);
                    doc.text('-' + userPdfDetails.experience[i].title + '(' + userPdfDetails.experience[i].date + ')', {
                        underline: true
                    })
                        .text(userPdfDetails.experience[i].description, {
                            align: 'justify',
                            indent: 10,
                            columns: 1,
                            height: 50,
                            ellipsis: true
                        }).moveDown();
                }
            }
            doc.fontSize(18).fillColor("blue");

            //Skills defense Check
            if (userPdfDetails.skills) {
                doc.text('Skills:');
                for (var i = 0; i < userPdfDetails.skills.length; i++) {
                    doc.fontSize(13).fillColor("black");
                    doc.text("-" + userPdfDetails.skills[i].name + "                   Score: " + userPdfDetails.skills[i].score);
                }
                ;
            }
            doc.fontSize(18).moveDown(1).fillColor("blue");
            //Awards defense Check
            if (userPdfDetails.awards) {
                if (userPdfDetails.awards.length > 0) {
                    doc.text('Awards:');
                    doc.fontSize(13);
                    for (var i = 0; i < userPdfDetails.awards.length; i++) {
                        doc.fontSize(13).fillColor("black");
                        doc.text(userPdfDetails.awards[i].title + '(In: ' + userPdfDetails.awards[i].date + ' - Issued by: ' + userPdfDetails.awards[i].issuedby + ')', {
                            underline: true
                        })
                            .text(userPdfDetails.awards[i].description, {
                                align: 'justify',
                                indent: 10,
                                columns: 1,
                                height: 50,
                                ellipsis: true
                            }).moveDown();
                    }
                }
            }
            doc.end();
            // END -- DOCUMENT CREATION

            pdfStream.on('finish', function () {
                pdfStream.close();

                fs.readFile(pdfStream.path, function (err, pdfStreamFromDisk) {
                    AWS.config.update({
                        accessKeyId: mc.appSettings.accessKeyId,
                        secretAccessKey: mc.appSettings.secretAccessKey,
                        region: mc.appSettings.region
                    });

                    var s3 = new AWS.S3();

                    s3.createBucket({Bucket: mc.appSettings.awsPdfBucket}, function () {
                        var params = {Bucket: mc.appSettings.awsPdfBucket, Key: pdfValidName, ContentType: 'application/pdf', Body: pdfStreamFromDisk};

                        s3.putObject(params, function (err, data) {
                            if (err) {
                                sails.log.error("S3 Upload problem: " + err);
                            }
                            else {
                                sails.log.info("Successfully uploaded data to BUCKET: " + mc.appSettings.awsBucketName);
                                //imagehelper.deletefile(destination);
                            }
                            //get signed url here
                            var paramsTwo = {Bucket: mc.appSettings.awsPdfBucket, Key: pdfValidName, Expires: mc.appSettings.S3ImageExp};
                            s3.getSignedUrl('getObject', paramsTwo, function (err, url) {
                                sails.log.info("The signed URL is", url);

                                //User want resume without image. Do not remove default image.
                                if (imageResumeName !== "defaultresumeimage.png") {
                                    try {
                                        imagehelper.deletefile("uploads/" + imageResumeName);
                                    } catch (e) {
                                        sails.log.error("Error while trying to delete image for resume" + e);
                                    }
                                }
                                res.set('Content-Type', 'text/html'); //for Internet explorer 7/8/9. Without this header, user will be prompted to download JSON!!!!
                                return res.send(url);
                            });
                        });
                    });
                });
            });
        }
    },
    _config: {}
};