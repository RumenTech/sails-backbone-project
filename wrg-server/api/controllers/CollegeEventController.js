"use strict";

module.exports = {
    create: function(req, res) {
        try {
            College.findMe(req.session.user.id, function(err, college) {
                if (err) {
                    res.send({message : err.message})
                } else {
                    req.body.college_id = college.id;
                    CollegeEvent.new_update(req.body, function(err, event) {
                        try {
                            if (err) {
                                return res.send(err, 500);
                            } else {
                                event.date = CollegeEvent.getDateFormat(event.date);
                                return res.send(event, 200);
                            }
                        } catch (err) {
                            return res.send({message : err.message}, 500);
                        }
                    });
                }
            });
        } catch(err) {
            return res.send({message : err.message}, 500);
        }
    },

    update: function(req, res) {
        try {
            College.findMe(req.session.user.id, function(err, college) {
                if (err) {
                    res.send({message : err.message})
                } else {
                    req.body.college_id = college.id;
                    CollegeEvent.new_update(req.body, function(err, event){
                        try{
                            if (err) {
                                return res.send(err, 500);
                            } else {
                               event.date = CollegeEvent.getDateFormat(event.date);
                                return res.send(event, 200);
                            }
                        } catch (err) {
                            return res.send({message : err.message}, 500);
                        }
                    });
                }
            });
        } catch(err) {
            return res.send({message : err.message}, 500);
        }
    },

    destroy: function(req, res) {
        try {
            CollegeEvent.new_update(req.session.req.body, function(err, events) {
                try {
                    if (err) {
                        return res.send(err, 500);
                    } else {
                        console.log('Event deleted');
                        return res.send(events, 200);
                    }
                }catch (err){
                    return res.send({message : err.message}, 500);
                }
            }, 'remove');
        } catch (err) {
            return res.send({message : err.message}, 500);
        }
    },

    _config: {}
};
