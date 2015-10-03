var async = require('async');

module.exports = {

    //TODO: DEFENSES!!!!!!

    create:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group Events Create");
            return  res.view('404');
        }
        try {
            var userId = req.session.user.id;
            GroupUser.find()
                .where({ user_id:userId,
                    group_id:req.body.group_id})
                .exec(function (err, users) {
                    var userRole = users[0].role;
                    if (userRole === 'admin' || userRole === 'moderator') {

                        GroupEvent.find()
                            .where({
                                group_id:req.body.group_id})
                            .exec(function (err, events) {

                                if (events.length > 4) {
                                    res.send('There are already 5 created events. You have to delete some event in order to add new one', 500);
                                }
                                else {

                                    GroupEvent.create(req.body).done(function (err, event) {
                                        if (err) {
                                            sails.log.error("Cannot create event: ", err);
                                            res.send('Cannot create event', 500);
                                        } else {
                                            sails.log.info('Group event created');
                                            res.send(event, 200);
                                        }
                                    });
                                }
                            });
                    }
                });
        } catch (err) {
            return res.send({message:err}, 500);
        }
    },

    update:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group Events update");
            return  res.view('404');
        }
        var id = conversionutils.returnInteger(req.param('id'), 'Could not convert group event id');
        try {
            var userId = req.session.user.id;
            GroupUser.find()
                .where({ user_id:userId,
                    group_id:req.body.group_id})
                .exec(function (err, users) {
                    var userRole = users[0].role;
                    if (userRole === 'admin' || userRole === 'moderator') {
                        GroupEvent.update({id:id}, req.body, function (err, event) {
                            if (err) {
                                sails.log.error("Error updating group event: ", err);
                                res.send(err, 500);
                            } else {
                                sails.log.info("Event updated");
                                res.send(event, 200);
                            }
                        });
                    }
                    else {
                        return res.send({message:"You don't have permissions to edit event."}, 401);
                    }
                });

        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    },

    destroy:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group Event Destroy");
            return  res.view('404');
        }
        var id = conversionutils.returnInteger(req.param('id'), 'Could not convert group event id');
        try {
            var userId = req.session.user.id;
            GroupEvent.find()
                .where({id:id})
                .done(function (err, events) {
                    if (err) {
                        return res.send({message:err}, 500);
                    } else {

                        GroupUser.find()
                            .where({user_id:userId,
                                group_id:events[0].group_id})
                            .done(function (err, groupUser) {

                                if (groupUser) {

                                    if (groupUser[0].role !== "admin" && groupUser[0].role !== "moderator") {
                                        return res.send({message:"You don't have permissions to delete event."}, 401);
                                    }
                                    else {
                                        GroupEvent.destroy({id:id}, function (err, event) {
                                            if (err) {
                                                sails.log.error("Error deleting group event: ", err);
                                                res.send(err, 500);
                                            } else {
                                                sails.log.info("Event deleted");
                                                res.send(event, 200);
                                            }
                                        });
                                    }
                                }
                                else {
                                    return res.send({message:"You don't have permissions to delete event."}, 401);
                                }

                            });


                    }
                });
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    }
};
