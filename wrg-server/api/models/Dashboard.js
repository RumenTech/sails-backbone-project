var mc = (require('../../config/mainConfig.js')()),
    async = require('async');

module.exports = {
    attributes: {
        user_id:{
            type: 'integer',
            required: true
        },
        tab_type: {
            type: 'integer'
        },
        quantity: {
            type: 'integer'
        },
        // id of all users that satisfy query
        result_id: {
            type: 'integer'
        },
        is_seen: {
            type: 'boolean'
        }
    },

    updateDashboard: function(userId, type, resultId, res){
        Dashboard.update({user_id: userId, tab_type: type, result_id: resultId}, {is_seen: true}, function (err, response) {
            if (err) {
                sails.log.error("Error updating dashboard ", err);
                res.send(err, 500);
            } else {
                sails.log.info("Dashboard updated");
                res.send(response, 200);
            }
        });
    },
    addNewRecordToDashboard: function(type, number, resultId, userId, res){
        sails.log.info('here');
        Dashboard.create({user_id: userId, tab_type: type, quantity: number, result_id: resultId, is_seen: false}, function (err) {
            if (err) {
                sails.log.error("Error creating new record in dashboard ", err);
                res.send(err, 500);
            } else {
                sails.log.info("Dashboard record created");
            }
        });
    },

    getPreviousIds: function(userId, tabType, res, callback){
        Dashboard.find()
            .where({user_id: userId, tab_type: tabType})
            .exec(function(err, response) {
                if (err) {
                    sails.log.error('Dashboard error: ', err);
                    res.send(err, 500);
                } else {
                    var resultIds = [];
                    if(response[0]){
                        for(var i = 0; i < response.length; i++) {
                            resultIds[i] = response[i].result_id;
                        }
                        callback(resultIds);
                    } else {
                        callback(resultIds);
                    }
                }
            });
    },

    getSeenStatus: function (userId, type, result, res, callback) {
        if (result){
            if (result.rows) {
                Dashboard.find()
                    .where({user_id: userId, tab_type: type})
                    .exec(function (err, dashboardResults) {
                        if (err) {
                            sails.log.error('Error: ' + err);
                            return res.send(err, 500);
                        } else {
                            var dashLength = dashboardResults.length,
                                resultLength = result.rows.length;
                            var unSeenCounter = 0;
                            for (var i = 0; i < dashLength; i++) {
                                for (var j = 0; j < resultLength; j++) {
                                    if (result.rows[j].id === dashboardResults[i].result_id) {
                                        result.rows[j].is_seen = dashboardResults[i].is_seen;
                                        if(!dashboardResults[i].is_seen){
                                            result.anyUnSeen = true;
                                            unSeenCounter = unSeenCounter + 1;
                                        }
                                    }
                                }
                            }
                            result.unSeenCounter = unSeenCounter;
                            callback(result);
                        }
                    })
            } else {
                callback(result);
            }
        } else {
            var results = null;
            callback(results);
        }
    },

    getSkills: function(studentId, res, callback) {
        var query = "SELECT name FROM skill WHERE CAST(student_id as FLOAT) = " + studentId;
        Skill.query(query, null, function (err, skills) {
            if (err) {
                sails.log.error('Error: ' + err);
                res.send(err, 500);
            }
            else {
                var userSkills = null;
                if (skills.rows[0]) {
                    userSkills = skills.rows;
                    callback(userSkills);
                }
                else {
                    userSkills = null;
                    callback(userSkills);
                }
            }
        })
    }
};
