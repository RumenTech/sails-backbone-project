/**
 * AuthController
 * SAML Verification Implemented
 *
 */
var passport = require('passport');
var mainConfigFile = (require('../../config/mainConfig.js')());


module.exports = {

    login: function (req, res) {
        res.view();
    },
    process: function (req, res) {
        //Main Login Switch for the entire application
        if (mainConfigFile.appSettings.logIn) {

            passport.authenticate('local', function (err, user, info) {
                if ((err) || (!user)) {
                    var errorObject = {
                        mainError: "Please check your Login Credentials",
                        hError: info.message.split(" ")[1]
                    }
                    return res.send({
                        message: errorObject
                    }, 500);
                }
                //We are not allowing external users to login via normal login system. Only SAML way
                if (user.external_login) {
                    var errorObject = {
                        mainError: "Please check your Login Credentials",
                        hError: info.message.split(" ")[1]
                    }
                    return res.send({
                        message: errorObject
                    }, 500);
                }

                req.logIn(user, function (err) {
                    if (err) return res.send(err, 500);
                    else {
                        //Make sure user is activated before letting him in!!!
                        if (mainConfigFile.appSettings.accountActivation) {
                            if (!user.act) {
                                return res.send({
                                    message: mainConfigFile.userMessages.notActivated
                                }, 500);
                            }
                        }
                        req.session.user = user;
                        req.session.user.sentPdfEmails = 0;
                        sails.log.info('login successful ');

                        Connection.find({ request_user_id: req.session.user.id, confirmation: 0 }).done(
                            function (err, connections) {
                                try {
                                    if (err) {
                                        return res.send({message: err.message}, 500);
                                    } else {
                                        req.session.user.request = connections.length;
                                        return res.send({message: 'login successful', session: req.session.user}, 200);
                                    }
                                } catch (err) {
                                    return res.send({message: err.message}, 500);
                                }
                            }
                        );
                    }
                });
            })(req, res);
        } else {
            //Login to the application is disabled
            //Send some message to let the user know
            return res.send({message: "Login disabled"}, 200);
        }
    },

    logout: function (req, res) {
        req.logout();
        req.session.user = null;
        return res.send({message: 'logout successful'}, 200);
    },


    'google': function (req, res) {
        try {
            passport.authenticate('google', { failureRedirect: '/login', scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.profile'] },
                function (err, user) {
                    req.logIn(user, function (err) {
                        if (err) {
                            sails.log.error('Google error: ' + err);
                            return res.send(err, 500);
                        } else {
                            sails.log.info('Google user: ' + user);
                            return res.send(user, 200);
                        }
                    });
                })(req, res);
        } catch (err) {
            return res.send(err, 500);
        }
    },

    'google/callback': function (req, res) {
        try {
            passport.authenticate('google',
                function (req, res) {
                    res.redirect('/');
                })(req, res);
        } catch (err) {
            return res.send(err, 500);
        }
    },

    'linkedin': function (req, res) {
        passport.authenticate('linkedin', { failureRedirect: '/login', scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.profile'] },
            function (err, user) {
                req.logIn(user, function (err) {
                    if (err) {
                        sails.log.error('Linkedin error: ' + err);
                        return res.send(err, 500);
                    } else {
                        sails.log.info('Linkedin user: ' + user);
                        return res.send(user, 200);
                    }
                });
            })(req, res);
    },

    'linkedin/callback': function (req, res) {
        passport.authenticate('linkedin',
            function (req, res) {
                res.redirect('/');
            })(req, res);
    },

    'facebook': function (req, res) {
        passport.authenticate('facebook',
            function (data, data2) {
                res.redirect('/');
            })(req, res);

    },

    saml: function (req, res, next) {
        passport.authenticate('saml',
            function (req, res) {
                res.redirect('/');
            })(req, res, next);
    },
    //MoreHouse College Login Logic
    loginCallback: function (req, res, next) {
        passport.authenticate('saml', { failureRedirect: '/', failureFlash: true },
            function (err, user) {
                if (err) {
                    console.log("This is error: " + err);
                } else {
                    req.logIn(user, function (err) {
                        //Second Level of Defense
                        if (typeof (user) === "undefined") {  //STOP and redirect
                            return res.redirect(mainConfigFile.appSettings.clientLocation);
                        }
                        if (err) {
                            sails.log.error('login error from Morehouse College: User:  ' + err);
                            return res.redirect(mainConfigFile.appSettings.clientLocation);
                        }
                        else {
                            req.session.user = user;
                        }
                    });
                    sails.log.info('login successful from Morehouse College: User:  ' + user.username);
                    res.redirect(mainConfigFile.appSettings.clientLocation);

                }
            })(req, res, next);
    },

    'facebook/callback': function (req, res) {
        passport.authenticate('facebook', { successRedirect: '/',
            failureRedirect: '/login' });
    }
};


/**
 * Sails controllers expose some logic automatically via blueprints.
 *
 * Blueprints are enabled for all controllers by default, and they can be turned on or off
 * app-wide in `config/controllers.js`. The settings below are overrides provided specifically
 * for AuthController.
 *
 * NOTE:
 * REST and CRUD shortcut blueprints are only enabled if a matching model file
 * (`models/Auth.js`) exists.
 *
 * NOTE:
 * You may also override the logic and leave the routes intact by creating your own
 * custom middleware for AuthController's `find`, `create`, `update`, and/or
 * `destroy` actions.
 */

module.exports.blueprints = {

    // Expose a route for every method,
    // e.g.
    // `/auth/foo` =&gt; `foo: function (req, res) {}`
    actions: true,

    // Expose a RESTful API, e.g.
    // `post /auth` =&gt; `create: function (req, res) {}`
    rest: true,

    // Expose simple CRUD shortcuts, e.g.
    // `/auth/create` =&gt; `create: function (req, res) {}`
    // (useful for prototyping)
    shortcuts: true

};