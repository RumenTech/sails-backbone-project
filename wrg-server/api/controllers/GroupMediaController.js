'use strict';

module.exports = {

    create: function(req,res){
        try{
            GroupMedia.create(req.body).done(
                function(err, group_media){
                    try{
                        if (err) {
                            sails.log.error("Error create media", err.detail);
                            res.send(err, 500);
                        } else {
                            res.send(group_media, 200);
                        }
                    } catch(err) {
                        return res.send(err.message, 500);
                    }
                }
            );
        } catch(err) {
            return res.send(err.message, 500);
        }
    },

    update: function(req,res){
        try{
            var id = req.param("id");
            GroupMedia.update({id: id}, req.body, function(err, group_media){
                try {
                    if (err) {
                        sails.log.error("Error updating media", err);
                        res.send(err.detail, 500);
                    } else {
                        res.send(group_media, 200);
                    }
                } catch(err) {
                    return res.send(err.message, 500);
                }
            });
        } catch(err) {
            return res.send(err.message, 500);
        }

    },
    destroy: function(req, res) {
        try {
            GroupMedia.destroy({id: req.body.id}).done(function(err, group_media) {
                try {
                    if (err) {
                        sails.log.error("Error destroying media", err);
                        res.send(err.detail, 500);
                    } else {
                        res.send(group_media, 200);
                    }
                } catch (err) {
                    res.send(err, 500);
                }
            });
        } catch (err) {
            return res.send({message : err.message}, 500);
        }
    },

    _config: {}


};
