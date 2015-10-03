/**
 * Created with JetBrains PhpStorm.
 * User: mike
 * Date: 9/19/13
 * Time: 4:19 PM
 * To change this template use File | Settings | File Templates.
 */


var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
express =  require("express");

module.exports = {
    express: {
        customMiddleware: function(app){
            console.log('Express midleware for passport');
            app.use(passport.initialize());
            app.use(passport.session());
            /// Include the express body parser
            app.configure(function () {
                app.use(express.json());
                app.use(express.urlencoded());
                app.use(express.multipart())
            });
        }
    }
};