/**
 * Created by semir.sabic on 16.4.2014.
 */
module.exports = {
    create:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated to add resource comment");
            return  res.view('404');
        }
        try {
            CareerPathResourceComment.create(req.body).done(function (err, comment) {
                if (err) {
                    sails.log.error("Cannot add comment on resource: ", err);
                    return res.send(err, 500);
                } else {
                    sails.log.info("Comment added to resource");
                    return res.send(comment, 200);
                }
            });
        } catch (err) {
            return res.send({message:err}, 500);
        }
    },

    update:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated to update resource comment");
            return  res.view('404');
        }
        var id = conversionutils.returnInteger(req.param('id'), 'Could not convert resource comment id');
        if (id !== null && id !== undefined) {
            try {
                var userId = req.session.user.id;

                CareerPathResourceComment.find()
                    .where({id:id})
                    .done(function (err, comment) {
                        if (err) {
                            return res.send({message:err}, 500);
                        } else {
                            if (comment[0].user_id !== userId) {
                                return res.send({message:"You don't have permissions to add comment on resource."}, 401);
                            }
                            else {
                                CareerPathResourceComment.update({id:id}, req.body, function (err, event) {
                                    if (err) {
                                        sails.log.error("Error while adding comment to resource: ", err);
                                        return res.send(err, 500);
                                    } else {
                                        sails.log.info("Comment added to resource");
                                        return res.send(event, 200);
                                    }
                                });
                            }
                        }
                    });
            } catch (err) {
                return res.send({message:err.message}, 500);
            }
        } else {
            sails.log.error("Resource comment id is not valid");
            return res.send({message:err.message}, 500);
        }

    },

    destroy:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated to delete resource");
            return  res.view('404');
        }
        var id = conversionutils.returnInteger(req.param('id'), 'Could not convert resource id');
        try {
            var userId = req.session.user.id;
            CareerPathResourceComment.find({id: id}, function(err, comment){
                if (err) {
                    sails.log.error("Error deleting resource comment: ", err);
                    res.send(err, 500);
                } else {
                    var userRole = req.session.user.role;
                    if(comment[0].user_id === userId || userRole === 'college' || userRole === 'admin'){
                        CareerPathResourceComment.destroy({id:id}, function(err){
                            if(err){
                                sails.log.error('Error while deleting resource comment with id ' + id);
                                return res.send(err, 500);
                            }else{
                                sails.log.info('Resource comment with id ' + id + ' deleted successfully');
                                return res.send('OK', 200);
                            }
                        });
                    }
                    else{
                        sails.log.error('Not authorized to delete resource comment with id' + id);
                        res.send(err, 500);
                    }
                }
            });
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    },

    getComments: function(req, res){
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated to delete resource");
            return  res.view('404');
        }
        try{
            var resId = req.param('resId'),
                userId = req.session.user.id;
            var userRole = req.session.user.role;
            CareerPathResourceComment.getCommentsByResourceId(res, resId, userId, userRole, function(err, comments){
                if(err){
                    sails.log.error('Cannot get resources for category with id ' + resId);
                    return res.send({message: err.message}, 500);
                }
                else{
                    sails.log.info('Found comments, sending them back!');
                    res.send(comments, 200);
                }
            });
        }
        catch(err){
            sails.log.error(err.message);
            return res.send(err.message, 500);
        }
    },

    getNumberOfComments: function (req, res) {
        var resId = req.param('resId');
        var query = 'SELECT CareerPathResourceComment.resource_id, COUNT(*) FROM CareerPathResourceComment' +
            ' WHERE CareerPathResourceComment.resource_id = ' + resId + ' GROUP BY CareerPathResourceComment.resource_id';
        CareerPathResourceComment.query(query, null, function(err, comments) {
            try {
                if (err) {
                    return res.send({ message : err.message }, 500);
                } else {
                    return res.send(comments, 200);
                }
            } catch (err) {
                return res.send({ message : err.message }, 500);
            }
        });
    }


};