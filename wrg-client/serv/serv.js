'use strict';

var express = require('express'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    httpApp = express(),
    app = express(),
    oneYear = 0;

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-type, Authorization, Content-Length, X-Requested-With, Origin, Accept');
    //Font Icons under SSL not working in IE's. Cache-Control header is problematic
    //res.header("Cache-Control", "no-cache", "must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", -1);

    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
};

var httpsOptions = {
    key: fs.readFileSync('wrg_key.pem'),
    cert: fs.readFileSync('wrg.crt'),
    ca: [fs.readFileSync('first.crt', 'utf8'),
        fs.readFileSync('second.crt', 'utf8'),
        fs.readFileSync('third.crt', 'utf8')]
};

app.set('port', process.env.PORT || 80);
//app.get("*", function (req, res, next) {
//
//    var routeLocation = req.headers.host.split(".")[0].toLowerCase();
//    //HTTP Fix for IE9 and its problem of not being able to open address without www.
//    if (routeLocation === "www") {
//        return res.redirect("https://" + req.headers.host + req.path);
//    }
//    res.redirect("https://www." + req.headers.host + req.path);
//});

//app.set('port', process.env.PORT || 443);
app.use(express.compress());
app.use(allowCrossDomain);
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);


app.use(function(req, res, next) {
    //TODO: Add checking for the client for IE9 if request comes in form of:
    //https://workreadygrad.com
    if (req.headers.host.split(':', 1)[0].toLowerCase() === 'workreadygrad.com') {
        res.header('Location', 'https://www.workreadygrad.com' + req.url);
        return res.send(301);
    }
    next();
});

app.use(express.static(__dirname + './../', { maxAge: oneYear }));

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express HTTP server listening on port ' + app.get('port'));
});

//https.createServer(httpsOptions, app).listen(app.get('port'), function () {
//    console.log('Express HTTPS server listening on port ' + app.get('port'));
//});