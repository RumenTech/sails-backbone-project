/**
 * Created by semir.sabic on 16.4.2014.
 */
module.exports = {
    create:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated to add resource");
            return  res.view('404');
        }
        try {
            var userId = req.session.user.id;
            CareerPathTab.getUserInfo(req, function(data){
                if(!data.error){
                    var resource = req.body;
                    resource.college_id = data.school_list_id;
                    CareerPathResource.create(resource).done(function (err, post) {
                        if (err) {
                            sails.log.error("Cannot create resource: ", err);
                            res.send(err, 500);
                        } else {
                            sails.log.info("Resource created");
                            res.send(post, 200);
                        }
                    });
                }
                else{
                    return res.send(data.error, 500);
                }
            });
        } catch (err) {
            sails.log.error('ERROR: ' + err.message);
            return res.send({message:err}, 500);
        }
    },

    update:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated to update resource");
            return  res.view('404');
        }
        var id = conversionutils.returnInteger(req.param('id'), 'Could not convert resource id');
        if (id !== null && id !== undefined) {
            try {
                var userId = req.session.user.id;

                CareerPathResource.find()
                    .where({id:id})
                    .done(function (err, post) {
                        if (err) {
                            return res.send({message:err}, 500);
                        } else {
                            if (post[0].user_id !== userId) {
                                return res.send({message:"You don't have permissions to edit resource."}, 401);
                            }
                            else {
                                CareerPathResource.update({id:id}, req.body, function (err, event) {
                                    if (err) {
                                        sails.log.error("Error updating resource: ", err);
                                        res.send(err, 500);
                                    } else {
                                        sails.log.info("Post updated");
                                        res.send(event, 200);
                                    }
                                });
                            }
                        }
                    });
            } catch (err) {
                return res.send({message:err.message}, 500);
            }
        } else {
            sails.log.error("Resource id is not valid");
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
            CareerPathResource.find({id: id}, function(err, resource){
                if (err) {
                    sails.log.error("Error deleting resource: ", err);
                    res.send(err, 500);
                } else {
                    var userRole = req.session.user.role;
                    if(resource[0].user_id === userId || userRole === 'college' || userRole === 'admin'){
                        CareerPathResource.deleteResource(id, function(flag){
                            if(flag === true){
                                sails.log.info('Resource deleted');
                                res.send(true, 200);
                            }
                            else{
                                res.send('Error occured while deleting resource', 500);
                            }
                        });
                    }
                    else{
                        sails.log.error('Not authorized to delete resource with id ' + id);
                        res.send(err, 500);
                    }
                }
            });
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    },

    getResources: function(req, res){
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated to delete resource");
            return  res.view('404');
        }
        try{
            var catId = req.param('catId');
            var userId = req.session.user.id;
            CareerPathTab.getUserInfo(req, function(data){
                if(!data.error){
                    CareerPathResource.getResourcesByCategoryId(res, data.school_list_id, catId, function(err, resources){
                        if(err){
                            sails.log.error('Cannot get resources for category with id ' + catId);
                            return res.send({message: err.message}, 500);
                        }
                        else{
                            return res.send(resources, 200);
                        }
                    });
                }
                else{
                    return res.send(data.error, 500);
                }
            });

        }
        catch(err){
            sails.log.error(err.message);
            return res.send(err.message, 500);
        }

    }
};