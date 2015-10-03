var async = require('async');

module.exports = {

    getCollegeName: function (req, res, majorCallback) {
        var user_id = req.session.user.id;
        async.waterfall([
            function (callback) {
                callback(null);
            },
            function (callback) {
                CollegeUser.find()
                    .where({user_id: user_id})
                    .done(function (err, user) {
                        if(err) {
                            return res.send({ message : err }, 500);
                        } else {
                            callback(null, user[0]);
                        }
                    });
            },
            function (user) {
                College.find()
                    .where({id: user.college_id})
                    .done(function (err, college) {
                        if(err) {
                            return res.send({ message : err }, 500);
                        } else {
                            majorCallback(null, college[0]);
                        }
                    });
            }
        ]);
    }

};