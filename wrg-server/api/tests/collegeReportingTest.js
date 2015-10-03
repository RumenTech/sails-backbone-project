"use strict";
var mainConfigFile = (require('../../config/mainConfig.js')()),
    collegeData = require('./data_samples/collegeData');

exports.PostCollege = function (test) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/user/new_college',
        uri: '/user/new_college',
        headers: {
            "Content-Type": "application/json",
            "Content-Length": JSON.stringify(collegeData.collegeTest).length
        },
        method: "POST"
    };

    var http = require('http');
    var http_request = http.request(options, function (res) {
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            if (result) {
                var resultObject = JSON.parse(result);
                if (resultObject.message === 'College Created Successfully'){
                    test.ok(true, "College saved");
                    test.done()
                } else {
                    test.ok(false, "College not saved");
                    test.done()
                }
            } else {
                test.ok(false, "Response FAIL");
                test.done();
            }
        });
    });
    http_request.on('error', function (err) {
        test.ok(false, "Error getting HTTP response");
        test.done();
    });
    http_request.end(JSON.stringify(collegeData.collegeTest));
};

exports.GetCollege = function (test) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/college/me?id=1',
        uri: '/college/me?id=1'
    };

    var http = require('http');
    var http_request = http.request(options, function (res) {
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            if (result) {
                test.ok(true, "College found");
                test.done()
            } else {
                test.ok(false, "Response FAIL");
                test.done();
            }
        });
    });
    http_request.on('error', function (err) {
        test.ok(false, "Error getting HTTP response");
        test.done();
    });
    http_request.end();
};

exports.DeleteCollegeFromDB = function (test) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/deleteuser/delete',
        uri: '/deleteuser/delete',
        headers: {
            "email": "test@test.com",
            "name": "WRG College"
        },
        method: 'delete'
    };

    var http = require('http');
    var http_request = http.request(options, function (res) {
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            if (result) {
                var resultObject = JSON.parse(result);
                if (resultObject.message === 'Successfully deleted'){
                    test.ok(true, "College deleted");
                    test.done()
                } else {
                    test.ok(false, "College not deleted");
                    test.done()
                }
            } else {
                test.ok(false, "Response FAIL");
                test.done();
            }
        });
    });
    http_request.on('error', function (err) {
        test.ok(false, "Error getting HTTP response");
        test.done();
    });
    http_request.end();
};