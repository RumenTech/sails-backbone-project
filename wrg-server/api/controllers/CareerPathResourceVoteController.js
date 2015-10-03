/**
 * Created by semir.sabic on 16.4.2014.
 */
module.exports = {
    create:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated to add resource vote");
            return  res.view('404');
        }
        try {
            CareerPathResourceVote.find({user_id: req.session.user.id, resource_id: req.body.resource_id}, function(err, vote){
                if(err){
                    sails.log.error("Error getting resource vote");
                    res.send(err, 500);
                }
                else{
                    if(vote[0]){
                        sails.log.error("User already voted");
                        res.send(err, 500);
                    }
                    else{
                        CareerPathResourceVote.create(req.body).done(function (err, vote) {
                            if (err) {
                                sails.log.error("Cannot add vote on resource: ", err);
                                return res.send(err, 500);
                            } else {
                                sails.log.info("Vote added to resource");
                                return res.send(vote, 200);
                            }
                        });
                    }
                }
            });
        } catch (err) {
            sails.log.error("Unexpected error occurred while creating vote");
            return res.send({message:err.message}, 500);
        }
    },

    destroy:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated to delete resource vote");
            return  res.view('404');
        }
        var id = conversionutils.returnInteger(req.param('id'), 'Could not convert resource id');
        try {
            var userId = req.session.user.id;
            CareerPathResourceVote.find({id: id}, function(err, vote){
                if (err) {
                    sails.log.error("Error deleting resource vote: ", err);
                    res.send(err, 500);
                } else {
                    if(vote[0].user_id === userId){
                        CareerPathResourceVote.destroy({id:id}, function(err, vote){
                            if(err){
                                sails.log.error('Error while deleting resource vote with id ' + id);
                                return res.send(err, 500);
                            }else{
                                sails.log.info('Resource vote with id ' + id + 'deleted successfully');
                                return res.send(vote, 200);
                            }
                        });
                    }
                    else{
                        sails.log.error('Not authorized to delete resource vote with id' + id);
                        res.send(err, 500);
                    }
                }
            });
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    }
};