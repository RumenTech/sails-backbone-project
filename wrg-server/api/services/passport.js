
"use strict";


var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    SamlStrategy = require('passport-saml').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    LinkedInStrategy = require('passport-linkedin').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    bcrypt = require('bcryptjs'),
    async = require('async');

var mc = (require('../../config/mainConfig.js')());

//helper functions
function findById(id, fn) {
    User.findOne(id).done(function (err, user) {
        if (err) {
            return fn(null, null);
        } else {
            return fn(null, user);
        }
    });
}

function findByUsername(u, fn) {
    User.findOne({
        username: u
    }).done(function (err, user) {
            // Error handling
            if (err) {
                return fn(null, null);
                // The User was found successfully!
            } else {
                return fn(null, user);
            }
        });
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.
passport.use(new LocalStrategy(
    function (username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // Find the user by username. If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message. Otherwise, return the
            // authenticated `user`.
            findByUsername(username, function (err, user) {
                //DEFENSE
                if (err) {
                    return done(null, err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user ' + username
                    });
                }
                bcrypt.compare(password, user.password, function (err, res) {
                    if (!res)
                        return done(null, false, {
                            message: 'Invalid Password'
                        });
                    var returnUser = {
                        email: user.email,
                        createdAt: user.createdAt,
                        id: user.id,
                        role: user.role,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        act: user.activated,  //Need this property to check for user activation
                        external_login: user.external_login
                    };
                    return done(null, returnUser, {
                        message: 'Logged In Successfully'
                    });
                });
            })
        });
    }
));

var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {
        try {
            User.findOne({email: profile.emails[0].value}).done(function (err, user) {
                try {
                    if (user) {
                        var returnUser = {
                            email: user.email,
                            createdAt: user.createdAt,
                            id: user.id,
                            role: user.role,
                            first_name: user.first_name,
                            last_name: user.last_name
                        };
                        return done(null, returnUser);
                    } else {
                        User.create({
                            google_uid: profile.id,
                            first_name: profile.displayName
                        }).done(function (err, user) {
                                return done(err, user);
                            });
                    }
                } catch (err) {
                    res.send({message: err.message}, 500);
                }
            });
        } catch (err) {
            res.send({message: err.message}, 500);
        }
    });
};

passport.use(new GoogleStrategy({
        clientID: '287490888857-39nf6tfiiqrt40dp2mqs5i9kgong6258.apps.googleusercontent.com',
        clientSecret: '_9SAovJXVSXqRX48M7rn8tPV',
        callbackURL: 'http://localhost:1337/auth/google/callback'
    },
    verifyHandler
));


// Use the LinkedInStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and LinkedIn profile), and
//   invoke a callback with a user object.
passport.use(new LinkedInStrategy({
        consumerKey: 'f33dzzwa6dha',
        consumerSecret: 'YjCbLy8DoHO44Rq4',
        callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback"
    },
    function (token, tokenSecret, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // To keep the example simple, the user's LinkedIn profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the LinkedIn account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));


// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
        clientID: '309172580542',
        clientSecret: '252a4251459a1d5bbe9032bd460dcd8d',
        callbackURL: "http://localhost:1337/auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's Facebook profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Facebook account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));

/*
 This method will determine if there is a user in the database.
 If not, then it will create one or read one if it exists. The user object is returned to AuthController for further manipulation.
 */

passport.use(new SamlStrategy({
        path: '/login/callback/',
        entryPoint: mc.SAMLLogins.moreHouse.entryPoint,
        issuer: mc.SAMLLogins.moreHouse.issuer,
        protocol: mc.SAMLLogins.moreHouse.protocol,
        cert: mc.SAMLLogins.moreHouse.cert
        /* privateCert: fs.readFileSync('./cert.pem', 'utf-8')*/
    }, function (profile, done) {
        // asynchronous verification, for effect...
        var data_user = {
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.nameID,
            password: mc.SAMLLogins.moreHouse.pass,
            username: profile.nameID,
            //facebook_uid: profile.facebook_uid,
            // linkedin_uid: profile.linkedin_uid,
            external_login: 'morehouse',
            //google_uid: profile.google_uid,
            //twitter_uid: profile.twitter_uid,
            role: 'student'
        };

        process.nextTick(function () {
            findByUsername(profile.nameID, function (err, user) {
                console.log("This is user object" + user);
                //defense
                if (err) {
                    return done(null, err);
                }
                if (user) {
                    return done(null, user, {
                        message: 'Logged In Successfully'
                    });
                }
                if (!user) {
                    async.waterfall([
                        function (callback) {
                            var code = 200;
                            User.create(data_user).done(function (err, user) {
                                try {
                                    // Error handling
                                    if (err) {
                                        code = 500;
                                        sails.log.error('Failed Creating user for MoreHouse College: ' + err);
                                        return done(null, err);
                                    }
                                    else {
                                        data_user = user;

                                        var data_student = {
                                            school: profile.school,
                                            //school_list_id: req.param('school_id'),
                                            high_school: profile.high_school,
                                            career_objective: profile.career_objective,
                                            highest_edu_level: profile.highest_edu_level,
                                            company: profile.company,
                                            major: profile.major,
                                            //is_veteran:req.param('is_veteran'),
                                            //is_disabled: req.param('is_disabled'),
                                            job_title: profile.job_title,
                                            activities: profile.activities,
                                            advice: profile.advice,
                                            profile_image: profile.profile_image,
                                            hindsight: profile.hindsight,
                                            graduation_year: profile.graduation_year,
                                            graduation_month: profile.graduation_month,
                                            tutorial: true,
                                            user_id: user.id
                                        };
                                        //Server gets empty string instead of null for integers
                                        if (data_student.graduation_month === '') {
                                            data_student.graduation_month = null;
                                        }
                                        if (data_student.graduation_year === '') {
                                            data_student.graduation_year = null;
                                        }
                                        var userId = user.id;
                                        callback(null, data_user, data_student, userId);

                                    }
                                } catch (err) {
                                    console.log(err);
                                }
                            })
                        },
                        function (data_user, data_student, userId, callback) {
                            Student.create(data_student).done(function (err, student) {
                                // Error handling
                                if (err) {
                                    data_student = err;
                                    var code = 500;

                                    User.destroy({
                                        id: userId
                                    }).done(function (err) {
                                            if (err) {
                                                return res.send({message: "The student can't be saved, and the user was created and can't be deleted. " +
                                                    "Only send the data student with the user_id", user: data_user, student: data_student}, code);
                                            } else {
                                                return res.send({message: "Error saving your data, please try again.", user: data_user, student: data_student}, code);
                                            }
                                        });
                                } else {

                                    var returnUser = {
                                        email: data_user.email,
                                        createdAt: data_user.createdAt,
                                        id: data_user.id,
                                        role: data_user.role,
                                        first_name: data_user.first_name,
                                        last_name: data_user.last_name,
                                        act: data_user.activated  //Need this property to check for user activation
                                    };

                                    sails.log.info('Created More House College Student: Id is: ' + returnUser.id);

                                    return done(null, returnUser, {
                                        message: 'Freshly registered Student.'
                                    });
                                }
                            });
                        }
                    ]); //Waterfall ends here
                }
            })
        });
    }
));

