var fs = require('fs'),
    mc = (require('../../config/mainConfig.js')()),
    async = require('async'),
    AWS = require('aws-sdk');

"use strict";

module.exports = {

    detailView: function (req, res) {
        var exportXls = req.param('export'),
            limit = req.param('limit') || 'ALL',
            role = req.session.user.role,
            userRole = req.param('role'),
            searchRole = '';
        if(userRole !== '' && userRole !== null && userRole !== undefined) {
            searchRole = "AND UserTable.role = '" + userRole + "'";
        }
        if(!req.isAuthenticated()) {
            sails.log.error('Not authenticated entry from User Controller');
            return  res.view('404');
        } else if(role !== 'admin') {
            sails.log.error('Unauthorized user tried to enter admin panel');
            res.send({message: 'No access'}, 500);
        } else {
            var query = "SELECT UserTable.id, UserTable.role, UserTable.first_name, UserTable.last_name, UserTable.email, Student.school as schoolname " +
                " FROM " + mc.dbSettings.dbName + ".public.User AS UserTable, Student WHERE CAST(UserTable.id as FLOAT)= CAST(Student.user_id as FLOAT) " +
                searchRole +
                " UNION " +
                " SELECT UserTable.id, UserTable.role, UserTable.first_name, UserTable.last_name, UserTable.email, AlumniStory.alma_mater " +
                " FROM " + mc.dbSettings.dbName + ".public.User AS UserTable, AlumniStory WHERE CAST(UserTable.id as FLOAT)= CAST(AlumniStory.user_id as FLOAT) " +
                searchRole +
                " UNION " +
                " SELECT UserTable.id, UserTable.role, UserTable.first_name, UserTable.last_name, UserTable.email, Company.name " +
                " FROM " + mc.dbSettings.dbName + ".public.User AS UserTable, Company, CompanyUser WHERE UserTable.role = 'company' " +
                " AND CAST(UserTable.id as FLOAT)= CAST(CompanyUser.user_id as FLOAT) AND CAST(Company.id as FLOAT)= CAST(CompanyUser.company_id as FLOAT)" +
                searchRole +
                " UNION " +
                " SELECT UserTable.id, UserTable.role, UserTable.first_name, UserTable.last_name, UserTable.email, College.name " +
                " FROM " + mc.dbSettings.dbName + ".public.User AS UserTable, College, CollegeUser WHERE UserTable.role = 'college' " +
                " AND CAST(UserTable.id as FLOAT)= CAST(CollegeUser.user_id as FLOAT) AND CAST(College.id as FLOAT)= CAST(CollegeUser.college_id as FLOAT) " +
                searchRole +
                " ORDER BY role LIMIT " + limit;

            var fileName = 'detailview.xls',
                writeStream = fs.createWriteStream(fileName);
            async.waterfall([
                function (callback) {
                    User.query(query, null,
                        function (err, sortedUsers) {
                            try {
                                if (err) {
                                    sails.log.error(err);
                                    res.send(err.message, 500);
                                } else {
                                    if (exportXls === 'false') {
                                        res.send(sortedUsers.rows, 200);
                                    } else {
                                        var body = '';
                                        for (var i = 0; i < sortedUsers.rows.length; i++) {
                                            if(sortedUsers.rows[i].role === 'admin'){
                                                ++i;
                                            } else {
                                                body += sortedUsers.rows[i].role + '\t' + sortedUsers.rows[i].first_name + '\t' + sortedUsers.rows[i].last_name + '\t' +
                                                    sortedUsers.rows[i].email + '\t' + sortedUsers.rows[i].schoolname + '\n';
                                            }
                                        }
                                        fs.writeFile("././"+fileName, body, function(err) {
                                            if(err) {
                                                console.log(err);
                                            } else {
                                                fs.readFile("././"+fileName, function (err, applicantData) {
                                                    callback(null, fileName, applicantData);
                                                });
                                            }
                                        });
                                    }
                                }
                            } catch (err) {
                                sails.log.error(err);
                                return res.send(err.message, 500);
                            }
                        });
                },

                function (fileName, binaryData) {

                    AWS.config.update({
                        accessKeyId: mc.appSettings.accessKeyId,
                        secretAccessKey: mc.appSettings.secretAccessKey,
                        region: mc.appSettings.region
                    });
                    sails.log.info("Saving file to S3");


                    var s3 = new AWS.S3();
                    s3.createBucket({Bucket: mc.appSettings.awsBucketName}, function () {
                        var params = {Bucket: mc.appSettings.awsBucketName, Key: fileName, ContentType: "application/xls", Body: binaryData};

                        s3.putObject(params, function (err, data) {
                            if (err)
                                sails.log.error("S3 Upload problem: " + err);
                            else
                                sails.log.info("Successfully uploaded xls to BUCKET: " + mc.appSettings.awsBucketName);

                            var paramsTwo = {Bucket: mc.appSettings.awsBucketName, Key: fileName, Expires: mc.appSettings.S3ImageExp};
                            s3.getSignedUrl('getObject', paramsTwo, function (err, url) {
                                sails.log.info("The signed URL is" + url);
                                res.send({url:url}, 200);
                            });
                        });
                    });
                }
            ]);
        }

    },

    summaryView: function (req, res) {
        var role = req.session.user.role;
        if(!req.isAuthenticated()) {
            sails.log.error('Not authenticated entry from User Controller');
            return  res.view('404');
        } else if(role !== 'admin') {
            sails.log.error('Unauthorized user tried to enter admin panel');
            res.send({message: 'No access'}, 500);
        } else {
            var query = "SELECT UserTable.role, COUNT (*) FROM " + mc.dbSettings.dbName + ".public.User as UserTable " +
                " WHERE role!= 'admin' GROUP BY role ";

            User.query(query, null,
                function (err, summaryUsers) {
                    try {
                        if (err) {
                            sails.log.error(err);
                            res.send(err.message, 500);
                        } else {
                            var body = '';
                            res.send(summaryUsers.rows, 200);
                        }
                    } catch (err) {
                        sails.log.error(err);
                        return res.send(err.message, 500);
                    }
                });
        }
    }

};


