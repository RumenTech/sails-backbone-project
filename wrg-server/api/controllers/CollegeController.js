"use strict";

var mc = (require('../../config/mainConfig.js')());


module.exports = {

    me: function(req,res) {
        try {
            var query = "SELECT College.* " +
                " FROM College, " + mc.dbSettings.dbName + ".public.User as UserTable, CollegeUser "+
                " WHERE UserTable.id = '" + req.session.user.id + "' AND " +
                " CollegeUser.user_id = UserTable.id AND "+
                " CollegeUser.college_id = College.id";

            College.query(query, null, function(err, request) {
                try{
                    if (err) {
                        return res.send({ message : err.message },500);
                    } else {
                        if (request.rows.length == 1) {
                            var college = request.rows[0];
                            CollegeCandidates.findByCollege_id(college.id).done(
                                function (err, college_candidates) {
                                    try {
                                        if (err) {
                                            return res.send({ message : err.message }, 500);
                                        } else {
                                            college.candidates = college_candidates;
                                            CollegeEvent.findByCollege_id(college.id).done(
                                                function (err, college_events) {
                                                    try {
                                                        if(err) {
                                                            return res.send({ message : err.message }, 500);
                                                        } else {
                                                            var currentDate = new Date();
                                                            var events = [];
                                                            for (var i = 0; i < college_events.length; i++) {
                                                                if(college_events[i].date >= currentDate){
                                                                    var event = college_events[i];
                                                                    var datetime = event.date;
                                                                    event.date = CollegeEvent.getDateFormat(datetime);
                                                                    events.push(event);
                                                                }
                                                            }
                                                            college.events = events;
                                                            CollegeMedia.findByCollege_id(college.id).done(
                                                                function (err, college_media) {
                                                                    try {
                                                                        if(err) {
                                                                            return res.send({ message : err.message }, 500);
                                                                        } else {
                                                                            college.media = college_media;
                                                                            return res.send(college, 200);
                                                                        }
                                                                    } catch(err) {
                                                                        return res.send({ message : err.message }, 500)
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    } catch(err) {
                                                        return res.send({ message : err.message }, 500)
                                                    }
                                                }
                                            );
                                        }
                                    } catch(err) {
                                        return res.send({ message : err.message }, 500)
                                    }
                                }
                            );
                        } else {
                            return res.send({ message : "No college found" }, 500);
                        }
                    }
                } catch(err) {
                    res.send({ message : err.message }, 500);
                }
            });
        } catch(err) {
            res.send({ message : err.message }, 500);
        }
    },

    update: function(req, res){
        console.log("update college");
        try {
            var query = "SELECT College.* " +
                " FROM College, " + mc.dbSettings.dbName + ".public.User as UserTable, CollegeUser "+
                " WHERE UserTable.id = '" + req.session.user.id + "' AND " +
                " CollegeUser.user_id = UserTable.id AND "+
                " CollegeUser.college_id = College.id  ";

            College.query(query, null, function(err, request) {
                try {
                    if (err) {
                        return res.send({message : err.message}, 500);
                    } else {
                        if (request.rows.length === 1) {
                            var college = request.rows[0];
                            College.update({id : college.id }, req.body, function(err, college){
                                try{
                                    if (err) {
                                        res.send({message : err.message}, 500);
                                    } else {
                                        if (college.length === 1) {
                                            college = college[0];
                                            CollegeCandidates.findByCollege_id(college.id).done(
                                                function(err, college_candidate) {
                                                    try{
                                                        if (err) {
                                                            return res.send({message : err.message}, 500);
                                                        } else {
                                                            college.candidates = college_candidate;
                                                            CollegeEvent.findByCollege_id(college.id).done(
                                                                function (err, college_events) {
                                                                    try {
                                                                        if(err) {
                                                                            return res.send({ message : err.message }, 500);
                                                                        } else {
                                                                            college.events = college_events;
                                                                            for (var i = 0; i < college.events.length; i++) {
                                                                                var datetime = college.events[i].date;
                                                                                college.events[i].date = CollegeEvent.getDateFormat(datetime);
                                                                            }
                                                                            return res.send(college, 200);
                                                                        }
                                                                    } catch(err) {
                                                                        return res.send({ message : err.message }, 500)
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    } catch(err){
                                                        return res.send({message : err.message}, 500)
                                                    }
                                                }


                                            );
                                        } else {
                                            return res.send({message : "No college updated"} ,500);
                                        }
                                    }
                                } catch(err) {
                                    res.send({message : err.message}, 500);
                                }
                            });
                        } else {
                            return res.send({message : "No college found"}, 500);
                        }
                    }
                } catch(err) {
                    res.send({ message : err.message }, 500);
                }
            });
        } catch(err) {
            res.send({message : err.message}, 500);
        }
    },

    friends: function (req, res) {
        //Defense - Authenticated user
        if(!req.isAuthenticated()) {
            return res.view('404');
        }

        try {

            var limit = req.param('limit');
            limit = limit || 10;

            var offset = req.param('offset');
            offset = offset || 0;

            var name = req.param('name');
            name = name || '';

            var city = req.param('city');
            city = city || '';

            var state = req.param('state');
            state = state || '';

            var query = "SELECT id, city, state, name, profile_image " +
                " FROM College " +
                " WHERE ( lower(College.name) LIKE lower('%" + name + "%') OR lower(College.tagline) LIKE lower('%" + name + "%') ) " +
                " AND (lower(College.state) LIKE lower('%" + state + "%')  OR College.state is NULL) " +
                " AND (lower(College.city) LIKE lower('%" + city + "%') OR College.city is NULL) " +
                " ORDER BY char_length(College.profile_image) ASC " +
                " LIMIT " + limit + " OFFSET " + offset;

            Connection.query(query, null,
                function (err, connections) {
                    try {
                        if (err) {
                            console.log(err.message);
                            res.send(err.message, 500);
                        } else {
                            return res.send({request: connections.rows}, 200);
                        }
                    } catch (err) {
                        console.log(err.message);
                        return res.send(err.message, 500);
                    }
                });

        } catch (err) {
            return res.send(err.message, 500);
        }
    },

    getbyid: function(req, res){
        if(!req.isAuthenticated()) {
            return res.send('Unauthorized', 401);
        };

        try {
            if(req){
                if(req.param('id')){
                    var collegeId = req.param('id');

                    College.find({id: collegeId}).done(function(err, coll){
                        if (err) {
                            return res.send({message: err.message}, 500);
                        } else {
                            if (coll.length === 1) {
                                College.getCollegeData(coll[0], res);
                            } else {
                                return res.send({message: "No College found"}, 500);
                            };
                        };
                    });
                };
            };
        } catch (err) {
            res.send({message: err.message}, 500);
        };
    },

    _config: {}
};
