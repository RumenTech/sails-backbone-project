/**
 * Created with JetBrains WebStorm.
 * User: VedranMaricevic
 * Date: 12/7/13
 * Time: 8:30 PM
 * To change this template use File | Settings | File Templates.
 * Upload images from client
 * Cropping functionality added
 * resize functionality added
 * fs is absent with a reason, since all files are uploaded directly to specified temp directory
 * Save images either to localfilesystem or s3
 * TODO: make sure that  res.set('Content-Type', 'text/html'); is sent only if old browser is used
 */

var mc = (require('../../config/mainConfig.js')());
var im = require('imagemagick');
var AWS = require('aws-sdk');
var fs = require('fs');

"use strict";

module.exports = {
    //this method handles media for everything, except for profile images
    image: function (req, res) {
        //Defensive
        if (!req.isAuthenticated()) {
            return res.view('404');
        }
        //Defensive - is there image data at all?
        if (typeof(req.files.image) === "undefined") {
            return res.send("No image information received", 500);
        }
        //Defensive - Finally check the file size
        if (req.files.image.size > mc.appSettings.imageSize) {
            res.set('Content-Type', 'text/html'); //for Internet explorer 7/8/9. Without this header, user will be prompted to download JSON!!!!
            return res.send({errormessage: 'File is too big.'});
        }

        im.identify(req.files.image.path, function (err, features) {
            if (err) {
                sails.log.error(err);//Log the actual error
                res.set('Content-Type', 'text/html'); //for Internet explorer 7/8/9. Without this header, user will be prompted to download JSON!!!!
                return res.send({errormessage: "This is not a valid image file"});//send the message to user
            }
            //else if (features ) { //TODO Any special demands regarding the image. Maybe limit upper image size.
            else {
                var fileNameArray = req.files.image.path.split("\\");
                var fileNameArrayLength = fileNameArray.length;
                var tempFileSystemName = fileNameArray[fileNameArrayLength - 1];
                var completeImageLocation = process.env.TMPDIR + "\\" + tempFileSystemName;
                var destination = "./uploads/fullsize/" + tempFileSystemName;
                //this is in success

                AWS.config.update({
                    accessKeyId: mc.appSettings.accessKeyId,
                    secretAccessKey: mc.appSettings.secretAccessKey,
                    region: mc.appSettings.region
                });

                var s3 = new AWS.S3();
                im.resize({
                    //srcData: data,
                    srcPath: destination,
                    width: 300,
                    height: 300,
                    customArgs: ['-auto-orient']
                }, function (err, stdout, stderr) {
                    if (err) {
                        sails.log.error(err);
                    } else {
                        var imageFinalized = new Buffer(stdout, "binary");
                        s3.createBucket({Bucket: mc.appSettings.awsBucketName}, function () {
                            //var params = {Bucket: 'work-ready-grad', Key: imageName, ContentType: 'image/jpeg', Body: data, ACL: 'public-read'};
                            var params = {Bucket: mc.appSettings.awsBucketName, Key: tempFileSystemName, ContentType: 'image/jpeg', Body: imageFinalized};

                            s3.putObject(params, function (err, data) {
                                if (err) {
                                    sails.log.error("S3 Upload problem: " + err);
                                }
                                else {
                                    sails.log.info("Successfully uploaded data to BUCKET: " + mc.appSettings.awsBucketName);
                                    imagehelper.deletefile(destination);
                                }

                                //get signed url here
                                var paramsTwo = {Bucket: mc.appSettings.awsBucketName, Key: tempFileSystemName, Expires: mc.appSettings.S3ImageExp};
                                s3.getSignedUrl('getObject', paramsTwo, function (err, url) {
                                    sails.log.info("The signed URL is", url);
                                    res.set('Content-Type', 'text/html'); //for Internet explorer 7/8/9. Without this header, user will be prompted to download JSON!!!!
                                    return res.send({url: url});
                                });
                            });
                        });
                    }
                });
            }
        });
    },

    cropMe: function (req, res) {
        //Defensive
        if (!req.isAuthenticated()) {
            return res.view('404');
        }
        AWS.config.update({
            accessKeyId: mc.appSettings.accessKeyId,
            secretAccessKey: mc.appSettings.secretAccessKey,
            region: mc.appSettings.region
        });

        var s3 = new AWS.S3();
        var cv = req.body; //cropvalues

        if (cv.w < 180 || cv.h < 180) {
            res.send('Cropped area is too small', 500);
        }
        else {
            var imGeometry = cv.w + "x" + cv.h + "+" + cv.x + "+" + cv.y;

            var newPath = "./uploads/fullsize/" + cv.imageName;  //it is hashed already
            var destination = "./uploads/fullsize/" + cv.imageName + "";

            im.convert([newPath, "-crop", imGeometry, destination], function (err, stdout) {
                //image here is cropped, however it still may be big
                //make sure it is within 180 x 180 bounds
                im.resize({
                    srcPath: destination,
                    width: 180,
                    height: 180,
                    customArgs: ['-auto-orient']
                }, function (err, stdout, stderr) {
                    if (err) {
                        sails.log.error("im.resize to 180x180 problem: : " + err);
                    } else {
                        var imageFinalized = new Buffer(stdout, "binary");
                        sendToS3(imageFinalized, destination);
                    }
                });

                function sendToS3(bufferedImage, destination) {
                    s3.createBucket({Bucket: mc.appSettings.awsBucketName}, function () {
                        //var params = {Bucket: 'work-ready-grad', Key: imageName, ContentType: 'image/jpeg', Body: data, ACL: 'public-read'};
                        var params = {Bucket: mc.appSettings.awsBucketName, Key: cv.imageName, ContentType: 'image/jpeg', Body: bufferedImage};

                        s3.putObject(params, function (err, data) {
                            if (err) {
                                sails.log.error("S3 Upload problem: " + err);
                            }
                            else {
                                sails.log.info("Successfully uploaded data to BUCKET: " + mc.appSettings.awsBucketName);
                                imagehelper.deletefile(destination);
                            }
                            //get signed url here
                            var paramsTwo = {Bucket: mc.appSettings.awsBucketName, Key: cv.imageName, Expires: mc.appSettings.S3ImageExp};
                            s3.getSignedUrl('getObject', paramsTwo, function (err, url) {
                                if(err) {
                                    sails.log.error("Can't get signed Image URL: " + err);
                                } else {
                                    var feedEntry = {};
                                    feedEntry.user_id = req.session.user.id;
                                    feedEntry.user_role = req.session.user.role;
                                    feedEntry.image = url;
                                    feedEntry.event_type ='profileImageChanged';
                                    Feed.addFeedEvent(feedEntry);
                                    sails.log.info("The signed Image URL is", url);
                                    return res.send({url: url}, 200);
                                }
                            });
                        });
                    });
                }
            });
        }
    },

    returnBinaryImage: function (req, res) {
           //Read image from FS and stream it back to client
        fs.readFile(sails.config.paths.app  + "/uploads/fullsize/" + req.params.file, function (err, binaryImage) {
            if (err) {
                sails.log.error("Can't get preview  Image URL: " + err);
                return res.send("This image is no longer available. Try another one?", 500);
            } else {
                res.writeHead(200, {'Content-Type': 'image/jpg' });
                res.end(binaryImage, 'binary');
            }
        });
    },

    savePreparationImage: function (req, res) {
        //No image bigger then 5MB will be saved here
        //Defensive
        if (!req.isAuthenticated()) {
            sails.log.info("Unathorized access attempt to savePreparationImage method in ImgUploadCtrl");
            return res.view('404');
        }
        //Defensive - is there image data at all?
        if (typeof(req.files.image) === "undefined") {
            return res.send("No image information received", 500);
        }
        //Defensive - Finally check the file size
        if (req.files.image.size > mc.appSettings.imageSize) {
            res.set('Content-Type', 'text/html'); //for Internet explorer 7/8/9. Without this header, user will be prompted to download JSON!!!!
            return res.send({errormessage: 'File is too big.'});
        }

        var fileNameArray = req.files.image.path.split("\\");
        var fileNameArrayLength = fileNameArray.length;
        var tempFileSystemName = fileNameArray[fileNameArrayLength - 1];
        var completeImageLocation = process.env.TMPDIR + "\\" + tempFileSystemName;

        im.identify(req.files.image.path, function (err, features) {
            if (err) {
                sails.log.error(err);//Log the actual error
                imagehelper.deletefile(completeImageLocation);
                res.set('Content-Type', 'text/html'); //for Internet explorer 7/8/9. Without this header, user will be prompted to download JSON!!!!
                return res.send({errormessage: "This is not a valid image file"});//send the message to user
            }
            else {
                if (features.width < 180 || features.height < 180) {
                    imagehelper.deletefile(completeImageLocation);
                    res.set('Content-Type', 'text/html'); //for Internet explorer 7/8/9. Without this header, user will be prompted to download JSON!!!!
                    return res.send({errormessage: 'Image must be at least 180px x 180px'});
                }
                else {
                    res.set('Content-Type', 'text/html'); //for Internet explorer 7/8/9. Without this header, user will be prompted to download JSON!!!!
                    return res.send({imageName: tempFileSystemName, width: features.width, height: features.height});
                }
            }
        });
    },
};
