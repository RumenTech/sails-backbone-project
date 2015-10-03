// Local configuration
//
// Included in the .gitignore by default,
// this is where you include configuration overrides for your local system
// or for a production deployment.
//
// For example, to use port 80 on the local machine, override the `port` config

/*
IMPORTANT!!!!!
We have Chain Certificates from Go daddy as well. It is possible to load them as well, if there is a need to do that
For the time being everything works as expected and I see no reason to load it, as it slows down the server without the valud reason.
If there is a need to load CA chain, simply uncomment the files (CA Array), and thats it. Make sure EOF in file is set to Windows.
 */

var fs = require('fs'),
    passport = require('passport'),
    express =  require("express");

var mc = (require('./mainConfig.js')());

if(mc.httpsBindings.useSSL)
{
    module.exports = {
        port: 8080,
         express: {
         customMiddleware: function (app) {
         console.log('INITIALIZE');
         app.use(passport.initialize());
         app.use(passport.session());

         app.configure(function () {
         app.use(express.json());
         app.use(express.urlencoded());
         app.use(express.multipart())
         });
         },
         serverOptions : {
         key: fs.readFileSync(mc.httpsBindings.key),
         cert: fs.readFileSync(mc.httpsBindings.cert)
         }}
    };
} else {
    module.exports = {
        port: 8080
    };
}

/*
module.exports = {
    port: 8080*/
/*,
    express: {
        customMiddleware: function (app) {
            console.log('INITIALIZE');
            app.use(passport.initialize());
            app.use(passport.session());

            app.configure(function () {
                app.use(express.json());
                app.use(express.urlencoded());
                app.use(express.multipart())
            });
        },
        serverOptions : {
            key: fs.readFileSync(mc.httpsBindings.key),
            cert: fs.readFileSync(mc.httpsBindings.cert)//,
           // ca: [fs.readFileSync('ssl/production/g1.crt'), fs.readFileSync('ssl/production/g2.crt'), fs.readFileSync('ssl/production/g3.crt')]
        //key: fs.readFileSync(mc.httpsBindings.key),
        //cert: fs.readFileSync(mc.httpsBindings.cert),
        //ca: [fs.readFileSync('ssl/prod/g1.crt'), fs.readFileSync('ssl/prod/g2.crt'), fs.readFileSync('ssl/prod/g3.crt')]
    }}*//*
};*/